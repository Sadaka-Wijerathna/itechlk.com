import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoices = await (prisma.order as any).findMany({
      where: { isDirectInvoice: true },
      orderBy: { createdAt: 'desc' },
    });

    const normalizeOrder = (order: any) => {
      if (order.totalAmount < 1000) {
        return {
          ...order,
          totalAmount: order.totalAmount * 325,
          discountAmt: (order.discountAmt || 0) * 325,
          items: order.items.map((item: any) => ({
            ...item,
            price: item.price * 325
          }))
        };
      }
      return order;
    };

    return NextResponse.json(invoices.map(normalizeOrder));
  } catch (error: any) {
    console.error('Fetch Invoices Error:', error);
    return NextResponse.json({ error: 'Error fetching invoices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { firstName, lastName, email, phone, phoneCode, country, items, discountAmt } = body;

    // 3. Validation
    if (!email || !firstName || !lastName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 4. Resolve customer userId if email belongs to an existing user
    let userId: string | null = null;
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (existingUser) {
        userId = existingUser.id;
        try {
          await prisma.user.update({
            where: { id: userId },
            data: {
              firstName: firstName || undefined,
              lastName: lastName || undefined,
              country: country || undefined,
              phone: phone || undefined,
              phoneCode: phoneCode || undefined,
              name: firstName && lastName ? `${firstName} ${lastName}`.trim() : undefined
            }
          });
        } catch (err) {
          console.error('Failed to update user profile during admin invoice creation', err);
        }
      }
    }

    // 5. Build order items list and resolve product images
    const orderItems = [];
    for (const item of items) {
      let resolvedImg = '';
      if (item.productId && item.productId !== 'custom') {
        try {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (product) {
            resolvedImg = product.img;
          }
        } catch (err) {
          console.error(`Failed to fetch product image for ${item.productId}`, err);
        }
      }

      orderItems.push({
        productId: item.productId || 'custom',
        title: item.title || 'Custom Item',
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 1,
        img: resolvedImg,
        duration: item.duration || 'N/A',
      });
    }

    // 6. Calculate total amount
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount = parseFloat(discountAmt) || 0;
    const totalAmount = Math.max(0, subtotal - discount);

    // 7. Create the order (invoice)
    const order = await (prisma.order as any).create({
      data: {
        userId,
        email: email.toLowerCase().trim(),
        firstName,
        lastName,
        phone: phone || '',
        country: country || '',
        status: 'Pending',
        totalAmount,
        receiptUrl: null,
        items: orderItems,
        couponCode: null,
        discountAmt: discount,
        isDirectInvoice: true,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Create Admin Invoice Error:', error);
    return NextResponse.json({ error: error.message || 'Error creating invoice' }, { status: 500 });
  }
}
