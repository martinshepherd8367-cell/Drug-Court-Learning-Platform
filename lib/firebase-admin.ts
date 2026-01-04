import * as admin from "firebase-admin";

let _initialized = false;

function initAdmin() {
  if (_initialized) return;
  if (admin.apps.length) {
    _initialized = true;
    return;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = privateKeyRaw ? privateKeyRaw.replace(/\\n/g, "\n") : undefined;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      } as any),
      projectId,
    });
    _initialized = true;
    return;
  }

  // Cloud Run / ADC fallback
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
  });
  _initialized = true;
}

export function getDb() {
  initAdmin();
  return admin.firestore();
}

export function getAuth() {
  initAdmin();
  return admin.auth();
}
