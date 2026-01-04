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

export default async function AdminOpsPage() {
    const user = await getAuthenticatedUser();

    if (!user || user.role !== "admin") {
        redirect("/login");
    }

    const db = getDb();

    // Fetch all participants
    const usersSnap = await db
        .collection("users")
        .where("role", "==", "participant")
        .get();
    const participants = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Fetch all programs
    const programsSnap = await db.collection("programs").get();
    const programs = programsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Fetch all enrollments
    const enrollmentsSnap = await db.collection("enrollments").get();
    const enrollments = enrollmentsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Fetch all attendance records (for absence review)
    const attendanceSnap = await db.collectionGroup("attendance").get();
    const attendance = attendanceSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Fetch all facilitators for assignment dropdowns
    const facilitatorsSnap = await db.collection("users").where("role", "==", "facilitator").get();
    const facilitators = facilitatorsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Fetch makeup assignments
    const makeupSnap = await db.collection("makeupAssignments").get();
    const makeupAssignments = makeupSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Fetch all schedule events
    const eventsSnap = await db.collection("scheduleEvents").get();
    const allEvents = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return (
        <OpsClient
            participants={sanitizeForClient(participants)}
            programs={sanitizeForClient(programs)}
            enrollments={sanitizeForClient(enrollments)}
            attendance={sanitizeForClient(attendance)}
            facilitators={sanitizeForClient(facilitators)}
            allEvents={sanitizeForClient(allEvents)}
            makeupAssignments={sanitizeForClient(makeupAssignments)}
        />
    );
}
