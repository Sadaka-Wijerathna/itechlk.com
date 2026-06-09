import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the user ID from the database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // @ts-ignore: Next.js dev server cache hasn't loaded new prisma client types yet
    const newReview = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: Number(rating),
        comment,
      },
      include: {
        user: true, // return user details back to the client if needed
      }
    });

    // Update the average rating for the product
    await updateProductAverageRating(productId);

    return NextResponse.json(
      { message: "Review added successfully", review: newReview },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function updateProductAverageRating(productId: string) {
  try {
    // @ts-ignore
    const reviews = await prisma.review.findMany({
      where: { productId },
    });

    if (reviews.length === 0) {
      await prisma.product.update({
        where: { id: productId },
        data: { rating: 5 }, // Reset default rating to 5
      });
      return;
    }

    const sum = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    const avg = sum / reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: { rating: parseFloat(avg.toFixed(1)) },
    });
  } catch (err) {
    console.error("Failed to update product average rating:", err);
  }
}
