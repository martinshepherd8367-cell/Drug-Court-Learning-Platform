"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, ShieldCheck, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter()

  const handleFacilitatorSignIn = () => {
    router.push("/facilitator")
  }

  const handleAdminSignIn = () => {
    router.push("/admin")
  }

  const handleParticipantQRScan = () => {
    router.push("/participant/register")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg" />
            <h1 className="text-xl font-semibold text-foreground">Drug Court Learning Platform</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-3 text-balance">Welcome to Your Learning Platform</h2>
            <p className="text-lg text-muted-foreground text-balance">Choose your role to get started</p>
          </div>

          {/* Sign In Options Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Admin Sign In */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Admin</CardTitle>
                <CardDescription>Platform administration access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" type="email" placeholder="admin@example.com" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" placeholder="Enter password" className="bg-background" />
                </div>
                <Button className="w-full" size="lg" onClick={handleAdminSignIn}>
                  Sign In as Admin
                </Button>
              </CardContent>
            </Card>

            {/* Facilitator Sign In */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Facilitator</CardTitle>
                <CardDescription>Access class management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facilitator-email">Email</Label>
                  <Input
                    id="facilitator-email"
                    type="email"
                    placeholder="facilitator@example.com"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facilitator-password">Password</Label>
                  <Input
                    id="facilitator-password"
                    type="password"
                    placeholder="Enter password"
                    className="bg-background"
                  />
                </div>
                <Button className="w-full" size="lg" onClick={handleFacilitatorSignIn}>
                  Sign In as Facilitator
                </Button>
              </CardContent>
            </Card>

            {/* Participant QR Code Access */}
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Participant</CardTitle>
                <CardDescription>Scan QR code to access your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-[140px] cursor-pointer"
                  onClick={handleParticipantQRScan}
                >
                  <div className="text-center">
                    <QrCode className="h-24 w-24 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tap to scan QR code</p>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleParticipantQRScan}>
                  Scan QR Code
                </Button>
                <p className="text-xs text-center text-muted-foreground">QR code provided by clinical director</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DMS Clinical Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
