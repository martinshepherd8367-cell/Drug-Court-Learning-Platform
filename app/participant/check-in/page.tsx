"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, Camera, CheckCircle, XCircle, Wifi, QrCode } from "lucide-react"
import { useStore } from "@/lib/store"

export default function CheckInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const className = searchParams.get("class") || "Class Session"
  const classTime = searchParams.get("time") || ""
  const classDay = searchParams.get("day") || ""
  const sessionId = searchParams.get("sessionId") || ""

  const { validateCheckIn, recordCheckIn, currentUser } = useStore()

  const [checkInState, setCheckInState] = useState<"ready" | "scanning" | "success" | "error">("ready")
  const [errorMessage, setErrorMessage] = useState("")
  const [isVirtualClass, setIsVirtualClass] = useState(false)
  const [manualCodeEntry, setManualCodeEntry] = useState("")

  const participantId = currentUser?.id || "participant-fallback"

  const startScanning = () => {
    setCheckInState("scanning")
  }

  const handleScanComplete = (code: string) => {
    const result = validateCheckIn(participantId, code)

    if (result.success && result.qrCodeRecord) {
      const qr = result.qrCodeRecord
      const effectiveSessionId = `${qr.programId}-${qr.sessionNumber}`
      setIsVirtualClass(qr.isVirtual || false)

      // Record the check-in
      recordCheckIn({
        participantId,
        qrCodeId: code,
        sessionId: effectiveSessionId,
        checkedInAt: new Date().toISOString(),
        wasVirtual: qr.isVirtual || false,
        verified: true,
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
    const testCode = manualCodeEntry || `CLASS-test-${Date.now()}`
    handleScanComplete(testCode)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <QrCode className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">{className}</CardTitle>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mt-2">
            {classDay && classTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {classDay} {classTime}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {checkInState === "ready" && (
            <>
              <div className="text-center py-4">
                <p className="text-lg font-medium text-gray-900">Attendance Verification</p>
                <p className="text-sm text-gray-500 mt-1">Please scan the QR code displayed by your facilitator to record your attendance.</p>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <p className="font-semibold text-blue-900 text-sm mb-2">Instructions:</p>
                <ul className="text-blue-700 text-xs space-y-2 list-disc list-inside">
                  <li>Your facilitator will display a unique QR code</li>
                  <li>Position the code within the camera frame</li>
                  <li>Wait for the confirmation message</li>
                </ul>
              </div>

              <Button onClick={startScanning} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-semibold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]" size="lg">
                Start Scanning
              </Button>
            </>
          )}

          {checkInState === "scanning" && (
            <div className="space-y-4">
              {/* Camera Scanner View */}
              <div className="aspect-square bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden ring-4 ring-gray-100">
                <div className="absolute inset-8 border-2 border-white/30 rounded-2xl"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan"></div>
                <Camera className="h-12 w-12 text-white/20" />
              </div>
              <p className="text-center text-sm font-medium text-gray-600">Align QR code within the frame</p>

              {/* Manual Code Entry for Testing */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <p className="text-[10px] font-bold text-gray-400 mb-3 tracking-widest uppercase text-center">Development Overrides</p>
                <div className="flex gap-2">
                  <Input
                    value={manualCodeEntry}
                    onChange={(e) => setManualCodeEntry(e.target.value)}
                    placeholder="Enter code manually..."
                    className="flex-1 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                  <Button onClick={handleSimulateScan} variant="secondary" size="sm" className="bg-white border-gray-200">
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          )}

          {checkInState === "success" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Verified!</p>
              {isVirtualClass && (
                <div className="flex items-center justify-center gap-1 text-blue-600 mt-2 font-medium">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">Virtual Session Recorded</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">Attendance has been recorded in the platform truth.</p>
              <div className="mt-8 flex justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                </div>
              </div>
            </div>
          )}

          {checkInState === "error" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <p className="text-xl font-bold text-gray-900">Check-in Failed</p>
              <p className="text-sm text-gray-500 mt-2 px-4">{errorMessage}</p>
              <Button onClick={() => setCheckInState("scanning")} variant="outline" className="mt-6 w-full border-gray-200">
                Retry Scan
              </Button>
            </div>
          )}

          {checkInState !== "success" && (
            <Button variant="ghost" onClick={() => router.push("/participant")} className="w-full text-gray-500">
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>

      <footer className="fixed bottom-0 left-0 right-0 p-8 text-center text-xs font-medium text-gray-400">
        SECURITY ADVISORY: THIS SESSION LOG IS COURT-AUDITABLE
      </footer>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
