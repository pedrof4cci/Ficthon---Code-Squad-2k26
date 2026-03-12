// =========================================
//  STORYFORGE — app.js v2
// =========================================

import { sendToWebhook } from './webhook.js';

let selectedStory = null;
let messageHistory = [];

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('user-input');

  input.addEventListener('input', () => {
    const len = input.value.length;
    document.getElementById('char-count').textContent = `${len} / 2000`;
    if (len > 2000) input.value = input.value.slice(0, 2000);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Carousel scroll → update dots
  const track = document.getElementById('carousel-track');
  track.addEventListener('scroll', updateDots);
  updateDots();
});

// ---- CAROUSEL ----
window.scrollCarousel = function(dir) {
  const track = document.getElementById('carousel-track');
  const cardWidth = track.querySelector('.story-card').offsetWidth + 20; // gap
  track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  setTimeout(updateDots, 350);
};

function updateDots() {
  const track = document.getElementById('carousel-track');
  const cards = track.querySelectorAll('.story-card');
  const cardWidth = cards[0]?.offsetWidth + 20 || 300;
  const idx = Math.round(track.scrollLeft / cardWidth);
  const dots = document.querySelectorAll('.scroll-dots .dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));

  document.getElementById('btn-prev').disabled = idx === 0;
  document.getElementById('btn-next').disabled = idx >= cards.length - 1;
}

// ---- SELECT STORY ----
window.selectStory = function(btn) {
  const card = btn.closest('.story-card');
  const id    = card.dataset.story;
  const title = card.dataset.title;
  const desc  = card.dataset.desc;

  document.querySelectorAll('.story-card').forEach(c => c.classList.remove('selected'));

  if (selectedStory?.id === id) {
    selectedStory = null;
    document.getElementById('context-value').textContent = 'Modo livre';
    addSystemMessage('Universo deselecionado. Modo livre ativado.');
    return;
  }

  card.classList.add('selected');
  selectedStory = { id, title, desc };
  document.getElementById('context-value').textContent = title;
  addSystemMessage(`Universo selecionado: "${title}".`);
  document.getElementById('user-input').focus();
  showToast(`"${title}" selecionado`, 'success');
};

// ---- SEND MESSAGE ----
window.sendMessage = async function() {
  const input   = document.getElementById('user-input');
  const text    = input.value.trim();
  const sendBtn = document.getElementById('send-btn');
  if (!text) return;

  addUserMessage(text);
  input.value = '';
  document.getElementById('char-count').textContent = '0 / 2000';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Enviando...';

  const loadingId = addLoadingMessage();

  const payload = {
    timestamp: new Date().toISOString(),
    context: selectedStory
      ? { type: 'story', id: selectedStory.id, title: selectedStory.title }
      : { type: 'free' },
    message: text,
    history: messageHistory.slice(-10),
  };

  try {
    const response = await sendToWebhook(payload);
    removeLoadingMessage(loadingId);

    const raw = Array.isArray(response) ? response[0] : response;
    const reply =
      raw?.reply   ||
      raw?.output  ||
      raw?.message ||
      raw?.text    ||
      raw?.response||
      raw?.content ||
      (typeof raw === 'string' ? raw : null);

    if (reply) addBotMessage(reply);
    else addSystemMessage('Mensagem enviada com sucesso ✓');
    showToast('Enviado ✓', 'success');
  } catch (err) {
    removeLoadingMessage(loadingId);
    addErrorMessage(`Erro: ${err.message}`);
    showToast('Erro ao enviar.', 'error');
    console.error('[StoryForge]', err);
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = 'Enviar <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  messageHistory.push({ role: 'user', content: text, timestamp: new Date().toISOString() });
};

// ---- CLEAR ----
window.clearChat = function() {
  document.getElementById('chat-messages').innerHTML = '';
  messageHistory = [];
  addSystemMessage('Histórico limpo. Pronto para uma nova história.');
};

// ---- MESSAGE HELPERS ----
function addUserMessage(text) {
  const context = selectedStory?.title || null;
  append('user', `${context ? `<span class="context-tag">${context}</span>` : ''}${escapeHtml(text)}`, '✎');
}
function addBotMessage(text)    { append('',      escapeHtml(text), '✦'); }
function addSystemMessage(text) { append('system', escapeHtml(text), ''); }
function addErrorMessage(text)  { append('error',  escapeHtml(text), '!'); }

function addLoadingMessage() {
  const id  = `loading-${Date.now()}`;
  const msgs = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = 'message';
  div.id = id;
  div.innerHTML = `<p class="loading-dots"><span>•</span><span>•</span><span>•</span></p>`;
  msgs.appendChild(div);
  scrollToBottom();
  return id;
}

function removeLoadingMessage(id) {
  document.getElementById(id)?.remove();
}

function append(type, html, icon) {
  const msgs = document.getElementById('chat-messages');
  const div  = document.createElement('div');
  div.className = `message ${type}`;
  div.innerHTML = `${icon ? `<span class="msg-icon">${icon}</span>` : ''}<p>${html}</p>`;
  msgs.appendChild(div);
  scrollToBottom();
}

// ---- TOAST ----
let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ---- UTILS ----
function scrollToBottom() {
  const msgs = document.getElementById('chat-messages');
  msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/\n/g, '<br/>');
}