import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  // CRITICAL: require admin auth — this route wipes the entire database
  const session = await auth();
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.product.deleteMany({});
    await prisma.order.deleteMany({});
    return NextResponse.json({ message: "Successfully cleared all Products and Orders from the database!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
