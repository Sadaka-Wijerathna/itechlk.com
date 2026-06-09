import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// POST /api/products/reorder-all – bulk reorder products
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productIds } = await req.json();

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ error: "productIds array is required" }, { status: 400 });
    }

    // Retry logic for MongoDB write conflicts (P2034)
    let attempts = 0;
    while (attempts < 3) {
      try {
        await prisma.$transaction(async (tx) => {
          for (let i = 0; i < productIds.length; i++) {
            await tx.product.update({
              where: { id: productIds[i] },
              data: { sortOrder: i * 10 },
            });
          }
        }, {
          timeout: 20000, // MongoDB transactions can be slow
        });
        break; // Success
      } catch (error: any) {
        attempts++;
        if ((error.code === 'P2034' || error.message?.includes('WriteConflict')) && attempts < 3) {
          console.warn(`Reorder attempt ${attempts} failed. Retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bulk reorder error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
