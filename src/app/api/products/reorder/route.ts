import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// POST /api/products/reorder – swap sortOrder of two products
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, direction } = await req.json();

    const allowedDirections = ["up", "down", "top", "bottom", "normalize"];
    if (!allowedDirections.includes(direction)) {
      return NextResponse.json(
        { error: `direction must be one of: ${allowedDirections.join(", ")}` },
        { status: 400 }
      );
    }

    if (!productId && direction !== "normalize") {
      return NextResponse.json(
        { error: "productId is required for this direction" },
        { status: 400 }
      );
    }

    if (direction === "normalize") {
      const allProducts = await prisma.product.findMany({
        orderBy: [
          { sortOrder: "asc" },
          { createdAt: "asc" }
        ],
        select: { id: true },
      });

      await prisma.$transaction(
        allProducts.map((p, idx) => 
          prisma.product.update({
            where: { id: p.id },
            data: { sortOrder: idx * 10 }
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    // Get all products sorted by sortOrder ascending
    const allProducts = await prisma.product.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    const currentIndex = allProducts.findIndex((p) => p.id === productId);
    if (currentIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (direction === "up" || direction === "down") {
      const swapIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (swapIndex < 0 || swapIndex >= allProducts.length) {
        return NextResponse.json({ message: "Already at boundary" });
      }

      const currentProduct = allProducts[currentIndex];
      const swapProduct = allProducts[swapIndex];

      // Swap the sortOrder values
      await prisma.$transaction([
        prisma.product.update({
          where: { id: currentProduct.id },
          data: { sortOrder: swapProduct.sortOrder },
        }),
        prisma.product.update({
          where: { id: swapProduct.id },
          data: { sortOrder: currentProduct.sortOrder },
        }),
      ]);
    } else if (direction === "top") {
      if (currentIndex === 0) return NextResponse.json({ message: "Already at top" });
      
      const minOrder = allProducts[0].sortOrder;
      await prisma.product.update({
        where: { id: productId },
        data: { sortOrder: minOrder - 1 },
      });
    } else if (direction === "bottom") {
      if (currentIndex === allProducts.length - 1) return NextResponse.json({ message: "Already at bottom" });
      
      const maxOrder = allProducts[allProducts.length - 1].sortOrder;
      await prisma.product.update({
        where: { id: productId },
        data: { sortOrder: maxOrder + 1 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder" },
      { status: 500 }
    );
  }
}
