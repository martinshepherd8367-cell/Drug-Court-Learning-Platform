"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, Clock, Calendar, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"

export default function ParticipantMakeupPage() {
  const router = useRouter()
  const { currentUser, getMakeupAssignmentsForParticipant } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Give time for store to initialize
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const myAssignments = currentUser
    ? getMakeupAssignmentsForParticipant(currentUser.id)
    : []

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="card-transparent max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/participant")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Makeup Assignments</h1>
              <p className="text-sm text-gray-600">Pending and completed makeup work</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-4">
        {myAssignments.length === 0 ? (
          <Card className="card-transparent">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Up to Date</h2>
              <p className="text-gray-600">You don't have any pending makeup assignments.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myAssignments.map((assignment) => (
              <Card key={assignment.id} className="card-transparent hover:border-green-300 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant={assignment.status === 'completed' ? 'default' : 'destructive'} className="mb-2">
                        {assignment.status === 'completed' ? 'Completed' : 'Makeup Assigned'}
                      </Badge>
                      <CardTitle className="text-lg">
                        {assignment.missedProgramName}
                      </CardTitle>
                      <CardDescription>
                        Missed Session #{assignment.missedSessionNumber}
                      </CardDescription>
                    </div>
                    {assignment.status === 'completed' ? (
                       <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                       <AlertTriangle className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Due: {assignment.makeupDate || "TBD"}</span>
                    </div>
                  </div>
                  
                  {assignment.status !== 'completed' && (
                    <Button className="w-full" disabled variant="secondary">
                       Start Assignment (V2)
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
