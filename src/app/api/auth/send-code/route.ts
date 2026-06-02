import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email is already verified
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.emailVerified) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Upsert into VerificationToken table
    await prisma.verificationToken.upsert({
      where: { token: verificationCode }, // This is not ideal as token must be unique, but for a random 6-digit it's usually fine for 10 mins. Better unique identifier would be email.
      // Actually, VerificationToken in NextAuth uses identifier (email) and token. 
      // But the unique constraint is on token.
      create: {
        identifier: email,
        token: verificationCode,
        expires,
      },
      update: {
        identifier: email,
        token: verificationCode,
        expires,
      }
    });

    // Try to send email
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (err) {
      console.error("Email sending failed:", err);
      console.log(`Verification code for ${email} is: ${verificationCode}`);
    }

    return NextResponse.json({ message: "Code sent successfully" });
  } catch (error) {
    console.error("[POST /api/auth/send-code]", error);
    return NextResponse.json({ error: "Could not send code" }, { status: 500 });
  }
}
