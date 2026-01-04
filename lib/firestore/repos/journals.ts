import { getDb } from "@/lib/firebase-admin";

export type JournalEntry = {
  id: string;
  participantId: string;
  programId: string;
  sessionNumber: number;
  content: string;
  mood?: string | null;
  tags?: string[];
  submittedAt: string;
};

type NewJournalEntry = Omit<JournalEntry, "id">;

export class JournalsRepo {
  static col(participantId: string) {
    return getDb().collection("users").doc(participantId).collection("journals");
  }

  static async listJournalsForParticipant(participantId: string, limit = 50): Promise<JournalEntry[]> {
    const snap = await this.col(participantId)
      .orderBy("submittedAt", "desc")
      .limit(limit)
      .get();

    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as NewJournalEntry) }));
  }

  static async createEntry(data: NewJournalEntry): Promise<string> {
    const ref = await this.col(data.participantId).add(data);
    return ref.id;
  }

  static async update(id: string, participantId: string, patch: Partial<NewJournalEntry>): Promise<void> {
    const ref = this.col(participantId).doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("NOT_FOUND");
    await ref.update(patch);
  }

  static async remove(id: string, participantId: string): Promise<void> {
    const ref = this.col(participantId).doc(id);
    await ref.delete();
  }
}
