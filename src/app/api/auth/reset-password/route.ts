import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // 1. Find the token record
    const tokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: "Invalid or expired password reset link." }, { status: 400 });
    }

    // 2. Check token expiration
    if (tokenRecord.expires < new Date()) {
      // Clean up the expired token
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json({ error: "Password reset link has expired." }, { status: 400 });
    }

    // 3. Find the user
    const user = await prisma.user.findUnique({
      where: { email: tokenRecord.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User associated with this token was not found." }, { status: 400 });
    }

    // 4. Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: tokenRecord.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { token },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Password reset successfully." });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ error: "Could not reset password" }, { status: 500 });
  }
}
