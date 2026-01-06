"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getClientAuth, googleProvider } from "@/lib/firebase-client"
import { signInWithPopup } from "firebase/auth"
import { Shield, Users, QrCode, LogIn, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const DEV_MODE = false

export default function SignInPage() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUnbound, setIsUnbound] = useState(false)

  const handleLoginRedirect = () => {
    router.push("/login")
  }

  const handleGoogleSignIn = async (intendedRole: string) => {
    setBusy(true)
    setError(null)
    setIsUnbound(false)
    try {
      const auth = getClientAuth()
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}))
        throw new Error(detail.error || "Authentication failed")
      }

      const { role } = await res.json()

      if (role === "unbound") {
        setIsUnbound(true)
        return
      }

      // If authorized, route to their actual role
      router.push(`/${role}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const handleDevBypass = (role: "admin" | "facilitator" | "participant") => {
    if (role === "admin") router.push("/admin")
    else if (role === "facilitator") router.push("/facilitator")
    else router.push("/participant")
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 drop-shadow-sm">Court Spine</h1>
            <p className="text-slate-600">Select your role to sign in</p>
          </div>

          {(error || isUnbound) && (
            <div className="mb-6 max-w-md mx-auto p-4 bg-white border border-red-100 rounded-xl shadow-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 text-sm">
                  {isUnbound ? "Access Restricted" : "Sign In Error"}
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {isUnbound
                    ? "Your account is not yet bound to a role. Please contact an administrator to activate your profile."
                    : error}
                </p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {/* Admin Entry */}
            <Card className="hover:border-blue-500 transition-all shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-4 bg-slate-100 rounded-full w-fit mb-2">
                  <Shield className="h-10 w-10 text-slate-700" />
                </div>
                <CardTitle className="text-xl">Admin</CardTitle>
                <CardDescription>Clinical Director Access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  onClick={handleLoginRedirect}
                  disabled={busy}
                >
                  Sign In with Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleGoogleSignIn("admin")}
                  disabled={busy}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In with Google
                </Button>
                {DEV_MODE && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] text-orange-600 uppercase font-bold"
                    onClick={() => handleDevBypass("admin")}
                  >
                    [DEV] Skip
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Facilitator Entry */}
            <Card className="hover:border-blue-500 transition-all shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-4 bg-slate-100 rounded-full w-fit mb-2">
                  <Users className="h-10 w-10 text-slate-700" />
                </div>
                <CardTitle className="text-xl">Facilitator</CardTitle>
                <CardDescription>Group Facilitator Access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  onClick={handleLoginRedirect}
                  disabled={busy}
                >
                  Sign In with Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleGoogleSignIn("facilitator")}
                  disabled={busy}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In with Google
                </Button>
                {DEV_MODE && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] text-orange-600 uppercase font-bold"
                    onClick={() => handleDevBypass("facilitator")}
                  >
                    [DEV] Skip
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Participant Entry */}
            <Card className="hover:border-blue-500 transition-all shadow-sm">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-4 bg-slate-100 rounded-full w-fit mb-2">
                  <QrCode className="h-10 w-10 text-slate-700" />
                </div>
                <CardTitle className="text-xl">Participant</CardTitle>
                <CardDescription>Program Participant Access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  onClick={handleLoginRedirect}
                  disabled={busy}
                >
                  Sign In with Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handleGoogleSignIn("participant")}
                  disabled={busy}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In with Google
                </Button>
                {DEV_MODE && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-[10px] text-orange-600 uppercase font-bold"
                    onClick={() => handleDevBypass("participant")}
                  >
                    [DEV] Skip
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="p-4 text-center text-sm text-slate-500 border-t border-slate-200">
        © 2025 DMS Clinical Services. All rights reserved.
      </footer>
    </div>
  )
}
