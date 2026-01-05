
import fs from "fs";
import path from "path";
import { User, Program, Enrollment, Session, ScheduleEvent } from "../lib/types";

// Helper to make IDs safe
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const safeId = (text: string) => slugify(text) || "unknown";

// Helper to normalize Time strings to "h:mm A" format
const normalizeTime = (raw: string): string => {
    // Remove spaces, convert to upper
    let clean = raw.trim().toUpperCase().replace(/\s/g, "");

    // Handle "9AM" -> "9:00 AM"
    // Handle "10:30AM" -> "10:30 AM"
    // Handle "2:30pm" -> "2:30 PM"
    // Handle "SUNDAY7PM" -> "7:00 PM" (Strip Day prefix if present)

    // Remove known day names from time string if any
    ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].forEach(d => {
        clean = clean.replace(d, "");
    });

    // Regex: Match (H or HH) (possible :MM) (AM or PM)
    const match = clean.match(/^(\d{1,2})(:(\d{2}))?(AM|PM)$/);
    if (!match) return raw; // Return raw if unpredictable

    let hour = match[1];
    let min = match[3] || "00";
    let meridian = match[4];

    return `${hour}:${min} ${meridian}`;
};

// Helper to normalize Day to Title Case
const normalizeDay = (day: string): string => {
    const d = day.trim().toUpperCase();
    if (d === "MONDAY") return "Monday";
    if (d === "TUESDAY") return "Tuesday";
    if (d === "WEDNESDAY") return "Wednesday";
    if (d === "THURSDAY") return "Thursday";
    if (d === "FRIDAY") return "Friday";
    if (d === "SATURDAY") return "Saturday";
    if (d === "SUNDAY") return "Sunday";
    return day;
};

// Helper to parse CSV manually
const parseCsv = (content: string) => {
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    return lines.map(line => line.split(",").map(c => c.trim()));
};

