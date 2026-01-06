"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getClientAuth, googleProvider } from "@/lib/firebase-client";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginClient() {
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const auth = useMemo(() => {
    try {
      return getClientAuth();
    } catch (e: any) {
      setErr(e?.message || "Firebase client init failed");
      return null;
    }
  }, []);

  async function onGoogleLogin() {
    setErr(null);
    if (!auth) return;
    setBusy(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error("Authentication failed");
      }

      const { role } = await res.json();
      if (role === "unbound") {
        throw new Error("Your account is not yet bound to a role. Please contact an administrator.");
      }

      let destination = from;
      if (!params.get("from")) {
        if (role === "admin") destination = "/admin";
        else if (role === "facilitator") destination = "/facilitator";
        else if (role === "participant") destination = "/participant";
      }

      window.location.href = destination;
    } catch (e: any) {
      setErr(e?.message || "Google sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onLogin() {
    setErr(null);
    if (!auth) return;
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken();

      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`session-login failed (${res.status}): ${t}`);
      }

      const { role } = await res.json();

      // Determine final destination
      let destination = from;
      if (!params.get("from")) {
        // Only override if 'from' wasn't explicitly provided (like from a deep link)
        if (role === "admin") destination = "/admin";
        else if (role === "facilitator") destination = "/facilitator";
        else if (role === "participant") destination = "/participant";
      }

      window.location.href = destination;
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>Sign in</h1>

      {err ? (
        <div style={{ background: "#fee", padding: 10, marginBottom: 12 }}>
          {err}
        </div>
      ) : null}

      <label style={{ display: "block", marginBottom: 8 }}>
        Email
        <input
          style={{ width: "100%", padding: 10, marginTop: 4 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      <label style={{ display: "block", marginBottom: 12 }}>
        Password
        <input
          style={{ width: "100%", padding: 10, marginTop: 4 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
        />
      </label>

      <button
        onClick={onLogin}
        disabled={busy || !email || !password}
        style={{ width: "100%", padding: 12, marginBottom: 8 }}
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <button
        onClick={onGoogleLogin}
        disabled={busy}
        style={{ width: "100%", padding: 12, background: "white", border: "1px solid #ccc", color: "#333" }}
      >
        {busy ? "Connecting…" : "Sign in with Google"}
      </button>
    </div>
  );
}
