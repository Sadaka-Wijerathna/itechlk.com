const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(text: string, inlineKeyboard?: any, customChatIds?: string[]) {
  if (!BOT_TOKEN) {
    console.error('Telegram bot token missing');
    return;
  }

  const ids = customChatIds || [];
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
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) console.error(`Telegram API error for ${id}:`, data);
      else console.log(`Telegram message sent successfully to ${id}`);
    })
    .catch(err => console.error(`Error sending to ${id}:`, err));
  }
}

export async function sendTelegramPhoto(photoUrl: string, caption: string, inlineKeyboard?: any, customChatIds?: string[]) {
  if (!BOT_TOKEN) {
    console.error('Telegram bot token missing');
    return;
  }

  const ids = customChatIds || [];
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
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) console.error(`Telegram API error (photo) for ${id}:`, data);
      else console.log(`Telegram photo sent successfully to ${id}`);
    })
    .catch(err => console.error(`Error sending to ${id}:`, err));
  }
}
