"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, QrCode } from "lucide-react"

const DEV_MODE = false

export default function SignInPage() {
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.push("/login")
  }

  const handleDevBypass = (role: "admin" | "facilitator" | "participant") => {
    if (role === "admin") router.push("/admin")
    else if (role === "facilitator") router.push("/facilitator")
    else router.push("/participant")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-sm">Drug Court Learning Platform</h1>
            <p className="text-gray-700 drop-shadow-sm">Select your role to sign in</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Admin Entry */}
            <Card
              className="cursor-pointer hover:border-green-500 transition-colors card-transparent"
              onClick={handleLoginRedirect}
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
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleLoginRedirect}>Sign In with Email</Button>
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
              onClick={handleLoginRedirect}
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
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleLoginRedirect}>Sign In with Email</Button>
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
              onClick={handleLoginRedirect}
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
                  onClick={handleLoginRedirect}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Sign In with Email
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
      </div>

      <footer className="p-4 text-center text-sm text-gray-600 border-t border-gray-200/50 footer-transparent">
        © 2025 DMS Clinical Services. All rights reserved.
      </footer>
    </div>
  )
}
