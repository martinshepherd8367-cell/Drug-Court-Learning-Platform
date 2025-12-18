"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookOpen, FileText, CheckCircle, QrCode, Camera, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"

export default function ParticipantMakeupPage() {
  const router = useRouter()
  const { currentUser, makeupAssignments, checkInToMakeup, completeMakeupAssignment } = useStore()

  const [showScanner, setShowScanner] = useState(false)
  const [showWorksheet, setShowWorksheet] = useState(false)
  const [showReading, setShowReading] = useState(false)
  const [selectedWorksheet, setSelectedWorksheet] = useState<string | null>(null)
  const [selectedReading, setSelectedReading] = useState<string | null>(null)
  const [worksheetResponses, setWorksheetResponses] = useState<Record<string, string>>({})
  const [completedWorksheets, setCompletedWorksheets] = useState<string[]>([])
  const [completedReadings, setCompletedReadings] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Give time for store to initialize
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Get makeup assignment for current user - handle null currentUser for dev mode
  const myMakeupAssignment = currentUser
    ? makeupAssignments.find((a) => a.participantId === currentUser.id && a.status !== "completed")
    : makeupAssignments.find((a) => a.status !== "completed") // For dev mode, just get first pending assignment

  const handleCheckIn = () => {
    if (myMakeupAssignment) {
      checkInToMakeup(myMakeupAssignment.id)
      setShowScanner(false)
    }
  }

  const handleCompleteWorksheet = () => {
    if (selectedWorksheet) {
      setCompletedWorksheets([...completedWorksheets, selectedWorksheet])
      setSelectedWorksheet(null)
      setShowWorksheet(false)
      setWorksheetResponses({})
    }
  }

  const handleCompleteReading = () => {
    if (selectedReading) {
      setCompletedReadings([...completedReadings, selectedReading])
      setSelectedReading(null)
      setShowReading(false)
    }
  }

  const allWorkCompleted =
    myMakeupAssignment &&
    completedWorksheets.length >= myMakeupAssignment.assignedWorksheets.length &&
    completedReadings.length >= myMakeupAssignment.assignedReadings.length

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="card-transparent max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!myMakeupAssignment) {
    return (
      <div className="min-h-screen p-4">
        <Card className="card-transparent max-w-md mx-auto mt-8">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Makeup Work Assigned</h2>
            <p className="text-gray-600 mb-4">You don't have any pending makeup sessions.</p>
            <Button onClick={() => router.push("/participant")} className="bg-green-600 hover:bg-green-700">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200/50 header-transparent sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/participant")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Makeup Group Session</h1>
              <p className="text-sm text-gray-600">Complete your assigned work</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4">
        {/* Check-In Card */}
        {!myMakeupAssignment.checkedIn ? (
          <Card className="card-transparent border-amber-300 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <QrCode className="h-5 w-5" />
                Check In Required
              </CardTitle>
              <CardDescription className="text-amber-700">
                Scan the QR code at the front of the room to check in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => setShowScanner(true)}>
                <Camera className="h-4 w-4 mr-2" />
                Scan QR Code to Check In
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-transparent border-green-300 bg-green-50/50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="font-medium text-green-800">Checked In Successfully</span>
            </CardContent>
          </Card>
        )}

        {/* Assignment Info */}
        <Card className="card-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Assignment</CardTitle>
            <CardDescription>
              Missed: {myMakeupAssignment.missedProgramName} - Session {myMakeupAssignment.missedSessionNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <h4 className="font-medium text-sm text-gray-700 mb-1">Instructions from Facilitator:</h4>
              <p className="text-sm">
                {myMakeupAssignment.assignedInstructions || "Complete all assigned work below."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Readings Section */}
        {myMakeupAssignment.assignedReadings.length > 0 && (
          <Card className="card-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
                Readings
              </CardTitle>
              <CardDescription>
                {completedReadings.length} of {myMakeupAssignment.assignedReadings.length} completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {myMakeupAssignment.assignedReadings.map((reading) => {
                const isCompleted = completedReadings.includes(reading)
                return (
                  <button
                    key={reading}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      isCompleted ? "bg-green-50 border-green-300" : "bg-white border-gray-200 hover:border-green-500"
                    }`}
                    onClick={() => {
                      if (!isCompleted) {
                        setSelectedReading(reading)
                        setShowReading(true)
                      }
                    }}
                    disabled={isCompleted || !myMakeupAssignment.checkedIn}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reading}</span>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Badge variant="outline">Read</Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Worksheets Section */}
        {myMakeupAssignment.assignedWorksheets.length > 0 && (
          <Card className="card-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-green-600" />
                Worksheets
              </CardTitle>
              <CardDescription>
                {completedWorksheets.length} of {myMakeupAssignment.assignedWorksheets.length} completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {myMakeupAssignment.assignedWorksheets.map((worksheet) => {
                const isCompleted = completedWorksheets.includes(worksheet)
                return (
                  <button
                    key={worksheet}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      isCompleted ? "bg-green-50 border-green-300" : "bg-white border-gray-200 hover:border-green-500"
                    }`}
                    onClick={() => {
                      if (!isCompleted) {
                        setSelectedWorksheet(worksheet)
                        setShowWorksheet(true)
                      }
                    }}
                    disabled={isCompleted || !myMakeupAssignment.checkedIn}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{worksheet}</span>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Badge variant="outline">Complete</Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Complete Session Button */}
        {allWorkCompleted && myMakeupAssignment.checkedIn && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
            onClick={() => {
              completeMakeupAssignment(myMakeupAssignment.id)
              router.push("/participant")
            }}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Complete Makeup Session
          </Button>
        )}

        {!myMakeupAssignment.checkedIn && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-sm text-amber-800">Please check in to unlock your assignments</p>
          </div>
        )}
      </main>

      {/* QR Scanner Modal */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-sm card-transparent">
          <DialogHeader>
            <DialogTitle>Scan Check-In QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Camera would open here</p>
              </div>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleCheckIn}>
              Simulate Successful Scan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reading Modal */}
      <Dialog open={showReading} onOpenChange={setShowReading}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>{selectedReading}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="prose prose-sm max-h-[400px] overflow-y-auto bg-white p-4 rounded border">
              <p>
                This section covers important concepts related to recovery and personal growth. Take your time to read
                through the material and reflect on how it applies to your journey.
              </p>
              <p>Key points to consider:</p>
              <ul>
                <li>Understanding triggers and how to manage them</li>
                <li>Building healthy coping mechanisms</li>
                <li>The importance of support systems</li>
                <li>Setting realistic goals for recovery</li>
              </ul>
              <p>
                Remember that recovery is a process, not a destination. Each step forward, no matter how small, is
                progress worth celebrating.
              </p>
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleCompleteReading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Read
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Worksheet Modal */}
      <Dialog open={showWorksheet} onOpenChange={setShowWorksheet}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto card-transparent">
          <DialogHeader>
            <DialogTitle>{selectedWorksheet}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  1. Describe a recent situation where you noticed a thinking error:
                </label>
                <Textarea
                  placeholder="Write your response here..."
                  value={worksheetResponses["q1"] || ""}
                  onChange={(e) => setWorksheetResponses({ ...worksheetResponses, q1: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">2. What thinking error did you identify?</label>
                <Textarea
                  placeholder="Write your response here..."
                  value={worksheetResponses["q2"] || ""}
                  onChange={(e) => setWorksheetResponses({ ...worksheetResponses, q2: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">3. How could you think about this situation differently?</label>
                <Textarea
                  placeholder="Write your response here..."
                  value={worksheetResponses["q3"] || ""}
                  onChange={(e) => setWorksheetResponses({ ...worksheetResponses, q3: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleCompleteWorksheet}
              disabled={!worksheetResponses["q1"] || !worksheetResponses["q2"] || !worksheetResponses["q3"]}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Worksheet
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
