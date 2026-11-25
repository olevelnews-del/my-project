// Gemini tutor system prompt: "You are HSC Personal Tutor for Bangladesh, like NotebookLM + Teacher. Answer ONLY in Bengali simple, step-by-step, ONLY from Sources (Video Transcript + Notes + Board Questions + User Upload). If not in sources, say 'এই ভিডিওতে এইটা নেই' then explain generally. After every answer give 1 MCQ + ask 'বুঝেছো?'. If student says 'বুঝিনি', explain again with Bangladesh example (রিকশা, বাজার, ক্রিকেট). Keep max 5-6 lines."
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const videoId = params.get('video') || 'bio-ch3';
  const messagesElement = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const historyKey = `hsc-tutor-chat:${videoId}`;
  const sourcesKey = `hsc-tutor-sources:${videoId}`;
  const memory = { name: 'রাহাত', weakTopic: 'Physics Ch 4', lastScore: 72 };
  let videos = [];
  let currentVideo;
  let chatHistory = [];
  let extraSources = [];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  try {
    const response = await fetch('/videos.json');
    if (!response.ok) throw new Error(`videos.json returned ${response.status}`);
    videos = await response.json();
  } catch (error) {
    console.error('ভিডিও তথ্য লোড করা যায়নি।', error);
    if (messagesElement) messagesElement.textContent = 'ভিডিও তথ্য লোড করা যায়নি। পেজটি আবার খুলে চেষ্টা করো।';
    return;
  }
  currentVideo = videos.find(video => video.videoId === videoId) || videos[0];
  if (!currentVideo) {
    console.error('ভিডিও তালিকায় কোনো পাঠ নেই।');
    return;
  }

  const videoElement = document.getElementById('lesson-video');
  const titleElement = document.getElementById('video-title');
  const placeholder = document.getElementById('video-placeholder');
  document.title = `${currentVideo.title} | HSC Tutor`;
  titleElement.textContent = currentVideo.title;
  if (currentVideo.videoUrl) {
    videoElement.src = currentVideo.videoUrl;
    placeholder.hidden = true;
  }
  renderStudyTab('notes');

  try {
    const storedHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    if (Array.isArray(storedHistory)) chatHistory = storedHistory;
    const storedSources = JSON.parse(localStorage.getItem(sourcesKey) || '[]');
    if (Array.isArray(storedSources)) extraSources = storedSources;
  } catch (error) {
    console.error('স্থানীয় সংরক্ষিত তথ্য পড়া যায়নি।', error);
  }
  if (!chatHistory.length) {
    chatHistory = [
      { role: 'student', text: 'এইটা বুঝিনি' },
      { role: 'tutor', text: `ঠিক আছে ${memory.name}, সহজ করে বলি: ${currentVideo.notes}\\n\\nএকটা প্রশ্ন: ${currentVideo.boardQuestions[0]}\\nবুঝেছো?` }
    ];
  }
  renderHistory();
  renderSources();

  document.querySelectorAll('[data-study-tab]').forEach(button => {
    button.addEventListener('click', () => renderStudyTab(button.dataset.studyTab));
  });
  document.querySelectorAll('[data-quick]').forEach(button => {
    button.addEventListener('click', () => showQuickAnswer(button.dataset.quick));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = '';
    sendQuestion(question);
  });
  document.getElementById('speed-button').addEventListener('click', event => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const currentSpeed = Number(videoElement.playbackRate || 1);
    const nextSpeed = speeds[(speeds.indexOf(currentSpeed) + 1) % speeds.length];
    videoElement.playbackRate = nextSpeed;
    event.currentTarget.textContent = `${String(nextSpeed).replace('.25', '.২৫').replace('.5', '.৫')}× গতি`;
  });
  document.getElementById('previous-video').addEventListener('click', () => changeVideo(-1));
  document.getElementById('next-video').addEventListener('click', () => changeVideo(1));
  document.getElementById('mic-button').addEventListener('click', listenToQuestion);
  document.getElementById('photo-input').addEventListener('change', previewPhoto);
  document.getElementById('open-source-modal').addEventListener('click', openSourceModal);
  document.getElementById('connect-sources').addEventListener('click', openSourceModal);
  document.getElementById('save-notebook').addEventListener('click', saveNotebookLink);
  document.getElementById('pdf-input').addEventListener('change', savePdfSource);
  document.getElementById('save-youtube').addEventListener('click', saveYouTubeLink);
  document.querySelectorAll('[data-mobile-panel]').forEach(button => button.addEventListener('click', () => {
    document.querySelector('.study-layout').dataset.mobile = button.dataset.mobilePanel === 'video-panel' ? 'video' : 'chat';
    document.querySelectorAll('[data-mobile-panel]').forEach(tab => tab.classList.toggle('active', tab === button));
  }));
  document.querySelectorAll('[data-study-tab]').forEach(button => {
    if (!button.classList.contains('study-tab')) button.classList.add('player-tab-action');
  });

  function renderStudyTab(tab) {
    document.querySelectorAll('.study-tab').forEach(button => button.classList.toggle('active', button.dataset.studyTab === tab));
    const content = document.getElementById('study-content');
    if (tab === 'notes') {
      content.textContent = currentVideo.notes;
    } else if (tab === 'quiz') {
      content.innerHTML = `<div class="quick-mcq"><strong>${escapeHTML(currentVideo.boardQuestions[0])}</strong><button data-answer="wrong">এটি কোনো প্রশ্ন নয়</button><button data-answer="right">পাঠের ধারণা অনুযায়ী উত্তর</button><p aria-live="polite"></p></div>`;
      content.querySelectorAll('[data-answer]').forEach(option => option.addEventListener('click', () => {
        content.querySelector('p').textContent = option.dataset.answer === 'right' ? 'সঠিক! নোটে থাকা তথ্য দিয়ে উত্তরটি যাচাই করো।' : 'আবার চেষ্টা করো—পাঠের নোট দেখে নাও।';
      }));
    } else {
      content.innerHTML = `<div class="flashcard" tabindex="0" role="button">🃏 <strong>প্রশ্ন:</strong> ${escapeHTML(currentVideo.boardQuestions[0])}<p hidden><strong>উত্তর:</strong> ${escapeHTML(currentVideo.notes)}</p><small>উত্তর দেখতে চাপ দাও</small></div>`;
      const card = content.querySelector('.flashcard');
      const flip = () => { const answer = card.querySelector('p'); answer.hidden = !answer.hidden; };
      card.addEventListener('click', flip);
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') flip(); });
    }
  }

  function renderHistory() {
    messagesElement.innerHTML = chatHistory.map(message => `
      <article class="message ${message.role === 'student' ? 'student' : 'tutor'}"><p>${escapeHTML(message.text)}</p></article>
    `).join('');
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }

  function saveHistory() {
    try {
      localStorage.setItem(historyKey, JSON.stringify(chatHistory.slice(-80)));
    } catch (error) {
      console.error('কথোপকথন সংরক্ষণ করা যায়নি।', error);
    }
  }

  function appendMessage(role, text) {
    chatHistory.push({ role, text });
    renderHistory();
    saveHistory();
  }

  async function sendQuestion(question) {
    appendMessage('student', question);
    const answer = await sendToGemini(question, videoId);
    appendMessage('tutor', answer);
  }

  async function sendToGemini(question, requestedVideoId) {
    // TODO: Connect to /api/chat Cloudflare Worker with GEMINI_API_KEY, send videoId + transcript + notes + question.
    const sources = `${currentVideo.transcript} ${currentVideo.notes} ${currentVideo.boardQuestions.join(' ')}`;
    const onTopic = /কোষ|মাইটোসিস|বিভাজন|অপত্যকোষ|ক্রোমোজোম|এইটা|বুঝি|পাঠ|ভিডিও/i.test(question)
      || sources.toLocaleLowerCase('bn').includes(question.toLocaleLowerCase('bn'));
    const explanation = onTopic
      ? currentVideo.notes
      : `এই ভিডিওতে এইটা নেই। সাধারণভাবে জানতে চাইলে শিক্ষক তোমাকে উৎস দেখে বুঝিয়ে দেবেন। ${memory.name}, চাইলে ${memory.weakTopic} নিয়ে আলাদা পাঠ খুলো।`;
    const questionLine = currentVideo.boardQuestions[0] || 'আজকের পাঠের মূল ধারণাটি কী?';
    return `${memory.name}, সহজ করে ধাপে ধাপে বলি: ${explanation}\n\nএকটি MCQ: ${questionLine}\nবুঝেছো?`;
  }

  function showQuickAnswer(action) {
    if (action === 'quiz') {
      renderStudyTab('quiz');
      appendMessage('tutor', `${memory.name}, কুইজ: ${currentVideo.boardQuestions[0]} নোটের পাশে একটি উত্তর বেছে নাও।`);
      return;
    }

    const responses = {
      summary: `সারাংশ:\n• ${currentVideo.notes}\n• ${currentVideo.transcript.split('.')[0]}।\n• ${currentVideo.boardQuestions[0]}\n• দুর্বল অধ্যায়: ${memory.weakTopic}\n• গত পরীক্ষার ফল: ${memory.lastScore}%`,
      mindmap: `Mind Map:\n${currentVideo.title}\n├─ মূল ধারণা: ${currentVideo.notes.split('.')[0]}\n├─ পাঠে: ${currentVideo.transcript.split('.')[0]}\n└─ অনুশীলন: ${currentVideo.boardQuestions[0]}`,
      flashcards: 'ফ্ল্যাশকার্ড তৈরি করেছি। বাম পাশের “ফ্ল্যাশকার্ড” ট্যাবে চাপ দিয়ে কার্ড উল্টে উত্তর দেখো।',
      quiz: `কুইজ: ${currentVideo.boardQuestions[0]}\nনোটের পাশে একটি উত্তর বেছে নাও।`
    };
    if (action === 'flashcards') renderStudyTab('flashcards');
    appendMessage('tutor', `${memory.name}, ${responses[action] || responses.summary}`);
  }

  function renderSources() {
    const list = document.getElementById('source-list');
    list.innerHTML = '<li>✅ ভিডিও Transcript</li><li>✅ PDF নোট</li><li>✅ বোর্ড প্রশ্ন</li>'
      + extraSources.map(source => `<li>✅ ${escapeHTML(source.name)}</li>`).join('');
    document.getElementById('source-count').textContent = `${3 + extraSources.length}টি উৎস`;
  }

  function saveSources() {
    try {
      localStorage.setItem(sourcesKey, JSON.stringify(extraSources));
      renderSources();
    } catch (error) {
      console.error('উৎস সংরক্ষণ করা যায়নি।', error);
      document.getElementById('source-status').textContent = 'ব্রাউজারে উৎস সংরক্ষণ করা যায়নি।';
    }
  }

  function openSourceModal() {
    document.getElementById('source-modal').showModal();
  }

  function saveNotebookLink() {
    const field = document.getElementById('notebook-link');
    if (!field.value.trim()) return;
    extraSources = extraSources.filter(source => source.type !== 'notebook');
    extraSources.push({ type: 'notebook', name: 'NotebookLM সংযুক্ত ✅', value: field.value.trim() });
    saveSources();
    document.getElementById('source-status').textContent = 'NotebookLM লিংক সংযুক্ত ✅';
  }

  function savePdfSource(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      document.getElementById('source-status').textContent = 'শুধু PDF ফাইল আপলোড করো।';
      event.target.value = '';
      return;
    }
    extraSources.push({ type: 'pdf', name: `PDF: ${file.name}` });
    saveSources();
    document.getElementById('source-status').textContent = `${file.name} উৎস হিসেবে যোগ হয়েছে।`;
  }

  function saveYouTubeLink() {
    const field = document.getElementById('youtube-link');
    if (!field.value.trim()) return;
    extraSources.push({ type: 'youtube', name: 'YouTube ভিডিও লিংক', value: field.value.trim() });
    saveSources();
    document.getElementById('source-status').textContent = 'YouTube লিংক উৎস হিসেবে যোগ হয়েছে।';
  }

  function previewPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      event.target.value = '';
      return;
    }
    const preview = document.getElementById('photo-preview');
    const image = document.createElement('img');
    image.alt = `আপলোড করা ছবি: ${file.name}`;
    image.src = URL.createObjectURL(file);
    image.addEventListener('load', () => URL.revokeObjectURL(image.src), { once: true });
    preview.replaceChildren(image);
    preview.hidden = false;
  }

  function listenToQuestion() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      appendMessage('tutor', 'এই ব্রাউজারে কণ্ঠে প্রশ্ন করার সুবিধা নেই। প্রশ্নটি লিখে পাঠাও।');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'bn-BD';
    recognition.onresult = event => {
      input.value = event.results[0][0].transcript;
      input.focus();
    };
    recognition.onerror = event => console.error('কণ্ঠ শনাক্ত করা যায়নি।', event.error);
    recognition.start();
  }

  function changeVideo(direction) {
    const currentIndex = videos.findIndex(video => video.videoId === currentVideo.videoId);
    const next = videos[(currentIndex + direction + videos.length) % videos.length];
    window.location.href = `/video-player.html?video=${encodeURIComponent(next.videoId)}`;
  }
});
