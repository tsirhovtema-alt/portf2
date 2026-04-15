import { NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID   ?? '';

export async function POST(request: Request) {
  try {
        const { name, phone, project } = await request.json() as {
          name: string; phone: string; project: string;
        };

    if (!name || !phone) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 });
    }

    if (!BOT_TOKEN || !CHAT_ID) {
      /* If env vars are missing, still return success in dev so form works */
      console.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
      return NextResponse.json({ ok: true });
    }

    const text = [
      '🔔 *Новая заявка с сайта WEB TERA*',
      '',
          `👤 *Имя:* ${name}`,
          `📞 *Телефон:* ${phone}`,
          `💬 *Задача:* ${project || 'не указана'}`,
      '',
      `🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`,
    ].join('\n');

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
      },
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Telegram error:', err);
      return NextResponse.json({ error: 'Ошибка Telegram API' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
