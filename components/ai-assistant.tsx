"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, X, Sparkles, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

interface AIAssistantProps {
  role: "admin" | "facilitator" | "participant"
}

const roleDescriptions = {
  admin: {
    title: "Admin AI Assistant",
    description: "Read-only access to system-wide enrollment, attendance, and program data.",
    placeholder: "Ask about enrollment counts, attendance summary, or programs...",
    systemPrompt: `You are an administrative AI assistant. You have read-only access to the entire platform's state. You can help with:
- Global enrollment counts
- Program summaries
- System-wide attendance reporting
You cannot modify any data or perform actions.`,
    restricted: false,
  },
  facilitator: {
    title: "Facilitator AI Assistant",
    description: "Access to your assigned classes, rosters, and session history.",
    placeholder: "Ask about your class rosters, session attendance, or progress...",
    systemPrompt: `You are an AI assistant for facilitators. You have read-only access to:
- Your classes and rosters
- Participant attendance for your sessions
- Key takeaways from your participants
You cannot see data for classes assigned to other facilitators.`,
    restricted: false,
  },
  participant: {
    title: "Learning Assistant",
    description: "Access to your own enrollment status, session history, and learning concepts.",
    placeholder: "Ask about your progress, completed sessions, or recovery concepts...",
    systemPrompt: `You are a helpful learning assistant for participants. You have read-only access to YOUR data:
- Your enrollment status
- Your completed sessions
- Your own attendance record
IMPORTANT: You cannot help with homework answers or write assignments.`,
    restricted: true,
  },
}

const sampleTerms = [
  "What does 'co-occurring' mean?",
  "What is a trigger?",
  "What does CBT stand for?",
  "What is relapse prevention?",
]

export function AIAssistantButton({ role }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { enrollments, attendance, completedSessions, currentUser, users, programs } = useStore()

  const config = roleDescriptions[role]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate grounded response (F2)
    setTimeout(() => {
      let response = ""
      const lowerInput = input.toLowerCase()

      // Mandatory Validation Logic: Admin Count
      if (role === "admin" && (lowerInput.includes("how many participants") || lowerInput.includes("enrolled today"))) {
        const count = enrollments.filter(e => e.status === 'active').length
        response = `There are currently ${count} participants actively enrolled in programs across the system.`
      }

      // Mandatory Validation Logic: Facilitator Attendance
      if (role === "facilitator" && (lowerInput.includes("who attended") || lowerInput.includes("last session"))) {
        const myFacilitatorEnrollments = enrollments.filter(e => e.schedule?.facilitatorId === currentUser?.id);
        const myFacParticipantIds = myFacilitatorEnrollments.map(e => e.participantId);

        // Find most recent completed session for this facilitator's classes
        const myManagedClasses = Array.from(new Set(myFacilitatorEnrollments.map(e => `${e.programId}-${e.schedule?.day}-${e.schedule?.time}-${e.schedule?.room}`)));
        const myLastCompleted = completedSessions
          .filter(cs => myManagedClasses.includes(cs.classId || ""))
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())[0];

        if (myLastCompleted) {
          const sessionAttendance = attendance.filter(a =>
            a.classId === myLastCompleted.classId &&
            a.completedAt?.split('T')[0] === myLastCompleted.completedAt.split('T')[0] &&
            myFacParticipantIds.includes(a.participantId)
          );
          const present = sessionAttendance.filter(a => a.attended || a.status === 'present');
          const names = present.map(a => users.find(u => u.id === a.participantId)?.name || "Unknown").filter(Boolean);

          response = names.length > 0
            ? `For your last completed session (${myLastCompleted.programId} Session ${myLastCompleted.sessionNumber}), the following participants were marked present: ${names.join(", ")}.`
            : `For your last completed session (${myLastCompleted.programId} Session ${myLastCompleted.sessionNumber}), no participants were marked present.`;
        } else {
          response = "I couldn't find any recently completed sessions for your classes in the current system state."
        }
      }

      // Mandatory Validation Logic: Participant Completion
      if (role === "participant" && (lowerInput.includes("what sessions") || lowerInput.includes("have i completed"))) {
        const myCompleted = completedSessions.filter(cs =>
          enrollments.some(e => e.participantId === currentUser?.id && e.programId === cs.programId)
        );
        if (myCompleted.length > 0) {
          const sessions = myCompleted.map(s => `${programs.find(p => p.id === s.programId)?.name || s.programId} Session ${s.sessionNumber}`).join(", ");
          response = `You have completed the following sessions: ${sessions}.`
        } else {
          response = "According to my records, you haven't completed any sessions yet."
        }
      }

      // Concept explanations (read-only context)
      if (!response) {
        if (lowerInput.includes("co-occurring")) {
          response = "Co-occurring disorders refers to having both a substance use disorder and a mental health condition simultaneously. It requires integrated treatment for both conditions."
        } else if (lowerInput.includes("trigger")) {
          response = "A trigger is an internal or external stimulus that prompts an urge to use substances. Identifying them is key to relapse prevention."
        } else if (lowerInput.includes("cbt")) {
          response = "CBT stands for Cognitive Behavioral Therapy, a common approach for treating substance use by identifying and changing negative thought patterns."
        } else {
          response = "I can answer specific questions about enrollment counts, session history, and recovery concepts based on the current platform data. What would you like to know?"
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 800)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
        size="sm"
      >
        <Sparkles className="h-4 w-4" />
        AI Assistant
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
          <DialogHeader className="p-4 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                <DialogTitle className="text-white">{config.title}</DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-white/80 mt-1">{config.description}</p>
          </DialogHeader>

          {/* Restriction Warning for Participants */}
          {config.restricted && (
            <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                This assistant helps you understand concepts but cannot provide homework answers.
              </p>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">How can I help you today?</p>
                {role === "participant" && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Try asking:</p>
                    {sampleTerms.map((term) => (
                      <Button
                        key={term}
                        variant="outline"
                        size="sm"
                        className="mx-1 bg-transparent"
                        onClick={() => {
                          setInput(term)
                        }}
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-gray-50">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={config.placeholder}
                className="flex-1 bg-white"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
