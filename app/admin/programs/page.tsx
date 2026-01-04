"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { RoleNav } from "@/components/role-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Lock,
  Unlock,
  Settings,
  ChevronRight,
  Code,
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react"
import type { Program } from "@/lib/types"

export default function ProgramManagement() {
  const router = useRouter()
  const { programs, addProgram } = useStore()

  const [showCreateProgram, setShowCreateProgram] = useState(false)
  const [createMode, setCreateMode] = useState<"manual" | "code">("manual")
  const [newProgram, setNewProgram] = useState({
    name: "",
    slug: "",
    description: "",
    totalSessions: 12,
    isLocked: false,
  })

  const [codeInput, setCodeInput] = useState("")
  const [parseError, setParseError] = useState<string | null>(null)
  const [parsedProgram, setParsedProgram] = useState<Program | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

  const handleCreateProgram = () => {
    if (createMode === "manual") {
      addProgram({
        slug: newProgram.slug || newProgram.name.toLowerCase().replace(/\s+/g, "-"),
        name: newProgram.name,
        description: newProgram.description,
        totalSessions: newProgram.totalSessions,
        isLocked: newProgram.isLocked,
        sessions: [],
      })
    } else if (parsedProgram) {
      addProgram(parsedProgram)
    }

    setShowCreateProgram(false)
    resetForm()
  }

  const resetForm = () => {
    setNewProgram({ name: "", slug: "", description: "", totalSessions: 12, isLocked: false })
    setCodeInput("")
    setParseError(null)
    setParsedProgram(null)
    setImportSuccess(false)
    setCreateMode("manual")
  }

  const handleParseCode = () => {
    setParseError(null)
    setParsedProgram(null)
    setImportSuccess(false)

    try {
      // Try to parse as JSON first
      let programData: Program

      // Check if it looks like a TypeScript/JavaScript export
      const cleanedCode = codeInput
        .replace(/export\s+(const|let|var)\s+\w+\s*[:=]\s*/g, "")
        .replace(/as\s+Program\s*;?\s*$/g, "")
        .replace(/;\s*$/, "")
        .trim()

      try {
        programData = JSON.parse(cleanedCode)
      } catch {
        // If JSON parse fails, try to evaluate as JS object literal
        // This handles TypeScript exports like: export const myProgram: Program = { ... }
        const evalCode = cleanedCode
          .replace(/(\w+):/g, '"$1":') // Convert keys to quoted strings
          .replace(/'/g, '"') // Convert single quotes to double
          .replace(/,\s*}/g, "}") // Remove trailing commas
          .replace(/,\s*]/g, "]")

        try {
          programData = JSON.parse(evalCode)
        } catch {
          throw new Error("Could not parse the code. Please ensure it's valid JSON or a JavaScript object.")
        }
      }

      // Validate required fields
      if (!programData.name) {
        throw new Error("Program must have a 'name' field")
      }
      if (!programData.slug) {
        programData.slug = programData.name.toLowerCase().replace(/\s+/g, "-")
      }
      if (!programData.sessions) {
        programData.sessions = []
      }
      if (!programData.totalSessions) {
        programData.totalSessions = programData.sessions.length || 12
      }
      if (programData.isLocked === undefined) {
        programData.isLocked = false
      }

      // Validate sessions structure
      if (programData.sessions.length > 0) {
        const firstSession = programData.sessions[0]
        if (!firstSession.sessionNumber || !firstSession.title) {
          throw new Error("Each session must have 'sessionNumber' and 'title' fields")
        }
      }

      setParsedProgram(programData as Program)
      setImportSuccess(true)
    } catch (error) {
      setParseError(error instanceof Error ? error.message : "Failed to parse curriculum code")
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCodeInput(content)
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen">
      <RoleNav />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/admin")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
              <p className="text-gray-600 mt-1">Create and manage curriculum programs</p>
            </div>
            <Button onClick={() => setShowCreateProgram(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Program
            </Button>
          </div>
        </div>

        {/* Programs List */}
        <Card className="card-transparent">
          <CardHeader>
            <CardTitle>All Programs</CardTitle>
            <CardDescription>Click on a program to manage its sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {programs.map((program) => (
                <Card
                  key={program.id}
                  className="cursor-pointer hover:border-green-500 hover:shadow-md transition-all bg-white/80"
                  onClick={() => router.push(`/admin/programs/${program.id}/sessions`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <BookOpen className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{program.name}</h3>
                            {program.isLocked ? (
                              <Badge variant="secondary" className="gap-1">
                                <Lock className="h-3 w-3" />
                                Locked
                              </Badge>
                            ) : (
                              <Badge className="bg-green-600 gap-1">
                                <Unlock className="h-3 w-3" />
                                Open
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{program.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {program.totalSessions} sessions • {program.sessions.length} configured
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {programs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No programs yet.</p>
                  <p className="text-sm">Create your first program to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Create Program Dialog */}
      <Dialog
        open={showCreateProgram}
        onOpenChange={(open) => {
          setShowCreateProgram(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
            <DialogDescription>Add a new curriculum program manually or import from code</DialogDescription>
          </DialogHeader>

          <Tabs value={createMode} onValueChange={(v) => setCreateMode(v as "manual" | "code")} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="gap-2">
                <FileText className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code className="h-4 w-4" />
                Import from Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Program Name</Label>
                <Input
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  placeholder="e.g., Prime Solutions"
                />
              </div>

              <div className="space-y-2">
                <Label>Slug (URL identifier)</Label>
                <Input
                  value={newProgram.slug}
                  onChange={(e) => setNewProgram({ ...newProgram, slug: e.target.value })}
                  placeholder="e.g., prime-solutions"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  placeholder="Brief description of the program..."
                />
              </div>

              <div className="space-y-2">
                <Label>Total Sessions</Label>
                <Input
                  type="number"
                  value={newProgram.totalSessions}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, totalSessions: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Lock Program</Label>
                  <p className="text-sm text-gray-500">Prevent facilitators from opening future sessions</p>
                </div>
                <Switch
                  checked={newProgram.isLocked}
                  onCheckedChange={(checked) => setNewProgram({ ...newProgram, isLocked: checked })}
                />
              </div>
            </TabsContent>

            <TabsContent value="code" className="space-y-4 py-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Import Curriculum from Code</h4>
                <p className="text-sm text-blue-700">
                  Paste your curriculum code (JSON or TypeScript export) below, or upload a .json or .ts file. The
                  system will parse and validate the structure automatically.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Curriculum Code</Label>
                  <label className="cursor-pointer">
                    <input type="file" accept=".json,.ts,.js" className="hidden" onChange={handleFileUpload} />
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </span>
                    </Button>
                  </label>
                </div>
                <Textarea
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value)
                    setParseError(null)
                    setImportSuccess(false)
                  }}
                  placeholder={`Paste your curriculum code here...

Example JSON format:
{
  "name": "My Program",
  "slug": "my-program",
  "description": "Program description...",
  "totalSessions": 12,
  "isLocked": false,
  "sessions": [
    {
      "id": "session-1",
      "programId": "my-program",
      "sessionNumber": 1,
      "title": "Session Title",
      "purpose": "Session purpose...",
      "objectives": ["Objective 1", "Objective 2"],
      "facilitatorPrompts": [...],
      "activityTemplates": [...],
      "homeworkTemplate": {...}
    }
  ]
}`}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button onClick={handleParseCode} variant="outline" disabled={!codeInput.trim()}>
                  <Code className="h-4 w-4 mr-2" />
                  Parse & Validate
                </Button>

                {parseError && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{parseError}</span>
                  </div>
                )}

                {importSuccess && parsedProgram && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Successfully parsed!</span>
                  </div>
                )}
              </div>

              {parsedProgram && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Parsed Program Preview</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{parsedProgram.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Slug:</span>
                        <span className="ml-2 font-medium">{parsedProgram.slug}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Sessions:</span>
                        <span className="ml-2 font-medium">{parsedProgram.totalSessions}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Configured:</span>
                        <span className="ml-2 font-medium">{parsedProgram.sessions.length} sessions</span>
                      </div>
                    </div>
                    {parsedProgram.sessions.length > 0 && (
                      <div className="mt-4">
                        <span className="text-gray-600 text-sm">Sessions:</span>
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                          {parsedProgram.sessions.map((session, idx) => (
                            <div key={idx} className="text-sm bg-white/50 px-2 py-1 rounded">
                              <span className="font-medium">Session {session.sessionNumber}:</span> {session.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* TODO: Wire AI curriculum parser here when backend is ready */}
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Coming Soon:</strong> AI-powered curriculum parsing will automatically structure your raw
                  curriculum documents into the correct format.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateProgram(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProgram}
              className="bg-green-600 hover:bg-green-700"
              disabled={createMode === "code" && !parsedProgram}
            >
              {createMode === "code" ? "Import Program" : "Create Program"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="footer-transparent border-t border-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-700">
          © 2025 DMS Clinical Services. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
