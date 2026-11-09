import { NextResponse } from 'next/server';
import { evaluateAekkarinIntent } from '@/app/data/aekkarinData';

export async function POST(request) {
  try {
    const body = await request.json();
    const message = (body.message || body.chatInput || '').toString().trim();
    const sessionId = body.sessionId || `session_${Date.now()}`;

    // Optional external n8n webhook forwarding if configured
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, chatInput: message, sessionId }),
          signal: AbortSignal.timeout(4500),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.reply) {
            return NextResponse.json({
              sessionId,
              topic: data.topic || 'n8n_webhook',
              reply: data.reply,
              status: 'success',
              processedAt: new Date().toISOString(),
            });
          }
        }
      } catch {
        // Fallback to built-in 12-Node Intent Classifier below
      }
    }

    const result = evaluateAekkarinIntent(message);
    return NextResponse.json({
      sessionId,
      userMessage: message,
      topic: result.topic,
      reply: result.reply,
      status: 'success',
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        reply:
          'สวัสดีครับ! สามารถสอบถามเกี่ยวกับประวัติของ เอกรินทร์ นีระมนต์, ผลงาน FaceCheck, ระบบ n8n AI หรือติดต่อที่ mikp1919@gmail.com ได้เลยครับ',
        status: 'fallback',
      },
      { status: 200 }
    );
  }
}
