const WEBHOOK_HISTORIA_PRONTA = "https://alexandrefoda.app.n8n.cloud/webhook/ficthon-codesquad-2k26_cenario_pronto";
const WEBHOOK_HISTORIA_USUARIO = "https://alexandrefoda.app.n8n.cloud/webhook/ficthon-codesquad-2k26_cenario_usuario";

export async function getStory(id) {
  const res = await fetch(WEBHOOK_HISTORIA_PRONTA, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  return res.json();
}

export async function sendMessage(message) {
  const res = await fetch(WEBHOOK_HISTORIA_USUARIO, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  return res.json();
}
