"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Camera, CheckCircle, XCircle, Loader2, Wifi, AlertTriangle } from "lucide-react"
import { useStore } from "@/lib/store"

export default function CheckInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const className = searchParams.get("class") || "Prime Solutions"
  const classTime = searchParams.get("time") || "2:00 PM"
  const classDay = searchParams.get("day") || "Monday"
  const sessionId = searchParams.get("sessionId") || ""

  const { validateCheckIn, recordAttendanceCheckIn, currentUser, getEnrollmentsByParticipant } = useStore()

  const [checkInState, setCheckInState] = useState<"ready" | "verifying" | "scanning" | "success" | "error">("ready")
  const [locationVerified, setLocationVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)
  const [scannedCode, setScannedCode] = useState("")
  const [isVirtualClass, setIsVirtualClass] = useState(false)
  const [manualCodeEntry, setManualCodeEntry] = useState("")

  // Participant ID fallback for dev mode
  const participantId = currentUser?.id || "participant-4"

  const handleCheckIn = async () => {
    setCheckInState("verifying")
    setErrorMessage("")

    // Get GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsLat(position.coords.latitude)
          setGpsLng(position.coords.longitude)
          setLocationVerified(true)
          setCheckInState("scanning")
        },
        (error) => {
          // Allow proceeding without GPS for virtual classes
          setLocationVerified(false)
          setCheckInState("scanning")
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    } else {
      setCheckInState("scanning")
    }
  }

  const handleScanComplete = (code: string) => {
    const result = validateCheckIn(participantId, code, gpsLat, gpsLng)

    if (result.success) {
      setIsVirtualClass(result.isVirtual || false)

      // Find active enrollment to get program/session context
      const enrollment = currentUser 
        ? getEnrollmentsByParticipant(currentUser.id).find(e => e.status === "active")
        : undefined
      
      const programId = enrollment?.programId || "prime-solutions" 
      const sessionNumber = enrollment?.currentSessionNumber || 1

      // Record the check-in
      recordAttendanceCheckIn({
        participantId,
        programId,
        sessionNumber,
        checkInAt: new Date().toISOString(),
        isVirtual: result.isVirtual || false,
        gpsLat: gpsLat || undefined,
        gpsLng: gpsLng || undefined,
        verified: true,
        qrCodeId: code,
      })

      setCheckInState("success")
      setTimeout(() => {
        router.push("/participant")
      }, 2000)
    } else {
      setErrorMessage(result.error || "Check-in failed")
      setCheckInState("error")
    }
  }

  // Simulate QR scan for testing
  const handleSimulateScan = () => {
    // For testing, accept any code starting with "CLASS-"
    const testCode = manualCodeEntry || `CLASS-test-${Date.now()}`
    handleScanComplete(testCode)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-transparent">
        <CardHeader className="text-center">
          <CardTitle>{className}</CardTitle>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {classDay} {classTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Treatment Building
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {checkInState === "ready" && (
            <>
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium text-green-600">Class is ready for check-in</p>
                <p className="text-sm text-gray-500 mt-1">Tap below to verify your location and scan the QR code</p>
              </div>

              {/* Info about check-in process */}
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <p className="font-medium text-blue-800 mb-1">Check-in Process:</p>
                <ol className="text-blue-600 text-xs space-y-1 list-decimal list-inside">
                  <li>Enable location services on your phone</li>
                  <li>Scan the QR code displayed by your facilitator</li>
                  <li>Your attendance will be recorded automatically</li>
                </ol>
              </div>

              <Button onClick={handleCheckIn} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Check In Now
              </Button>
            </>
          )}

          {checkInState === "verifying" && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Verifying your location...</p>
              <p className="text-sm text-gray-500 mt-1">Please ensure location services are enabled</p>
            </div>
          )}

          {checkInState === "scanning" && (
            <div className="space-y-4">
              {locationVerified ? (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Location verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 mb-4">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm font-medium">Location not available - virtual mode</span>
                </div>
              )}

              {/* Camera Scanner View */}
              <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500 animate-pulse"></div>
                <Camera className="h-12 w-12 text-white/50" />
              </div>
              <p className="text-center text-sm text-gray-500">Scan the QR code displayed by your facilitator</p>

              {/* Manual Code Entry for Testing */}
              <div className="border-t pt-4 mt-4">
                <p className="text-xs text-gray-400 mb-2 text-center">Testing: Enter code manually</p>
                <div className="flex gap-2">
                  <Input
                    value={manualCodeEntry}
                    onChange={(e) => setManualCodeEntry(e.target.value)}
                    placeholder="Enter QR code..."
                    className="flex-1 bg-white/50 text-sm"
                  />
                  <Button onClick={handleSimulateScan} variant="outline" size="sm" className="bg-transparent">
                    Submit
                  </Button>
                </div>
              </div>

              {/* DEV: Simulate scan button */}
              <Button
                onClick={handleSimulateScan}
                variant="outline"
                className="w-full bg-orange-100 text-orange-700 border-orange-300"
              >
                [DEV] Simulate QR Scan
              </Button>
            </div>
          )}

          {checkInState === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-600">Check-in successful!</p>
              {isVirtualClass && (
                <div className="flex items-center justify-center gap-1 text-blue-600 mt-2">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">Virtual class attendance recorded</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">Redirecting to your dashboard...</p>
            </div>
          )}

          {checkInState === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-lg font-medium text-red-600">Check-in failed</p>
              <p className="text-sm text-gray-500 mt-1">{errorMessage}</p>
              <Button onClick={() => setCheckInState("scanning")} variant="outline" className="mt-4 bg-transparent">
                Try Again
              </Button>
            </div>
          )}

          <Button variant="ghost" onClick={() => router.push("/participant")} className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-500 footer-transparent">
        © 2025 DMS Clinical Services. All rights reserved.
      </footer>
    </div>
  )
}
