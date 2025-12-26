import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

function normalizePrivateKey(raw?: string): string {
    if (!raw) return '';
    let k = raw.trim();
    
    // Aggressively find the start index to handle quotes/garbage
    const startMarker = '-----BEGIN PRIVATE KEY-----';
    const idx = k.indexOf(startMarker);
    if (idx > -1) {
        k = k.substring(idx);
    }
    
    // Also clean up the end if there are trailing quotes
    const endMarker = '-----END PRIVATE KEY-----';
    const endIdx = k.indexOf(endMarker);
    if (endIdx > -1) {
        k = k.substring(0, endIdx + endMarker.length);
    }

    // Convert escaped newlines to real newlines
    k = k.replace(/\\n/g, '\n');
    return k;
}

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
    
    // Normalize key immediately
    if (process.env.FIREBASE_PRIVATE_KEY) {
        process.env.FIREBASE_PRIVATE_KEY = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
    }
    
    console.log('Loaded environment variables from .env.local via dotenv');
    // Debug checks (safe)
    const pk = process.env.FIREBASE_PRIVATE_KEY || '';
    console.log('FIREBASE_PRIVATE_KEY length:', pk.length);
    console.log('FIREBASE_PRIVATE_KEY starts with BEGIN?:', pk.startsWith('-----BEGIN PRIVATE KEY-----'));
}

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const confirmWrite = args.includes('--confirm-write');
const inputPath = args.find(a => !a.startsWith('--')) || 'data_import/court_ops_seed.json';

if (!dryRun && !confirmWrite) {
    console.error('Error: You must specify either --dry-run or --confirm-write');
    process.exit(1);
}

// Interfaces matching seed JSON structure
interface SeedData {
    programs_catalog: Array<{
        slug: string;
        title: string;
        curriculumStatus: 'installed' | 'pending';
        expectedSessions: number;
        active: boolean;
    }>;
    users: Array<{
        uid: string;
        email: string | null;
        role: 'admin' | 'facilitator' | 'participant';
        name: string;
        active: boolean;
        createdAt: string;
    }>;
}

async function main() {
    const fullPath = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(fullPath)) {
        console.error(`Seed file not found at: ${fullPath}`);
        console.log('Please create a JSON file with keys "programs_catalog" and "users".');
        process.exit(1);
    }

    const rawData = fs.readFileSync(fullPath, 'utf-8');
    const data: SeedData = JSON.parse(rawData);

    console.log(`Loaded seed data from ${inputPath}`);
    console.log(`Found ${data.programs_catalog?.length || 0} programs`);
    console.log(`Found ${data.users?.length || 0} users`);

    if (dryRun) {
        console.log('\n[DRY RUN] No changes made to Firestore.');
        return;
    }

    // --- WRITE MODE ---

    // Init Firebase (Admin)
    // We assume credentials are in env vars, just like the app
    if (!admin.apps.length) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                }),
            });
        } catch (e) {
            console.error('Failed to initialize Firebase Admin:', e);
            process.exit(1);
        }
    }

    const db = admin.firestore();
    const batch = db.batch();
    let batchCount = 0;

    // Programs
    if (data.programs_catalog) {
        for (const prog of data.programs_catalog) {
            const ref = db.collection('programs_catalog').doc(prog.slug);
            batch.set(ref, prog, { merge: true });
            batchCount++;
        }
    }

    // Users
    if (data.users) {
        for (const user of data.users) {
            const ref = db.collection('users').doc(user.uid);
            batch.set(ref, user, { merge: true });
            batchCount++;
        }
    }

    // Commit
    if (batchCount > 0) {
        await batch.commit();
        console.log(`\nSuccessfully wrote ${batchCount} documents to Firestore.`);
    } else {
        console.log('\nNo documents to write.');
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
