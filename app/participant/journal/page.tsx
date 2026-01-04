"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookMarked, Plus } from "lucide-react"

export default function JournalArchivePage() {
  const router = useRouter()
  const { programs, currentUser, getJournalEntriesForParticipant, getEnrollmentsByParticipant, addJournalEntry } =
    useStore()

  const [journalText, setJournalText] = useState("")
  const [showNewEntryModal, setShowNewEntryModal] = useState(false)

  const journalEntries = currentUser ? getJournalEntriesForParticipant(currentUser.id) : []
  const enrollments = currentUser ? getEnrollmentsByParticipant(currentUser.id) : []
  const activeEnrollments = enrollments.filter((e) => e.status === "active")

  // Handle journal submission
  const handleJournalSubmit = () => {
    if (!currentUser || !journalText.trim()) return

    const firstEnrollment = activeEnrollments[0]
    if (firstEnrollment) {
      const program = programs.find((p) => p.id === firstEnrollment.programId)
      if (program) {
        addJournalEntry({
          participantId: currentUser.id,
          programId: program.id,
          sessionNumber: firstEnrollment.currentSessionNumber,
          content: journalText,
          submittedAt: new Date().toISOString(),
        })
        setJournalText("")
        setShowNewEntryModal(false)
      }
    }
  }

  // Group entries by date
  const groupedEntries = journalEntries.reduce(
    (acc, entry) => {
      const date = new Date(entry.submittedAt).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      if (!acc[date]) acc[date] = []
      acc[date].push(entry)
      return acc
    },
    {} as Record<string, typeof journalEntries>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleNav />

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/participant")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookMarked className="h-6 w-6 text-green-600" />
              My Journal
            </h1>
            <p className="text-gray-600 mt-1">Your personal reflections and progress</p>
          </div>
          <Button onClick={() => setShowNewEntryModal(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Journal Entries */}
        {Object.keys(groupedEntries).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedEntries).map(([date, entries]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-gray-500 mb-3">{date}</h2>
                <div className="space-y-3">
                  {entries.map((entry) => {
                    const program = programs.find((p) => p.id === entry.programId)
                    return (
                      <Card key={entry.id}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">
                            {program?.name} - Session {entry.sessionNumber}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                          <p className="text-xs text-gray-400 mt-3">
                            {new Date(entry.submittedAt).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookMarked className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No journal entries yet</h3>
              <p className="text-gray-500 mb-4">
                Start journaling to track your thoughts and progress throughout your recovery journey.
              </p>
              <Button onClick={() => setShowNewEntryModal(true)} className="bg-green-600 hover:bg-green-700">
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* New Entry Modal */}
      <Dialog open={showNewEntryModal} onOpenChange={setShowNewEntryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Take a moment to reflect on your day. What are you feeling? What progress have you made?
            </p>
            <Textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write your thoughts here..."
              className="min-h-[150px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewEntryModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleJournalSubmit}
                className="bg-green-600 hover:bg-green-700"
                disabled={!journalText.trim()}
              >
                Save Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
