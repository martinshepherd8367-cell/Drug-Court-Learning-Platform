import { getDb } from "@/lib/firebase-admin";

export type AttendanceRecord = {
    id: string;
    participantId: string;
    sessionId: string;
    classId: string;
    date: string; // ISO Date YYYY-MM-DD
    status: "present" | "absent" | "late" | "pending";
    attended: boolean;
    timestamp: string;
    isVirtual?: boolean;
    verified?: boolean;
};

type NewAttendanceRecord = Omit<AttendanceRecord, "id">;

export class AttendanceRepo {
    static col(participantId: string) {
        return getDb().collection("users").doc(participantId).collection("attendance");
    }

    static async listForParticipant(participantId: string, limit = 100): Promise<AttendanceRecord[]> {
        const snap = await this.col(participantId)
            .orderBy("timestamp", "desc")
            .limit(limit)
            .get();

        return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as NewAttendanceRecord) }));
    }

    static async recordAttendance(data: NewAttendanceRecord): Promise<string> {
        const query = await this.col(data.participantId)
            .where("sessionId", "==", data.sessionId)
            .limit(1)
            .get();

        if (!query.empty) {
            const doc = query.docs[0];
            await doc.ref.update(data as any);
            return doc.id;
        }

        const ref = await this.col(data.participantId).add(data);
        return ref.id;
    }

    static async updateStatus(id: string, participantId: string, status: AttendanceRecord["status"]): Promise<void> {
        const ref = this.col(participantId).doc(id);
        await ref.update({
            status,
            attended: status === "present" || status === "late"
        });
    }
}
