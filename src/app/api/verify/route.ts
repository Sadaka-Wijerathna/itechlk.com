import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    // 1. Check if user already exists and has the code
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      if (user.emailVerified) {
        return NextResponse.json({ error: "Email already verified" }, { status: 400 });
      }

      if (user.verificationCode === code) {
        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) {
          return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
        }

        await prisma.user.update({
          where: { email },
          data: {
            emailVerified: new Date(),
            verificationCode: null,
            verificationCodeExpires: null,
          },
        });
        return NextResponse.json({ message: "Email verified successfully" });
      }
    }

    // 2. If user doesn't exist or code didn't match, check VerificationToken table
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { identifier: email, token: code },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    if (tokenRecord.expires < new Date()) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
    }

    // Success - we'll keep the record for now to allow full registration to complete 
    // or just mark it as "verified" in a way the frontend knows.
    // Actually, we can delete it now or let the frontend know it's good.
    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("[POST /api/verify]", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
