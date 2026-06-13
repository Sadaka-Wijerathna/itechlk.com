import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { getCurrencyRates } from '@/lib/currency';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { firstName, lastName, email, country, phone, phoneCode, receiptUrl, cart_products, couponCode } = body;

    if (!firstName || !email || !cart_products || cart_products.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update user profile with latest checkout details if logged in
    if (session?.user?.email) {
      try {
        await prisma.user.update({
          where: { email: session.user.email },
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
        console.error('Failed to update user profile during checkout', err);
      }
    }

    const totalAmount = cart_products.reduce((acc: number, item: any) => acc + (item.price * item.orderQuantity), 0);
    
    // Server-side coupon validation
    let finalTotal = totalAmount;
    let actualDiscount = 0;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.active && 
          (!coupon.expirationDate || new Date(coupon.expirationDate) >= new Date()) && 
          (!coupon.maxUses || coupon.usedCount < coupon.maxUses) && 
          (!coupon.minOrderValue || totalAmount >= coupon.minOrderValue)) {
        
        if (coupon.discountType === 'percentage') {
          actualDiscount = (totalAmount * coupon.discountValue) / 100;
          if (coupon.maxDiscount && actualDiscount > coupon.maxDiscount) actualDiscount = coupon.maxDiscount;
        } else {
          actualDiscount = coupon.discountValue;
          if (actualDiscount > totalAmount) actualDiscount = totalAmount;
        }
        finalTotal -= actualDiscount;

        // Increment used count
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } }
        });
      } else {
        return NextResponse.json({ error: 'Applied coupon is invalid or expired.' }, { status: 400 });
      }
    }

    // Map products to OrderItem format
    const items = cart_products.map((item: any) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.orderQuantity,
      img: item.img || '',
      duration: item.selectedDuration || 'N/A',
    }));

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null,
        email,
        firstName,
        lastName,
        phone,
        country,
        status: 'Pending',
        totalAmount: finalTotal,
        receiptUrl: receiptUrl || null,
        items,
        couponCode: couponCode || null,
        discountAmt: actualDiscount > 0 ? actualDiscount : 0,
      },
    });

    // Send Telegram Notification
    try {
      // Fetch dynamic chat IDs from settings
      const settingsRows = await (prisma as any).siteSettings.findMany({
        where: { key: 'telegramChatIds' }
      });
      const settingsChatIds = settingsRows[0]?.value?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];
      
      console.log(`[Telegram] Found ${settingsChatIds.length} admin IDs in database.`);
      if (settingsChatIds.length === 0) {
        console.warn('[Telegram] No admin IDs found in database (key: telegramChatIds). Notification skipped.');
      }

      const { sendTelegramPhoto } = await import('@/lib/telegram');
      const orderDetails = items.map((i: any) => `- ${i.title} (${i.duration}) x${i.quantity}`).join('\n');
      
      // Convert to LKR for notification using dynamic rates
      const rates = await getCurrencyRates();
      const lkrTotal = finalTotal * rates.LKR;
      const lkrDiscount = actualDiscount * rates.LKR;
      
      const caption = `<b>🚀 New Order Received!</b>\n\n` +
        `<b>Order ID:</b> #${order.id.slice(-6).toUpperCase()}\n` +
        `<b>Customer:</b> ${firstName} ${lastName}\n` +
        `<b>Email:</b> ${email}\n` +
        `<b>Phone:</b> <a href="https://wa.me/${phone.startsWith('0') ? '94' + phone.substring(1).replace(/\D/g, '') : phone.startsWith('94') ? phone.replace(/\D/g, '') : '94' + phone.replace(/\D/g, '')}">${phone}</a>\n` +
        `<b>Country:</b> ${country}\n\n` +
        `<b>Products:</b>\n${orderDetails}\n\n` +
        (actualDiscount > 0 ? `<b>Discount:</b> Rs. ${Math.round(lkrDiscount).toLocaleString()} (Code: ${couponCode})\n` : '') +
        `<b>Total:</b> Rs. ${Math.round(lkrTotal).toLocaleString()}\n` +
        `<b>Status:</b> ${order.status}`;

      const keyboard = [
        [
          { text: "✅ Confirm", callback_data: `order_confirm_${order.id}` },
          { text: "❌ Reject", callback_data: `order_reject_${order.id}` }
        ]
      ];

      if (receiptUrl) {
        await sendTelegramPhoto(receiptUrl, caption, keyboard, settingsChatIds);
      } else {
        const { sendTelegramMessage } = await import('@/lib/telegram');
        await sendTelegramMessage(caption, keyboard, settingsChatIds);
      }
      console.log('[Telegram] Notification attempt completed.');
    } catch (tgError) {
      console.error('[Telegram] Critical Notification Error:', tgError);
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Error creating order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    const url = new URL(req.url);
    const requestedEmail = url.searchParams.get('email');

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.role === 'admin';

    // Admin requesting ALL orders (no specific email provided)
    if (isAdmin && !requestedEmail) {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(orders);
    }

    // Determine which email's orders to fetch
    let emailToFilter = session.user.email;

    if (requestedEmail) {
      // Only admins can fetch orders for an email other than their own
      if (isAdmin || session.user.email === requestedEmail) {
        emailToFilter = requestedEmail;
      } else {
        return NextResponse.json({ error: 'Unauthorized to view these orders' }, { status: 403 });
      }
    }

    if (!emailToFilter) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { email: emailToFilter },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.order.deleteMany();

    return NextResponse.json({ success: true, message: 'All orders deleted' });
  } catch (error: any) {
    console.error('Delete All Orders Error:', error);
    return NextResponse.json({ error: 'Error deleting all orders' }, { status: 500 });
  }
}
