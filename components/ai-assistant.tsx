"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, X, Sparkles, AlertTriangle } from "lucide-react"

// TODO: Wire this to actual AI backend when IDE is ready
// This component is prepared for integration with OpenAI or similar

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
    description: "I can help you optimize schedules, manage enrollments, and ensure curriculum adherence.",
    placeholder: "Ask about scheduling, enrollments, or curriculum...",
    systemPrompt: `You are an administrative AI assistant for a drug court learning platform. You help with:
- Optimizing class schedules
- Managing participant enrollments
- Ensuring curriculum is being followed
- Analyzing attendance patterns
- Generating reports
Be professional and thorough in your responses.`,
    restricted: false,
  },
  facilitator: {
    title: "Facilitator AI Assistant",
    description: "I can help you with session planning, participant progress tracking, and content suggestions.",
    placeholder: "Ask about sessions, participants, or content...",
    systemPrompt: `You are an AI assistant for facilitators in a drug court program. You help with:
- Session planning and preparation
- Understanding participant progress
- Suggesting discussion topics
- Reviewing homework submissions
- Creating engaging activities
Be supportive and educational in your responses.`,
    restricted: false,
  },
  participant: {
    title: "Learning Assistant",
    description:
      "I can help you understand terms and concepts from your classes. Note: I cannot help with homework answers.",
    placeholder: "Ask about terms like 'trigger', 'co-occurring', etc...",
    systemPrompt: `You are a helpful learning assistant for participants in a drug court program. You help explain:
- Recovery terminology (triggers, co-occurring disorders, etc.)
- Concepts discussed in class
- Coping strategies and techniques
- Program requirements

IMPORTANT RESTRICTIONS:
- You CANNOT provide answers to homework questions
- You CANNOT write essays or complete assignments for users
- If asked for homework help, politely redirect to explaining the underlying concepts instead
- Focus on education and understanding, not completing work for them

Be warm, supportive, and encouraging in your responses.`,
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

  const config = roleDescriptions[role]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // TODO: Replace with actual AI API call
    // This is a placeholder response system
    setTimeout(() => {
      let response = ""

      // Check for homework-related questions for participants
      if (role === "participant") {
        const homeworkKeywords = ["homework", "assignment", "answer", "write my", "complete my", "do my"]
        const isHomeworkRequest = homeworkKeywords.some((kw) => input.toLowerCase().includes(kw))

        if (isHomeworkRequest) {
          response =
            "I'm here to help you learn, but I can't provide answers to homework questions. Instead, I can help you understand the concepts behind the questions. What specific term or idea would you like me to explain?"
        }
      }

      if (!response) {
        // Placeholder responses based on common terms
        const lowerInput = input.toLowerCase()
        if (lowerInput.includes("co-occurring") || lowerInput.includes("cooccurring")) {
          response =
            "Co-occurring disorders (also called dual diagnosis) means having both a substance use disorder and a mental health condition at the same time. For example, someone might struggle with both alcohol addiction and depression. Treatment works best when both conditions are addressed together."
        } else if (lowerInput.includes("trigger")) {
          response =
            "A trigger is anything that brings up memories or feelings that make you want to use substances. Triggers can be people, places, things, emotions, or situations. Learning to identify and manage your triggers is an important part of recovery."
        } else if (lowerInput.includes("cbt") || lowerInput.includes("cognitive behavioral")) {
          response =
            "CBT stands for Cognitive Behavioral Therapy. It's a type of therapy that helps you identify negative thought patterns and replace them with healthier ways of thinking. The idea is that our thoughts affect our feelings and behaviors, so by changing how we think, we can change how we feel and act."
        } else if (lowerInput.includes("relapse")) {
          response =
            "Relapse prevention involves strategies and skills to help maintain recovery and avoid returning to substance use. It includes identifying warning signs, building coping skills, creating a support network, and having a plan for high-risk situations."
        } else {
          response =
            "That's a great question! [This is a placeholder response - the AI assistant will be fully connected when the system is deployed. For now, try asking about specific terms like 'trigger', 'co-occurring', 'CBT', or 'relapse prevention'.]"
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsLoading(false)
    }, 1000)
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
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
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
