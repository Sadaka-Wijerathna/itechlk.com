import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const currentUserEmail = session?.user?.email;

    if (!currentUserEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const userToDelete = await prisma.user.findUnique({ where: { id: id } });
    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting oneself
    if (userToDelete.email === currentUserEmail) {
      return NextResponse.json(
        { error: "You cannot delete your own account." },
        { status: 400 }
      );
    }

    // Authorization checks
    if (userToDelete.role === "admin" && currentUserEmail !== "itechlkstore@gmail.com") {
      return NextResponse.json(
        { error: "Unauthorized. Only super admin can delete other admins." },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
