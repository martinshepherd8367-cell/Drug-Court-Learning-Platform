import { getDb } from "@/lib/firebase-admin";

export type HomeworkSubmission = {
    id: string;
    participantId: string;
    programId: string;
    sessionId: string;
    sessionNumber: number;
    content: string;
    status: "pending" | "approved" | "revision_requested";
    submittedAt: string;
    reviewedAt?: string | null;
    feedback?: string | null;
};

type NewHomeworkSubmission = Omit<HomeworkSubmission, "id">;

export class HomeworkRepo {
    static col(participantId: string) {
        return getDb().collection("users").doc(participantId).collection("homeworkSubmissions");
    }

    static async listForParticipant(participantId: string, limit = 50): Promise<HomeworkSubmission[]> {
        const snap = await this.col(participantId)
            .orderBy("submittedAt", "desc")
            .limit(limit)
            .get();

        return snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as NewHomeworkSubmission) }));
    }

    static async createSubmission(data: NewHomeworkSubmission): Promise<string> {
        const ref = await this.col(data.participantId).add(data);
        return ref.id;
    }

    static async updateStatus(id: string, participantId: string, status: HomeworkSubmission["status"], feedback?: string): Promise<void> {
        const ref = this.col(participantId).doc(id);
        await ref.update({
            status,
            feedback: feedback || null,
            reviewedAt: new Date().toISOString()
        });
    }
}
