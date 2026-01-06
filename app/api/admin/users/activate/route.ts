
import { NextRequest, NextResponse } from "next/server";
import { getDb, getAuth } from "@/lib/firebase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const admin = await getAuthenticatedUser();
        if (!admin || admin.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: "Missing userId" }, { status: 400 });
        }

        const db = getDb();
        const auth = getAuth();

        // 1. Fetch the user profile and check for duplicates
        const initialUserRef = db.collection("users").doc(userId);
        const initialUserDoc = await initialUserRef.get();

        if (!initialUserDoc.exists) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        const initialUserData = initialUserDoc.data();
        if (!initialUserData?.email) {
            return NextResponse.json({ error: "User profile missing email" }, { status: 400 });
        }

        // Detect duplicate UNBOUND participant profiles and ensure we target the most recent one
        const usersCol = db.collection("users");
        const querySnapshot = await usersCol
            .where("email", "==", initialUserData.email)
            .get();

        let targetDoc = initialUserDoc;
        let latestDate = initialUserData.updatedAt || initialUserData.createdAt || "";

        querySnapshot.forEach(doc => {
            const data = doc.data();
            // Only consider unbound profiles for activation redirection
            if (!data.userId) {
                const date = data.updatedAt || data.createdAt || "";
                if (date > latestDate) {
                    latestDate = date;
                    targetDoc = doc;
                }
            }
        });

        const userData = targetDoc.data();
        const userRef = targetDoc.ref;
        if (userData?.role !== "facilitator" && userData?.role !== "participant") {
            return NextResponse.json({ error: "Target user role cannot be activated via this flow" }, { status: 400 });
        }

        if (!userData.email) {
            return NextResponse.json({ error: "User profile missing email" }, { status: 400 });
        }

        // 2. Resolve and verify the Auth account matches profile email
        let authUser;
        try {
            authUser = await auth.getUserByEmail(userData.email);
        } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
                return NextResponse.json({
                    error: "User must sign in once before authorization. No authenticated account found for this email."
                }, { status: 400 });
            }
            return NextResponse.json({
                error: `Identity verification failed: ${e.message}`
            }, { status: 400 });
        }

        if (!authUser) {
            return NextResponse.json({ error: "No authenticated user found for this identity." }, { status: 400 });
        }

        // Double check email match (case-insensitive) just to be safe
        if (authUser.email?.toLowerCase() !== userData.email.toLowerCase()) {
            return NextResponse.json({ error: "Authenticated email does not match profile email." }, { status: 400 });
        }

        // 3. Update the user profile with binding
        const updateData = {
            userId: authUser.uid,
            isProfileOnly: false,
            status: "active",
            boundAt: new Date().toISOString(),
            boundBy: admin.uid
        };

        await userRef.update(updateData);

        return NextResponse.json({
            success: true,
            message: "Identity bound successfully",
            data: updateData
        });

    } catch (error: any) {
        console.error("Activate user failed:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