export function parseImports(dataDir: string) {
    // 1. Load Files
    const groupKeyRaw = fs.readFileSync(path.join(dataDir, "group_key.csv"), "utf-8");
    const morningRaw = fs.readFileSync(path.join(dataDir, "morning_group_rosters.csv"), "utf-8");
    const eveningRaw = fs.readFileSync(path.join(dataDir, "evening_group_rosters.csv"), "utf-8");

    const programs = new Map<string, Program>();
    const users = new Map<string, User>();
    const enrollments: Enrollment[] = [];
    const scheduleEvents: ScheduleEvent[] = [];

    // Default Admin
    users.set("admin-1", {
        id: "admin-1",
        name: "System Admin",
        email: "admin@example.com",
        role: "admin",
        phone: "555-0100"
    });

    // --- 2. Parse Group Key (Schedule + Programs + Facilitators) ---
    const groupLines = parseCsv(groupKeyRaw);
    const dayHeaders = groupLines[0]; // #, MONDAY, #.1, TUESDAY ...

    // Map column index to Day ("MONDAY", "TUESDAY"...)
    const dayMap = new Map<number, string>();
    dayHeaders.forEach((header, idx) => {
        const clean = header.toUpperCase();
        if (["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].includes(clean)) {
            dayMap.set(idx, normalizeDay(clean));
        }
    });

    // Iterate rows to find classes
    for (let r = 1; r < groupLines.length; r++) {
        const row = groupLines[r];
        dayMap.forEach((day, colIdx) => {
            if (colIdx >= row.length) return;
            const cell = row[colIdx];
            if (!cell || cell.length < 3) return;

            // Parse cell
            const pipeIndex = cell.indexOf('|');
            if (pipeIndex === -1) return;

            const timeRaw = cell.substring(0, pipeIndex).trim();
            const timeNormalized = normalizeTime(timeRaw);
            const remainder = cell.substring(pipeIndex + 1).trim();

            let className = remainder;
            let facilitatorName = "Unknown";

            if (remainder.includes("w/")) {
                const parts = remainder.split("w/");
                className = parts[0].trim();
                facilitatorName = parts[1].trim();
            } else {
                const words = remainder.split(" ");
                if (words.length > 2) {
                    const last = words[words.length - 1];
                    if (/^[A-Z][a-z]+$/.test(last)) {
                        facilitatorName = last;
                        className = words.slice(0, -1).join(" ");
                    }
                }
            }

            className = className.replace("(closed)", "").replace("Closed", "").trim();

            // Create Program
            const progId = safeId(className);
            if (!programs.has(progId)) {
                programs.set(progId, {
                    id: progId,
                    slug: progId,
                    name: className,
                    description: `Session held on ${day}s`,
                    totalSessions: 12,
                    type: "Core",
                    isLocked: false,
                    sessions: Array.from({ length: 12 }).map((_, i) => ({
                        id: `${progId}-s${i + 1}`,
                        programId: progId,
                        sessionNumber: i + 1,
                        title: `Session ${i + 1}`,
                        purpose: "Topic TBD",
                        objectives: [],
                        facilitatorPrompts: [],
                        activityTemplates: [],
                        homeworkTemplate: null,
                        journalTemplateId: null,
                        caseworxNoteTemplate: ""
                    }))
                });
            }

            // Create Facilitator
            const facId = safeId(facilitatorName);
            if (facilitatorName !== "Unknown" && !users.has(facId)) {
                users.set(facId, {
                    id: facId,
                    name: facilitatorName,
                    email: `${facId}@dms.com`,
                    role: "facilitator",
                    phone: "555-0101"
                });
            }

            // Create Schedule Event
            scheduleEvents.push({
                id: `evt-${day}-${safeId(timeRaw)}-${progId}`,
                programId: progId,
                programName: className,
                facilitatorId: facId,
                facilitatorName: facilitatorName,
                date: "2025-01-01",
                dayOfWeek: day,
                time: timeNormalized,
                location: "Main Center",
                active: true,
                sessionId: "session-1",
                sessionNumber: 1
            });
        });
    }

    // --- 3. Parse Rosters (Enrollments) ---
    // Helper to process roster file
    const processRosterFile = (content: string, timeBlockName: string) => {
        const rows = parseCsv(content);
        let currentClassMap = new Map<number, { time: string, prog: string, fac: string }>();

        for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            const isHeader = row.some(cell => cell.includes("|"));

            if (isHeader) {
                currentClassMap.clear();
                row.forEach((cell, cIdx) => {
                    if (cell && cell.includes("|")) {
                        const pipeIdx = cell.indexOf("|");
                        const timeRaw = cell.substring(0, pipeIdx).trim();
                        const timeNorm = normalizeTime(timeRaw);
                        const remainder = cell.substring(pipeIdx + 1).trim();

                        let className = remainder;
                        let facName = "Unknown";
                        if (remainder.includes("w/")) {
                            const p = remainder.split("w/");
                            className = p[0].trim();
                            facName = p[1].trim();
                        }
                        className = className.replace("(closed)", "").replace("Closed", "").trim();

                        currentClassMap.set(cIdx, {
                            time: timeNorm,
                            prog: className,
                            fac: facName
                        });
                    }
                });
                continue;
            }

            if (currentClassMap.size > 0 && row.some(c => c && c.length > 2)) {
                if (row[0]?.startsWith("Mentor")) continue;

                currentClassMap.forEach((meta, cIdx) => {
                    if (cIdx >= row.length) return;
                    let participantName = row[cIdx];
                    if (!participantName || participantName.length < 2 || participantName.includes("---") || participantName === "CLOSED GROUP") return;

                    participantName = participantName.trim();
                    const partId = safeId(participantName);
                    const progId = safeId(meta.prog);

                    if (!users.has(partId)) {
                        users.set(partId, {
                            id: partId,
                            name: participantName,
                            email: `${partId}@example.com`,
                            role: "participant",
                            phone: "555-0199",
                            dateOfBirth: "1990-01-01",
                            caseNumber: `CASE-${Math.floor(Math.random() * 10000)}`
                        });
                    }

                    if (!programs.has(progId)) {
                        programs.set(progId, {
                            id: progId,
                            slug: progId,
                            name: meta.prog,
                            description: "From Roster Import",
                            totalSessions: 10,
                            type: "Core",
                            isLocked: false,
                            sessions: []
                        });
                    }

                    enrollments.push({
                        id: `enr-${partId}-${progId}`,
                        participantId: partId,
                        programId: progId,
                        currentSessionNumber: 1,
                        status: "active",
                        startedAt: new Date().toISOString(),
                        schedule: {
                            day: "Monday", // Default, patching below
                            time: meta.time,
                            room: "Main",
                            facilitatorId: safeId(meta.fac)
                        }
                    });
                });
            }
        }
    };

    // Process Rosters
    processRosterFile(morningRaw, "Morning");
    processRosterFile(eveningRaw, "Evening");

    // Post-Process Matches from Schedule Events
    const scheduleLookup = new Map<string, string>(); // "prog-time" -> Day
    scheduleEvents.forEach(evt => {
        scheduleLookup.set(`${evt.programId}-${evt.time}`, evt.dayOfWeek);
    });

    enrollments.forEach(enr => {
        if (!enr.schedule) return;
        // Try strict match first
        let key = `${enr.programId}-${enr.schedule.time}`;
        if (scheduleLookup.has(key)) {
            enr.schedule.day = scheduleLookup.get(key)!;
        } else {
            // Fallback: Just by Program ID if unique?
            // Risky if program runs multiple days.
            // Manual Fix for "Monday (#2)" implication?
            // Most classes in rosters align with schedule events.
        }
    });

    return {
        users: Array.from(users.values()),
        programs: Array.from(programs.values()),
        enrollments,
        scheduleEvents
    };
}
