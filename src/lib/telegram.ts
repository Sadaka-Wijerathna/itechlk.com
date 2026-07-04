const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(text: string, inlineKeyboard?: any, customChatIds?: string[]) {
  if (!BOT_TOKEN) {
    console.error('[Telegram] BOT_TOKEN is missing in environment variables!');
    return;
  }
  const ids = customChatIds || [];
  console.log(`[Telegram] Sending message to ${ids.length} IDs: ${ids.join(', ')}`);
  if (ids.length === 0) return;

  for (const id of ids) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const body: any = {
      chat_id: id,
      text,
      parse_mode: 'HTML',
    };

    if (inlineKeyboard) {
      body.reply_markup = { inline_keyboard: inlineKeyboard };
    }

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(err => console.error(`Error sending to ${id}:`, err));
  }
}

export async function sendTelegramPhoto(photoUrl: string, caption: string, inlineKeyboard?: any, customChatIds?: string[]) {
  if (!BOT_TOKEN) {
    console.error('[Telegram] BOT_TOKEN is missing in environment variables!');
    return;
  }
  const ids = customChatIds || [];
  console.log(`[Telegram] Sending photo to ${ids.length} IDs: ${ids.join(', ')}`);
  if (ids.length === 0) return;

  for (const id of ids) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
    const body: any = {
      chat_id: id,
      photo: photoUrl,
      caption,
      parse_mode: 'HTML',
    };

    if (inlineKeyboard) {
      body.reply_markup = { inline_keyboard: inlineKeyboard };
    }

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(err => console.error(`Error sending to ${id}:`, err));
  }
}

export async function sendTelegramDocument(documentUrl: string, caption: string, inlineKeyboard?: any, customChatIds?: string[]) {
  if (!BOT_TOKEN) {
    console.error('[Telegram] BOT_TOKEN is missing in environment variables!');
    return;
  }
  const ids = customChatIds || [];
  console.log(`[Telegram] Sending document to ${ids.length} IDs: ${ids.join(', ')}`);
  if (ids.length === 0) return;

  for (const id of ids) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
    const body: any = {
      chat_id: id,
      document: documentUrl,
      caption,
      parse_mode: 'HTML',
    };

    if (inlineKeyboard) {
      body.reply_markup = { inline_keyboard: inlineKeyboard };
    }

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(err => console.error(`Error sending document to ${id}:`, err));
  }
}

