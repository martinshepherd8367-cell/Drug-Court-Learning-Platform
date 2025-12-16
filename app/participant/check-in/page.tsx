"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, MapPin, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

function CheckInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const className = searchParams.get("class") || ""
  const classTime = searchParams.get("time") || ""
  const classDay = searchParams.get("day") || ""

  const [checkInStatus, setCheckInStatus] = useState<
    "waiting" | "early" | "scanning" | "verifying" | "success" | "error"
  >("waiting")
  const [errorMessage, setErrorMessage] = useState("")
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [canCheckIn, setCanCheckIn] = useState(false)

  // Treatment Building GPS coordinates (placeholder - replace with actual coordinates)
  const classroomLocation = { lat: 40.7128, lng: -74.006 }

  useEffect(() => {
    checkTimeWindow()
    const interval = setInterval(checkTimeWindow, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const checkTimeWindow = () => {
    const now = new Date()
    const currentDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()]

    if (currentDay !== classDay) {
      setCheckInStatus("early")
      setErrorMessage(`This class is scheduled for ${classDay}.`)
      return
    }

    // Parse class time
    const [time, period] = classTime.split(" ")
    let [hours, minutes] = time.split(":").map(Number)
    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0

    const classStartTime = new Date(now)
    classStartTime.setHours(hours, minutes || 0, 0, 0)

    // Allow check-in 10 minutes before class
    const checkInWindow = new Date(classStartTime.getTime() - 10 * 60000)

    if (now < checkInWindow) {
      setCheckInStatus("early")
      const minutesUntil = Math.ceil((checkInWindow.getTime() - now.getTime()) / 60000)
      setErrorMessage(
        `You can check in 10 minutes before class starts. Check-in opens in ${minutesUntil} minute${minutesUntil !== 1 ? "s" : ""}.`,
      )
      setCanCheckIn(false)
    } else if (now > classStartTime) {
      setCheckInStatus("error")
      setErrorMessage("Check-in window has closed. Class has already started.")
      setCanCheckIn(false)
    } else {
      setCanCheckIn(true)
      if (checkInStatus === "waiting" || checkInStatus === "early") {
        setCheckInStatus("waiting")
      }
    }
  }

  const getLocation = () => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your device."))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          reject(new Error("Unable to get your location. Please enable location services."))
        },
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  const handleStartCheckIn = async () => {
    if (!canCheckIn) return

    setCheckInStatus("verifying")

    try {
      // Get user's GPS location
      const userLocation = await getLocation()
      setLocation(userLocation)

      // Calculate distance from classroom
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        classroomLocation.lat,
        classroomLocation.lng,
      )

      console.log("[v0] Distance from classroom:", distance, "meters")

      // Allow check-in if within 50 meters of classroom
      if (distance > 50) {
        setCheckInStatus("error")
        setErrorMessage("You must be in the classroom to check in. Please move closer to the treatment building.")
        return
      }

      // Location verified, now show QR scanner
      setCheckInStatus("scanning")
    } catch (error) {
      setCheckInStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to verify location.")
    }
  }

  const handleQRScan = () => {
    // Simulate QR code scan
    setCheckInStatus("verifying")

    setTimeout(() => {
      // Simulate successful check-in
      setCheckInStatus("success")

      // Redirect back to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/participant")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Check In to Class</CardTitle>
            <CardDescription>
              <div className="space-y-1 mt-2">
                <p className="text-base font-semibold text-foreground">{className}</p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {classDay} at {classTime}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Treatment Building
                </p>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {checkInStatus === "early" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {checkInStatus === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {checkInStatus === "waiting" && canCheckIn && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    To check in, you must be physically present in the classroom. We will verify your location and
                    you'll need to scan the QR code displayed by your facilitator.
                  </p>
                </div>
                <Button onClick={handleStartCheckIn} className="w-full bg-primary hover:bg-primary/90" size="lg">
                  Check In Now
                </Button>
              </div>
            )}

            {checkInStatus === "verifying" && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Verifying your location...</p>
                <p className="text-sm text-muted-foreground">Please wait while we confirm you're in the classroom.</p>
              </div>
            )}

            {checkInStatus === "scanning" && (
              <div className="space-y-6">
                <Alert className="bg-primary/10 border-primary/20">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    Location verified! You are in the correct classroom.
                  </AlertDescription>
                </Alert>
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="p-6 bg-muted rounded-lg border-2 border-dashed border-border">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium">Scan QR Code</p>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Point your camera at the QR code displayed by your facilitator to complete check-in.
                  </p>
                  <Button onClick={handleQRScan} className="w-full max-w-xs" size="lg">
                    Open Camera to Scan
                  </Button>
                </div>
              </div>
            )}

            {checkInStatus === "success" && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">Check-In Successful!</p>
                <p className="text-muted-foreground">Redirecting you back to your dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border py-6 px-6 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DMS Clinical Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default function CheckInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckInContent />
    </Suspense>
  )
}
