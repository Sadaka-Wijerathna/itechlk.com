import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderStatusEmail } from '@/lib/email';

export async function POST(req: Request) {
  let callbackQueryId = '';
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  try {
    const body = await req.json();
    console.log('Telegram Webhook Payload:', JSON.stringify(body));

    // Handle Callback Query
    if (body.callback_query) {
      const callbackQuery = body.callback_query;
      callbackQueryId = callbackQuery.id;
      const data = callbackQuery.data; 
      const message = callbackQuery.message;
      const chatId = message.chat.id;
      const messageId = message.message_id;

      if (data.startsWith('order_confirm_') || data.startsWith('order_reject_')) {
        const isConfirm = data.startsWith('order_confirm_');
        const orderId = data.replace(isConfirm ? 'order_confirm_' : 'order_reject_', '').trim();
        const newStatus = isConfirm ? 'Confirmed' : 'Rejected';

        try {
          // Update Order in DB
          const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
          });

          // Send email notification to user
          try {
            await sendOrderStatusEmail(updatedOrder);
          } catch (emailErr) {
            console.error('Failed to send status update email via Telegram Webhook:', emailErr);
          }

          // Prep the update message
          const isPhoto = !!(message.photo || message.caption);
          const method = isPhoto ? 'editMessageCaption' : 'editMessageText';
          const bodyKey = isPhoto ? 'caption' : 'text';

          const text = `<b>Order ${newStatus}!</b>\n\n` +
            `<b>Order ID:</b> #${updatedOrder.id.slice(-6).toUpperCase()}\n` +
            `<b>Customer:</b> ${updatedOrder.firstName} ${updatedOrder.lastName}\n` +
            `<b>Status:</b> ${newStatus}\n\n` +
            `<i>Updated via Telegram Bot</i>`;

          // Attempt to edit message
          const editRes = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              [bodyKey]: text,
              parse_mode: 'HTML',
              reply_markup: { inline_keyboard: [] }
            }),
          });
          
          const editResult = await editRes.json();
          console.log('Telegram Edit Result:', editResult);

          // If photo edit failed, try text edit as fallback
          if (!editResult.ok && isPhoto) {
            await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text: text,
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [] }
              }),
            });
          }

          // ALWAYS answer callback query to stop loading
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackQueryId,
              text: `✅ Order successfully ${newStatus.toLowerCase()}`,
            }),
          });

        } catch (innerError: any) {
          console.error('Webhook Internal Error:', innerError);
          // Show alert to user if DB update or other logic fails
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              callback_query_id: callbackQueryId,
              text: `❌ Error: ${innerError.message || 'Operation failed'}`,
              show_alert: true
            }),
          });
        }
      } else {
        // Not an order button, but still answer to clear loading
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callback_query_id: callbackQueryId }),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (outerError: any) {
    console.error('Telegram Webhook Critical Failure:', outerError);
    // Ultimate fallback to stop the loading icon if we have the ID
    if (callbackQueryId) {
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callbackQueryId }),
      }).catch(() => {});
    }
    return NextResponse.json({ ok: false, error: outerError.message });
  }
}
