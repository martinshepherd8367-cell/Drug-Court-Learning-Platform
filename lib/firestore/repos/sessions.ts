import { getDb } from "@/lib/firebase-admin";

export type CompletedSessionRecord = {
    id: string;
    classId: string;
    programId: string;
    sessionNumber: number;
    facilitatorId: string;
    completedAt: string;
    attendeeIds: string[];
    absenteeIds: string[];
    excusedIds: string[];
};

type NewCompletedSession = Omit<CompletedSessionRecord, "id">;

export class SessionsRepo {
    static col() {
        return getDb().collection("completed_sessions");
    }

    static async markCompleted(data: NewCompletedSession): Promise<string> {
        // Idempotency: check if already exists for this class, program, sessionNumber
        const existing = await this.col()
            .where("classId", "==", data.classId)
            .where("programId", "==", data.programId)
            .where("sessionNumber", "==", data.sessionNumber)
            .limit(1)
            .get();

        if (!existing.empty) {
            return existing.docs[0].id;
        }

        const ref = await this.col().add(data);
        return ref.id;
    }

    static async listCompleted(classId: string): Promise<CompletedSessionRecord[]> {
        const snap = await this.col()
            .where("classId", "==", classId)
            .get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as CompletedSessionRecord));
    }
}
