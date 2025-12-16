"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Camera, CheckCircle2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ParticipantRegister() {
  const router = useRouter()
  const [scanning, setScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [scanError, setScanError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startScanning = async () => {
    setScanning(true)
    setScanError("")

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      setScanError("Unable to access camera. Please grant camera permissions.")
      setScanning(false)
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  const handleQRCodeDetected = () => {
    // Simulate QR code detection
    stopScanning()
    setScanSuccess(true)
    setTimeout(() => {
      setScanSuccess(false)
      setShowForm(true)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would register the participant
    router.push("/participant")
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg" />
            <h1 className="text-xl font-semibold text-foreground">Drug Court Learning Platform</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Participant Registration</CardTitle>
            <CardDescription>Scan the QR code provided by your clinical director to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {!scanning && !scanSuccess && !showForm && (
              <div className="space-y-6">
                <div className="bg-muted rounded-lg p-12 flex flex-col items-center justify-center space-y-4">
                  <Camera className="h-24 w-24 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Ready to scan the registration QR code from your clinical director
                  </p>
                </div>
                <Button onClick={startScanning} className="w-full" size="lg">
                  <Camera className="h-5 w-5 mr-2" />
                  Start Camera
                </Button>
                {scanError && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{scanError}</p>
                  </div>
                )}
              </div>
            )}

            {scanning && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-4 border-primary/50 m-12 rounded-lg pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-primary rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={stopScanning} variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={handleQRCodeDetected} className="flex-1">
                    Simulate QR Scan
                  </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Position the QR code within the frame to scan
                </p>
              </div>
            )}

            {scanSuccess && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
                <p className="text-xl font-semibold text-foreground">QR Code Verified!</p>
                <p className="text-muted-foreground">Setting up your registration...</p>
              </div>
            )}

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Complete Registration
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
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
