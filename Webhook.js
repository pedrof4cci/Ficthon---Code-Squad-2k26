// =========================================
//  E se fosse você? — webhook.js
//  Proxy via Netlify Functions → n8n
// =========================================

const WEBHOOK_URL = '/api/webhook';

export async function sendToWebhook(payload) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;

  } catch (error) {
    throw new Error(error.message);
  }
}