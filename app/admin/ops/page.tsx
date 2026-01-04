import { redirect } from "next/navigation";
import { getDb } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { OpsClient } from "./ops-client";

export const dynamic = "force-dynamic";

// Helper to sanitize Firestore data explicitly
function sanitizeForClient(value: any): any {
    if (value === null || value === undefined) {
        return value;
    }

    // Handle Firestore Timestamp (duck typing)
    if (typeof value.toDate === 'function') {
        try {
            return value.toDate().toISOString();
        } catch (e) {
            return null;
        }
    }

    // Handle Date
    if (value instanceof Date) {
        return value.toISOString();
    }

    // Handle Array
    if (Array.isArray(value)) {
        return value.map(sanitizeForClient);
    }

    // Handle Object
    if (typeof value === 'object') {
        const out: any = {};
        for (const key in value) {
            out[key] = sanitizeForClient(value[key]);
        }
        return out;
    }

    return value;
}

export default async function AdminOpsPage({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    const user = await getAuthenticatedUser();

    if (!user || user.role !== "admin") {
        redirect("/login");
    }

    const db = getDb();

    // Default to today in NY (User's timezone roughly)
    // If date is provided, use it.
    let targetDate = searchParams.date;
    if (!targetDate) {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: "America/New_York",
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(now);

        const y = parts.find(p => p.type === 'year')?.value;
        const m = parts.find(p => p.type === 'month')?.value;
        const d = parts.find(p => p.type === 'day')?.value;
        targetDate = `${y}-${m}-${d}`;
    }

    // Schedule Events
    const eventsSnap = await db
        .collection("scheduleEvents")
        .where("date", "==", targetDate)
        .get();

    const events = eventsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));

    // Enrollments (Active)
    const enrollmentsSnap = await db
        .collection("enrollments")
        .where("status", "==", "active")
        .get();

    const enrollments = enrollmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Users (Participants) for names
    const usersSnap = await db
        .collection("users")
        .where("role", "==", "participant")
        .get();

    const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Attendance for today
    let attendance: any[] = [];
    try {
        const attSnap = await db.collectionGroup("attendance").where("date", "==", targetDate).get();
        attendance = attSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error("Error fetching attendance by date:", e);
    }

    // Takeaways (Homework)
    const sessionIds = Array.from(new Set(events.map((e: any) => e.sessionId))).filter(Boolean);
    let takeaways: any[] = [];

    if (sessionIds.length > 0) {
        try {
            const takeawaysSnap = await db.collectionGroup("homeworkSubmissions")
                .where("sessionId", "in", sessionIds)
                .get();
            takeaways = takeawaysSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
            console.error("Error fetching takeaways:", e);
        }
    }

    return (
        <OpsClient
            initialDate={targetDate}
            events={sanitizeForClient(events)}
            enrollments={sanitizeForClient(enrollments)}
            users={sanitizeForClient(users)}
            attendance={sanitizeForClient(attendance)}
            takeaways={sanitizeForClient(takeaways)}
        />
    );
}
