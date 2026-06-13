import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: couponId } = await params;
    const body = await req.json();
    const { code, discountType, discountValue, minOrderValue, maxDiscount, expirationDate, maxUses, active } = body;

    // Check if another coupon has the same code
    if (code) {
      const existing = await prisma.coupon.findUnique({ where: { code } });
      if (existing && existing.id !== couponId) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
      }
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        ...(code && { code }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: Number(discountValue) }),
        ...(minOrderValue !== undefined && { minOrderValue: Number(minOrderValue) }),
        ...(maxDiscount !== undefined && { maxDiscount: maxDiscount === null ? null : Number(maxDiscount) }),
        ...(expirationDate !== undefined && { expirationDate: expirationDate === null ? null : new Date(expirationDate) }),
        ...(maxUses !== undefined && { maxUses: maxUses === null ? null : Number(maxUses) }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error: any) {
    console.error('Update Coupon Error:', error);
    return NextResponse.json({ error: error.message || 'Error updating coupon' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    console.error('Delete Coupon Error:', error);
    return NextResponse.json({ error: 'Error deleting coupon' }, { status: 500 });
  }
}
