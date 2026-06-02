import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.product.deleteMany({});
    await prisma.order.deleteMany({});
    return NextResponse.json({ message: "Successfully cleared all Products and Orders from the database!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
