// =========================================
//  STORYFORGE — webhook.js
//  Configuração e envio para n8n
// =========================================

// ⚠️ CONFIGURE AQUI: cole a URL do seu webhook n8n
// Exemplo: https://seu-n8n.com/webhook/meu-fluxo
const WEBHOOK_URL = 'https://alexandrefoda.app.n8n.cloud/webhook/e63b847f-90ef-47c0-9a5c-1f9509d528a2';

// Timeout em ms para a requisição (padrão: 10s)
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Envia dados para o webhook do n8n.
 *
 * @param {Object} payload - Dados a serem enviados
 * @param {string} payload.timestamp    - ISO string do momento do envio
 * @param {Object} payload.context      - Contexto da história (tipo e ID)
 * @param {string} payload.message      - Mensagem do usuário
 * @param {Array}  payload.history      - Histórico recente da conversa
 *
 * @returns {Promise<Object|null>} Retorna o JSON da resposta do n8n, ou null se não houver corpo.
 * @throws {Error} Se a requisição falhar ou retornar status de erro.
 */
export async function sendToWebhook(payload) {
  if (!WEBHOOK_URL || WEBHOOK_URL.includes('SEU_N8N_URL')) {
    throw new Error('URL do webhook não configurada. Edite WEBHOOK_URL em webhook.js.');
  }

  // AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicione headers extras aqui se necessário (ex: autenticação)
        // 'Authorization': 'Bearer SEU_TOKEN',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Timeout: o n8n não respondeu a tempo. Verifique se o fluxo está ativo.');
    }
    throw new Error(`Falha na conexão: ${err.message}`);
  } finally {
    clearTimeout(timeoutId);
  }

  // Verifica status HTTP
  if (!response.ok) {
    let errorDetail = '';
    try {
      const errBody = await response.text();
      errorDetail = errBody ? ` — ${errBody}` : '';
    } catch (_) {}
    throw new Error(`Webhook retornou erro ${response.status}${errorDetail}`);
  }

  // Tenta parsear resposta como JSON (opcional: n8n pode retornar resposta do fluxo)
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (_) {
      return null;
    }
  }

  return null;
}

// =========================================
//  ESTRUTURA DO PAYLOAD ENVIADO AO N8N:
// =========================================
//
//  {
//    "timestamp": "2025-03-10T14:32:00.000Z",
//    "context": {
//      "type": "story",       // "story" | "free"
//      "id": "floresta",      // id do card selecionado (se houver)
//      "title": "A Floresta Sussurrante"
//    },
//    "message": "Era uma vez...",
//    "history": [
//      { "role": "user", "content": "...", "timestamp": "..." },
//      ...
//    ]
//  }
//
// =========================================
//  COMO CONFIGURAR NO N8N:
// =========================================
//
//  1. Abra seu n8n e crie um novo fluxo (workflow).
//  2. Adicione o nó "Webhook" como trigger.
//  3. Configure:
//       - HTTP Method: POST
//       - Path:        /storyforge  (ou o nome que preferir)
//       - Response Mode: "Respond to Webhook" (para retornar resposta ao chat)
//                   ou "Last Node" (se não precisar de resposta)
//  4. Copie a URL de produção gerada pelo n8n.
//     Exemplo: https://meu-n8n.com/webhook/storyforge
//  5. Cole essa URL na constante WEBHOOK_URL no topo deste arquivo.
//  6. Salve e ative o fluxo no n8n.
//
//  Para retornar uma resposta ao chat (campo "reply"):
//  - Adicione um nó "Respond to Webhook" no final do seu fluxo n8n
//  - Configure o corpo como:
//      { "reply": "{{ $json.sua_resposta }}" }
//
// =========================================