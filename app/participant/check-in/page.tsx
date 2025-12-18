"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Camera, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function CheckInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const className = searchParams.get("class") || "Prime Solutions"
  const classTime = searchParams.get("time") || "2:00 PM"
  const classDay = searchParams.get("day") || "Monday"

  const [checkInState, setCheckInState] = useState<"ready" | "verifying" | "scanning" | "success" | "error">("ready")
  const [locationVerified, setLocationVerified] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleCheckIn = async () => {
    setCheckInState("verifying")

    // Simulate GPS verification
    setTimeout(() => {
      setLocationVerified(true)
      setCheckInState("scanning")
    }, 1500)
  }

  const handleScanSuccess = () => {
    setCheckInState("success")
    setTimeout(() => {
      router.push("/participant")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Location verified</span>
              </div>
              <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500 animate-pulse"></div>
                <Camera className="h-12 w-12 text-white/50" />
              </div>
              <p className="text-center text-sm text-gray-500">Scan the QR code displayed by your facilitator</p>
              <Button onClick={handleScanSuccess} variant="outline" className="w-full bg-transparent">
                Simulate QR Scan (Testing)
              </Button>
            </div>
          )}

          {checkInState === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-600">Check-in successful!</p>
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
              <Button onClick={() => setCheckInState("ready")} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          )}

          <Button variant="ghost" onClick={() => router.push("/participant")} className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>

      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-sm text-gray-500">
        © 2025 DMS Clinical Services. All rights reserved.
      </footer>
    </div>
  )
}
