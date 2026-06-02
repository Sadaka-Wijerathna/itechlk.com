import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// GET /api/products – fetch all active products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products – create a new product (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, img, thumbImg, relatedImages, parentCategory, category,
      brand, price, oldPrice, discount, rating, smDesc,
      sizes, colors, weight, dimension, trending, topRated, bestSeller,
      isNew, status, detailsText, detailsList, detailsText2,
    } = body;

    if (!title || !img || !price) {
      return NextResponse.json({ error: "Missing required fields: title, img, price" }, { status: 400 });
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        img,
        thumbImg: thumbImg || img,
        relatedImages: relatedImages || [img],
        parentCategory: parentCategory || "Software & Subscriptions",
        category: category || "Subscriptions",
        brand: brand || "Digital",
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        discount: discount ? parseFloat(discount) : null,
        rating: rating ? parseFloat(rating) : 5,
        smDesc: smDesc || `Get access to premium features with ${title}.`,
        sizes: sizes || ["Standard"],
        colors: colors || ["Default"],
        weight: weight ? parseFloat(weight) : 0,
        dimension: dimension || "Digital Delivery",
        trending: trending ?? true,
        topRated: topRated ?? false,
        bestSeller: bestSeller ?? false,
        isNew: isNew ?? false,
        status: status || "Active",
        active: status ? ["Active", "New", "Out of Stock", "Pre Order"].includes(status) : true,
        detailsText: detailsText || "Instant digital delivery. Fully guaranteed working subscription.",
        detailsList: detailsList || ["Instant delivery via email", "24/7 Premium Support", "100% money back guarantee"],
        detailsText2: detailsText2 || "We pride ourselves on offering the best digital products with maximum reliability.",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/products]", error);
    return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 });
  }
}
