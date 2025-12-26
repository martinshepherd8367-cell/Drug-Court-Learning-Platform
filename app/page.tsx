"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, Users, QrCode, Camera, ArrowLeft } from "lucide-react"
import { useStore } from "@/lib/store"
import { mockUsers } from "@/lib/mock-data"

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true"

export default function SignInPage() {
  const router = useRouter()
  const { setCurrentUser } = useStore()
  const [selectedRole, setSelectedRole] = useState<"admin" | "facilitator" | "participant" | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [error, setError] = useState("")
  const [participantEmail, setParticipantEmail] = useState("")
  const [showEmailVerify, setShowEmailVerify] = useState(false)

  const handleDevBypass = (role: "admin" | "facilitator" | "participant") => {
    let user;
    if (role === 'admin') user = mockUsers.find(u => u.role === 'admin');
    else if (role === 'facilitator') user = mockUsers.find(u => u.role === 'facilitator');
    else user = mockUsers.find(u => u.role === 'participant'); // Default to first participant

    if (user) {
      setCurrentUser(user);
      if (role === "admin") router.push("/admin");
      else if (role === "facilitator") router.push("/facilitator");
      else router.push("/participant");
    }
  }

  const handleAdminSignIn = () => {
    if (DEV_MODE) {
      handleDevBypass("admin")
      return
    }
    if (email === "martin@dmsclinicalservices.com" && password === "Archer123") {
      router.push("/admin")
    } else {
      setError("Invalid email or password")
    }
  }

  const handleFacilitatorSignIn = () => {
    if (DEV_MODE) {
      handleDevBypass("facilitator")
      return
    }
    if (email && password) {
      router.push("/facilitator")
    } else {
      setError("Please enter email and password")
    }
  }

  const handleScanSuccess = () => {
    setScanSuccess(true)
    setTimeout(() => {
      setShowScanner(false)
      setScanSuccess(false)
      setShowEmailVerify(true)
    }, 1500)
  }

  const handleParticipantEmailSignIn = () => {
    if (DEV_MODE) {
      handleDevBypass("participant")
      return
    }
    if (participantEmail && participantEmail.includes("@")) {
      router.push("/participant")
    } else {
      setError("Please enter a valid email address")
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setParticipantEmail("")
    setError("")
    setSelectedRole(null)
    setShowEmailVerify(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {/* Role Selection */}
        {!selectedRole && (
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">Drug Court Learning Platform</h1>
              <p className="text-gray-700 drop-shadow-sm">Select your role to sign in</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Admin Entry */}
              <Card
                className="cursor-pointer hover:border-green-500 transition-colors card-transparent"
                onClick={() => setSelectedRole("admin")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto p-4 bg-green-100/80 rounded-full w-fit mb-2">
                    <Shield className="h-10 w-10 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Admin</CardTitle>
                  <CardDescription>Clinical Director Access</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-gray-500 mb-4">Manage programs, users, enrollments and reports</p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (DEV_MODE) handleDevBypass("admin")
                      else setSelectedRole("admin")
                    }}
                    disabled={!DEV_MODE}
                  >
                    {DEV_MODE ? "Sign In with Email" : "Sign In with Email (V2)"}
                  </Button>
                  {DEV_MODE && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDevBypass("admin")
                      }}
                    >
                      [DEV] Skip Sign In
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Facilitator Entry */}
              <Card
                className="cursor-pointer hover:border-green-500 transition-colors card-transparent"
                onClick={() => setSelectedRole("facilitator")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto p-4 bg-green-100/80 rounded-full w-fit mb-2">
                    <Users className="h-10 w-10 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Facilitator</CardTitle>
                  <CardDescription>Group Facilitator Access</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-gray-500 mb-4">Lead sessions, review homework, manage participants</p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (DEV_MODE) handleDevBypass("facilitator")
                      else setSelectedRole("facilitator")
                    }}
                    disabled={!DEV_MODE}
                  >
                    {DEV_MODE ? "Sign In with Email" : "Sign In with Email (V2)"}
                  </Button>
                  {DEV_MODE && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDevBypass("facilitator")
                      }}
                    >
                      [DEV] Skip Sign In
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Participant Entry */}
              <Card
                className="cursor-pointer hover:border-green-500 transition-colors card-transparent"
                onClick={() => setSelectedRole("participant")}
              >
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto p-4 bg-green-100/80 rounded-full w-fit mb-2">
                    <QrCode className="h-10 w-10 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Participant</CardTitle>
                  <CardDescription>Program Participant Access</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p className="text-sm text-gray-500 mb-4">Access classes, complete homework, write journal entries</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowScanner(true)
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Scan QR Code
                  </Button>
                  {DEV_MODE && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDevBypass("participant")
                      }}
                    >
                      [DEV] Skip Sign In
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {DEV_MODE && (
              <div className="mt-6 text-center">
                <p className="text-xs text-orange-600 bg-orange-100/80 inline-block px-3 py-1 rounded-full">
                  DEV MODE ENABLED - Remove before launch
                </p>
              </div>
            )}
          </div>
        )}

        {/* Admin Sign In Form */}
        {selectedRole === "admin" && (
          <Card className="w-full max-w-md card-transparent">
            <CardHeader>
              <Button variant="ghost" size="sm" onClick={resetForm} className="w-fit -ml-2 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-green-100/80 rounded-full">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Admin Sign In</CardTitle>
              <CardDescription className="text-center">Clinical Director Access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@dmsclinicalservices.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className="bg-white/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className="bg-white/80"
                />
              </div>
              <Button onClick={handleAdminSignIn} className="w-full bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
              {DEV_MODE && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                  onClick={() => handleDevBypass("admin")}
                >
                  [DEV] Skip Sign In
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Facilitator Sign In Form */}
        {selectedRole === "facilitator" && (
          <Card className="w-full max-w-md card-transparent">
            <CardHeader>
              <Button variant="ghost" size="sm" onClick={resetForm} className="w-fit -ml-2 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-green-100/80 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Facilitator Sign In</CardTitle>
              <CardDescription className="text-center">Group Facilitator Access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
              <div className="space-y-2">
                <Label htmlFor="facilitator-email">Email</Label>
                <Input
                  id="facilitator-email"
                  type="email"
                  placeholder="facilitator@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className="bg-white/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator-password">Password</Label>
                <Input
                  id="facilitator-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className="bg-white/80"
                />
              </div>
              <Button onClick={handleFacilitatorSignIn} className="w-full bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
              {DEV_MODE && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                  onClick={() => handleDevBypass("facilitator")}
                >
                  [DEV] Skip Sign In
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Participant QR Scanner */}
        {selectedRole === "participant" && !showEmailVerify && (
          <Card className="w-full max-w-md card-transparent">
            <CardHeader>
              <Button variant="ghost" size="sm" onClick={resetForm} className="w-fit -ml-2 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-green-100/80 rounded-full">
                  <QrCode className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Participant Access</CardTitle>
              <CardDescription className="text-center">Scan your registration QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-gray-600 text-sm">
                Scan the QR code provided by your clinical director to register and access your dashboard.
              </p>
              <Button onClick={() => setShowScanner(true)} className="w-full bg-green-600 hover:bg-green-700">
                <Camera className="h-4 w-4 mr-2" />
                Open Camera to Scan
              </Button>
              <div className="text-center">
                <Button variant="link" className="text-green-600" onClick={() => router.push("/participant")}>
                  Already registered? Go to dashboard
                </Button>
              </div>
              {DEV_MODE && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                  onClick={() => handleDevBypass("participant")}
                >
                  [DEV] Skip QR + Email Verification
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Participant Email Verification after QR scan */}
        {selectedRole === "participant" && showEmailVerify && (
          <Card className="w-full max-w-md card-transparent">
            <CardHeader>
              <Button variant="ghost" size="sm" onClick={resetForm} className="w-fit -ml-2 mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-green-100/80 rounded-full">
                  <QrCode className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-center">Verify Your Identity</CardTitle>
              <CardDescription className="text-center">Enter your email to sign in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
              <div className="p-3 bg-green-50/80 text-green-700 rounded-lg text-sm text-center">
                QR Code verified successfully
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-email">Your Email Address</Label>
                <Input
                  id="participant-email"
                  type="email"
                  placeholder="yourname@example.com"
                  value={participantEmail}
                  onChange={(e) => {
                    setParticipantEmail(e.target.value)
                    setError("")
                  }}
                  className="bg-white/80"
                />
                <p className="text-xs text-gray-500">Enter the email you registered with</p>
              </div>
              <Button onClick={handleParticipantEmailSignIn} className="w-full bg-green-600 hover:bg-green-700">
                Sign In
              </Button>
              {DEV_MODE && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                  onClick={() => handleDevBypass("participant")}
                >
                  [DEV] Skip Email Verification
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="p-4 text-center text-sm text-gray-600 border-t border-gray-200/50 footer-transparent">
        © 2025 DMS Clinical Services. All rights reserved.
      </footer>

      {/* QR Scanner Modal */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-md card-transparent">
          <DialogHeader>
            <DialogTitle>Scan Registration QR Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {scanSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-green-100/80 rounded-full flex items-center justify-center mb-4">
                  <QrCode className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium">Registration QR Code Detected!</p>
                <p className="text-sm text-gray-500">Redirecting to registration...</p>
              </div>
            ) : (
              <>
                <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-4 border-2 border-white/50 rounded-lg"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-500 animate-pulse"></div>
                  <Camera className="h-12 w-12 text-white/50" />
                </div>
                <p className="text-center text-sm text-gray-500">Position the QR code within the frame</p>
                <Button onClick={handleScanSuccess} variant="outline" className="w-full bg-white/80">
                  Simulate QR Scan (Testing)
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
