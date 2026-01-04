"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function getFirebaseAuth() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!apiKey || !authDomain || !projectId) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_* env vars");
  }

  if (!getApps().length) {
    initializeApp({ apiKey, authDomain, projectId });
  }
  return getAuth();
}

export default function LoginClient() {
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const auth = useMemo(() => {
    try {
      return getFirebaseAuth();
    } catch (e: any) {
      setErr(e?.message || "Firebase client init failed");
      return null;
    }
  }, []);

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

      window.location.href = from;
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
        style={{ width: "100%", padding: 12 }}
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </div>
  );
}
