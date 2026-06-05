import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { firstName, lastName, email, country, phone, phoneCode, receiptUrl, cart_products } = body;

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
        totalAmount,
        receiptUrl: receiptUrl || null,
        items,
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
      const caption = `<b>🚀 New Order Received!</b>\n\n` +
        `<b>Order ID:</b> #${order.id.slice(-6).toUpperCase()}\n` +
        `<b>Customer:</b> ${firstName} ${lastName}\n` +
        `<b>Email:</b> ${email}\n` +
        `<b>Phone:</b> <a href="https://wa.me/${phone.startsWith('0') ? '94' + phone.substring(1).replace(/\D/g, '') : phone.startsWith('94') ? phone.replace(/\D/g, '') : '94' + phone.replace(/\D/g, '')}">${phone}</a>\n` +
        `<b>Country:</b> ${country}\n\n` +
        `<b>Products:</b>\n${orderDetails}\n\n` +
        `<b>Total:</b> Rs. ${totalAmount.toLocaleString()}\n` +
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
    const userEmail = url.searchParams.get('email');

    // Admin requesting all orders
    if (session?.user?.role === 'admin' && !userEmail) {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(orders);
    }

    // User requesting their own orders
    const emailToFilter = userEmail || session?.user?.email;
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
