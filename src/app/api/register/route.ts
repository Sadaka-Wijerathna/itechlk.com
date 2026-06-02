import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, country, email, password } = await req.json();
    if (!firstName || !lastName || !country || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.emailVerified) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Grant admin if email matches ADMIN_EMAIL env var
    const isAdmin = 
      email === process.env.ADMIN_EMAIL || 
      email === "sadakaparamiwijerathna1@gmail.com" || 
      email === "itechlkstore@gmail.com";
    
    const role = isAdmin ? "admin" : "customer";

    const userData = {
      firstName,
      lastName,
      country,
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role,
      verificationCode,
      verificationCodeExpires,
    };

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: {
          ...userData,
          emailVerified: null, // Reset verification if updating
        },
      });
    } else {
      await prisma.user.create({
        data: userData,
      });
    }

    // Try to send email
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (err) {
      console.error("Email sending failed:", err);
      console.log(`Verification code for ${email} is: ${verificationCode}`);
    }

    return NextResponse.json(
      { message: "Verification code sent to your email" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/register]", error);
    return NextResponse.json({ error: "Could not register user" }, { status: 500 });
  }
}
