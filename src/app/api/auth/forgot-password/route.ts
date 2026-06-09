import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success even if email is not found to prevent user enumeration
      return NextResponse.json({ success: true, message: "If the email is registered, a reset link will be sent." });
    }

    // 2. Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // 3. Clear existing tokens and create a new one
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.toLowerCase() },
    });

    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expires,
      },
    });

    // 4. Send the reset email
    try {
      await sendPasswordResetEmail(email.toLowerCase(), token);
    } catch (err) {
      console.error("Failed to send password reset email:", err);
      // Log for fallback local debug / user recovery
      console.log(`[Password Reset Recovery Link]: /reset-password?token=${token}`);
    }

    return NextResponse.json({ success: true, message: "If the email is registered, a reset link will be sent." });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ error: "Could not process request" }, { status: 500 });
  }
}
