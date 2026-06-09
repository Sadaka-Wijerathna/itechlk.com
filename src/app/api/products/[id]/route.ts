import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id] – update (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Explicitly pick only fields that exist in the Prisma Product model
    const data: Record<string, any> = {};
    const allowed = [
      "title", "slug", "img", "thumbImg", "relatedImages",
      "parentCategory", "category", "brand",
      "price", "oldPrice", "discount",
      "rating", "smDesc",
      "sizes", "colors", "weight", "dimension",
      "isNew", "trending", "topRated", "bestSeller",
      "detailsText", "detailsList", "detailsText2", "active", "status", "durationPrices", "sortOrder",
    ];
    for (const key of allowed) {
      if (key in body) data[key] = body[key];
    }

    // Map status string → active boolean
    // Map status string → active boolean for legacy reasons if needed, but don't override isNew
    if (body.status) {
      // Products stay visible (active) for all these statuses
      data.active = ["Active", "New", "Out of Stock", "Pre Order"].includes(body.status);
    }

    const updated = await prisma.product.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[PUT /api/products/:id]", error);
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

// DELETE /api/products/[id] – soft delete (admin only)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Hard delete
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete product", details: error.message }, { status: 500 });
  }
}
