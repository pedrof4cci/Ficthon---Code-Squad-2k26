// =========================================
//  E se fosse você? — webhook.js
// =========================================

const WEBHOOK_URL = 'https://alexandrefoda.app.n8n.cloud/webhook-test/e63b847f-90ef-47c0-9a5c-1f9509d528a2';

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