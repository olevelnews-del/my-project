(function() {
  'use strict';

  // ========== CONFIG ==========
  const CONFIG = window.HSCTUTOR_CONFIG || {};
  const BRAND = CONFIG.BRAND_NAME || 'HSC Academic Hub';
  const WHATSAPP = CONFIG.SUPPORT_WHATSAPP || '8801616200174';
  const PRICE_LABEL = CONFIG.PRICE_LABEL || '৳999 একবার';

  // ========== SUBJECT MAPS ==========
  const SUBJECT_MAP = {
    physics: { label: 'পদার্থবিজ্ঞান', key: 'PHYSICS' },
    chemistry: { label: 'রসায়ন', key: 'CHEMISTRY' },
    biology: { label: 'জীববিজ্ঞান', key: 'BIOLOGY' },
    math: { label: 'গণিত', key: 'HIGHER_MATHEMATICS' },
    bangla: { label: 'বাংলা', key: 'BANGLA' },
    english: { label: 'ইংরেজি', key: 'ENGLISH' }
  };

  // ========== STORAGE HELPERS ==========
  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem('hscDashboardProgress') || '{}');
    } catch { return {}; }
  }
  function saveProgress(data) {
    localStorage.setItem('hscDashboardProgress', JSON.stringify(data));
  }

  // ========== DATE HELPERS ==========
  const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  function toBengaliNum(n) {
    return String(n).split('').map(d => bengaliDigits[parseInt(d)] || d).join('');
  }
  const bnMonths = ['জানুয়াৰি','ফেব্রুঅরি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  const bnDays = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];

  // ========== INIT ==========
  function init() {
    setupDateDisplay();
    setupCountdown();
    setupNavigation();
    setupTabSwitching();
    setupMobileMenu();
    loadDashboardData();
  }

  // ========== DATE DISPLAY ==========
  function setupDateDisplay() {
    const el = document.getElementById('today-date');
    if (!el) return;
    const now = new Date();
    el.textContent = `${bnDays[now.getDay()]}, ${toBengaliNum(now.getDate())} ${bnMonths[now.getMonth()]} ${toBengaliNum(now.getFullYear())}`;
  }

  // ========== COUNTDOWN ==========
  function setupCountdown() {
    const el = document.getElementById('hsc-countdown');
    if (!el) return;
    const hscDate = new Date('2027-03-01T00:00:00');
    const diff = Math.ceil((hscDate - new Date()) / 86400000);
    el.textContent = toBengaliNum(diff) + ' দিন';
  }

  // ========== MOBILE MENU ==========
  function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (!toggle || !sidebar) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('mobile-open') &&
          !sidebar.contains(e.target) &&
          !e.target.classList.contains('mobile-menu-toggle')) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // ========== NAV ACTIVE STATE ==========
  function setupNavigation() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href') || item.getAttribute('data-href') || '';
      item.classList.remove('active');
      if (href && currentPath.includes(href.replace('/', ''))) {
        item.classList.add('active');
      }
    });
  }

  // ========== TAB SWITCHING ==========
  function setupTabSwitching() {
    document.querySelectorAll('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        btn.closest('.tabs-nav').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tc => {
          tc.style.display = tc.dataset.tab === category ? 'block' : 'none';
        });
      });
    });

    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        btn.closest('.tabs-nav').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  // ========== LOAD DASHBOARD DATA ==========
  async function loadDashboardData() {
    const progress = getProgress();
    const totalTests = progress.totalTests || 0;
    const avgAccuracy = progress.avgAccuracy || 0;

    const accuracyEl = document.querySelector('.overall-accuracy');
    if (accuracyEl && totalTests > 0) {
      accuracyEl.textContent = toBengaliNum(Math.round(avgAccuracy)) + '%';
    }

    if (window.location.pathname.includes('test.html') || window.location.pathname.endsWith('/test')) {
      await loadTestQuestions();
    }
  }

  // ========== TEST PAGE LOGIC ==========
  let testQuestions = [];
  let currentIndex = 0;
  let score = { correct: 0, wrong: 0 };
  let testStartTime = null;
  let questionsLoaded = false;

  async function loadTestQuestions() {
    if (document.getElementById('results-area')?.style.display === 'block') return;

    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject');

    try {
      const resp = await fetch('/data/questions.json');
      if (!resp.ok) throw new Error('Failed to load');
      const data = await resp.json();
      let questions = Array.isArray(data) ? data : (data.questions || []);

      if (subjectParam && SUBJECT_MAP[subjectParam]) {
        const subjLabel = SUBJECT_MAP[subjectParam].label;
        const subjKey = SUBJECT_MAP[subjectParam].key;
        questions = questions.filter(q => q.subject === subjKey || q.subject === subjLabel);
      }

      if (questions.length === 0) {
        document.getElementById('question-area').innerHTML =
          '<div class="empty-state" style="padding:60px 20px;"><p>এই বিষয়ে এখনো প্রশ্ন নেই। পরে আবার চেষ্টা করো।</p></div>';
        return;
      }

      testQuestions = shuffleArray(questions).slice(0, 10);
      currentIndex = 0;
      score = { correct: 0, wrong: 0 };
      testStartTime = Date.now();
      questionsLoaded = true;

      renderQuestion();
    } catch (err) {
      console.error('Question load error:', err);
      const qa = document.getElementById('question-area');
      if (qa) qa.innerHTML =
        '<div class="empty-state" style="padding:60px 20px;"><p>প্রশ্ন লোড হচ্ছে না। নেটওয়ার্ক চেক করো।</p></div>';
    }
  }

  function renderQuestion() {
    if (!questionsLoaded || currentIndex >= testQuestions.length) {
      showResults();
      return;
    }

    const q = testQuestions[currentIndex];
    const questionText = document.getElementById('question-text');
    const optionsList = document.getElementById('options-list');
    const explanationArea = document.getElementById('explanation-area');
    const nextBtn = document.getElementById('next-btn');

    if (!questionText) return;

    const metaBadges = document.querySelectorAll('.meta-badge');
    if (metaBadges[0]) metaBadges[0].textContent = q.subject || 'সাধারণ';
    if (metaBadges[1]) metaBadges[1].textContent = 'অধ্যায় ' + (q.chapter || '?');
    if (metaBadges[2] && q.difficulty) metaBadges[2].textContent = q.difficulty;

    const qNumEl = document.querySelector('#question-area .question-card p');
    if (qNumEl) qNumEl.textContent = `প্রশ্ন ${toBengaliNum(currentIndex + 1)} of ${toBengaliNum(testQuestions.length)}`;

    questionText.textContent = q.question;

    const options = q.options || [];
    optionsList.innerHTML = '';
    const letters = ['ক', 'খ', 'গ', 'ঘ'];
    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${escapeHtml(opt)}</span>`;
      btn.addEventListener('click', () => selectAnswer(i, q.correct, q.explanation));
      optionsList.appendChild(btn);
    });

    if (explanationArea) explanationArea.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  function selectAnswer(selected, correct, explanation) {
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, i) => {
      btn.disabled = true;
      if (i === correct) btn.classList.add('correct');
      if (i === selected && selected !== correct) btn.classList.add('wrong');
    });

    if (selected === correct) {
      score.correct++;
    } else {
      score.wrong++;
    }

    const explanationArea = document.getElementById('explanation-area');
    const explanationText = document.getElementById('explanation-text');
    if (explanationArea) explanationArea.style.display = 'block';
    if (explanationText && explanation) explanationText.textContent = explanation;

    if (selected !== correct) {
      bookmarkQuestion(testQuestions[currentIndex]);
    }

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.textContent = currentIndex < testQuestions.length - 1 ? 'পরবর্তী প্রশ্ন →' : 'ফলাফল দেখো →';
      nextBtn.onclick = () => {
        currentIndex++;
        renderQuestion();
      };
    }
  }

  function showResults() {
    const questionArea = document.getElementById('question-area');
    const resultsArea = document.getElementById('results-area');

    if (questionArea) questionArea.style.display = 'none';
    if (resultsArea) resultsArea.style.display = 'block';

    const total = score.correct + score.wrong;
    const accuracy = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const elapsed = Math.floor((Date.now() - testStartTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;

    const accEl = document.getElementById('result-accuracy');
    if (accEl) accEl.textContent = toBengaliNum(accuracy) + '%';

    const totalEl = document.getElementById('result-total');
    if (totalEl) totalEl.textContent = toBengaliNum(total);

    const correctEl = document.getElementById('result-correct');
    if (correctEl) correctEl.textContent = toBengaliNum(score.correct);

    const wrongEl = document.getElementById('result-wrong');
    if (wrongEl) wrongEl.textContent = toBengaliNum(score.wrong);

    const timeEl = document.getElementById('result-time');
    if (timeEl) timeEl.textContent = toBengaliNum(mins) + ':' + String(secs).padStart(2, '0');

    saveProgressResult(accuracy, total);
  }

  function saveProgressResult(accuracy, totalQuestions) {
    const progress = getProgress();
    progress.totalTests = (progress.totalTests || 0) + 1;
    progress.totalQuestions = (progress.totalQuestions || 0) + totalQuestions;
    progress.totalCorrect = (progress.totalCorrect || 0) + Math.round(totalQuestions * accuracy / 100);
    if (progress.totalQuestions > 0) {
      progress.avgAccuracy = Math.round((progress.totalCorrect / progress.totalQuestions) * 100);
    }
    progress.lastTestDate = new Date().toISOString();
    saveProgress(progress);
  }

  function bookmarkQuestion(question) {
    const bookmarks = JSON.parse(localStorage.getItem('hscBookmarks') || '[]');
    if (!bookmarks.find(b => b.id === question.id)) {
      bookmarks.push({
        id: question.id,
        question: question.question,
        subject: question.subject,
        chapter: question.chapter,
        bookmarkedAt: new Date().toISOString()
      });
      localStorage.setItem('hscBookmarks', JSON.stringify(bookmarks));
    }
  }

  // ========== UTILITIES ==========
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ========== BOOTSTRAP ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
