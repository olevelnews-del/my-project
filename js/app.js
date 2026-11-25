document.addEventListener('DOMContentLoaded', () => {
  const courses = window.HSC_DATA?.courses || [];
  const grid = document.getElementById('courses-grid');
  const search = document.getElementById('course-search');
  const tabs = [...document.querySelectorAll('.filter-tab')];
  const groupLabels = {
    science: 'বিজ্ঞান',
    business_studies: 'ব্যবসায়',
    humanities: 'মানবিক',
    compulsory_subjects: 'সাধারণ বিষয়'
  };
  const subjectLabels = {
    ACCOUNTING: 'হিসাববিজ্ঞান',
    BANGLA: 'বাংলা',
    BIOLOGY: 'জীববিজ্ঞান',
    BUSINESS_ORGANIZATION_MANAGEMENT: 'ব্যবসায় সংগঠন ও ব্যবস্থাপনা',
    CHEMISTRY: 'রসায়ন',
    CIVICS: 'পৌরনীতি ও সুশাসন',
    ECONOMICS: 'অর্থনীতি',
    ENGLISH: 'ইংরেজি',
    FINANCE_BANKING_INSURANCE: 'ফিন্যান্স, ব্যাংকিং ও বিমা',
    GEOGRAPHY: 'ভূগোল',
    HIGHER_MATHEMATICS: 'উচ্চতর গণিত',
    HISTORY: 'ইতিহাস',
    ICT: 'তথ্য ও যোগাযোগ প্রযুক্তি',
    LOGIC: 'যুক্তিবিদ্যা',
    PHYSICS: 'পদার্থবিজ্ঞান'
  };
  const emojis = {
    ACCOUNTING: '🧾', BANGLA: '📖', BIOLOGY: '🧬',
    BUSINESS_ORGANIZATION_MANAGEMENT: '🧑‍💼', CHEMISTRY: '⚗️',
    CIVICS: '⚖️', ECONOMICS: '📊', ENGLISH: '📘',
    FINANCE_BANKING_INSURANCE: '💰', GEOGRAPHY: '🌍',
    HIGHER_MATHEMATICS: '➗', HISTORY: '🏛️', ICT: '💻',
    LOGIC: '🧠', PHYSICS: '⚡'
  };
  const sampleVideos = {
    BIOLOGY: 'bio-ch3',
    PHYSICS: 'phy-ch4',
    CHEMISTRY: 'chem-ch2',
    HIGHER_MATHEMATICS: 'math-ch1',
    ACCOUNTING: 'acct-ch1'
  };
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function renderCourses() {
    if (!grid) return;
    const activeGroup = tabs.find(tab => tab.classList.contains('active'))?.dataset.group || 'all';
    const query = search?.value.trim().toLocaleLowerCase('bn') || '';
    const matching = courses.filter(course => {
      const subject = subjectLabels[course.subject] || course.subject;
      const searchable = `${subject} ${course.subject} ${course.paper} ${groupLabels[course.group] || ''}`;
      return (activeGroup === 'all' || course.group === activeGroup)
        && (!query || searchable.toLocaleLowerCase('bn').includes(query));
    });

    grid.innerHTML = matching.length ? matching.map(course => {
        const subject = subjectLabels[course.subject] || course.subject;
        const englishSubject = course.subject === 'BUSINESS_ORGANIZATION_MANAGEMENT'
          ? 'Business Organization & Management'
          : course.subject.replaceAll('_', ' ');
        const paper = course.paper === '1St Paper' ? '১ম পত্র' : '২য় পত্র';
      return `
        <article class="card relative reveal">
          <div class="top-strip" style="background:#7C3AED"></div>
          <div class="p-5">
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl" aria-hidden="true">${emojis[course.subject] || '📘'}</span>
              <div><h3 class="font-semibold"><a href="/courses/${encodeURIComponent(course.slug)}.html">${escapeHTML(subject)}</a></h3><p class="text-xs text-gray-500">${escapeHTML(englishSubject)}</p><p class="text-sm text-gray-500">${paper}</p></div>
            </div>
            <p class="text-sm mb-4">${escapeHTML(groupLabels[course.group] || 'সাধারণ বিষয়')} · ${course.total_chapters} অধ্যায়</p>
            <p class="included-label mb-4">✅ 999 এ Included</p>
            <div class="grid grid-cols-2 gap-2">
              <a href="/video-player.html?video=${sampleVideos[course.subject] || 'bio-ch3'}" class="btn-outline inline-flex justify-center rounded-full px-3 py-2">Watch ▶</a>
              <a href="/bundles/#payment" class="btn-primary inline-flex justify-center rounded-full px-3 py-2">ভর্তি হও →</a>
            </div>
          </div>
        </article>`;
    }).join('') : '<p class="col-span-full text-center text-gray-600">এই নামে কোনো কোর্স পাওয়া যায়নি।</p>';
    observeReveals();
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    renderCourses();
  }));
  search?.addEventListener('input', renderCourses);
  renderCourses();

  document.querySelectorAll('.mcq-option').forEach(option => {
    option.addEventListener('click', () => {
      const result = option.parentElement?.querySelector('.mcq-result');
      if (!result) return;
      const correct = option.dataset.correct === 'true';
      result.textContent = correct ? 'সঠিক উত্তর! আলোর বেগ প্রায় ৩ × ১০⁸ মিটার/সেকেন্ড।' : 'উত্তরটি সঠিক নয়। আবার চেষ্টা করুন।';
      result.style.color = correct ? '#15803d' : '#b91c1c';
    });
  });

  const paymentForm = document.getElementById('payment-form');
  paymentForm?.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(paymentForm);
    const details = [
      `নাম: ${values.get('name')}`,
      `ফোন: ${values.get('phone')}`,
      `বিভাগ: ${values.get('group')}`,
      `পেমেন্ট মাধ্যম: ${values.get('method')}`,
      `লেনদেন নম্বর: ${values.get('transaction')}`
    ].join('\n');
    const subject = encodeURIComponent('Personal Tutor Membership-এর তথ্য');
    const body = encodeURIComponent(`HSC Tutor Membership — 999 টাকা / মাস\n\n${details}`);
    const status = document.getElementById('payment-status');
    if (status) status.textContent = 'আপনার ইমেইল অ্যাপে তথ্যসহ খসড়া খুলবে। ইমেইল পাঠালেই ভর্তি অনুরোধ যাবে।';
    window.location.href = `mailto:support@hsplatform.edu.bd?subject=${subject}&body=${body}`;
  });

  function observeReveals() {
    const hidden = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      hidden.forEach(element => element.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    hidden.forEach(element => observer.observe(element));
  }
  observeReveals();

  const countdowns = document.querySelectorAll('[data-countdown]');
  if (countdowns.length) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date()).reduce((result, part) => {
      if (part.type !== 'literal') result[part.type] = Number(part.value);
      return result;
    }, {});
    const endOfDay = Date.UTC(parts.year, parts.month - 1, parts.day, 18);
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.floor((endOfDay - Date.now()) / 1000));
      const time = [Math.floor(remaining / 3600), Math.floor((remaining % 3600) / 60), remaining % 60]
        .map(value => String(value).padStart(2, '0')).join(':');
      countdowns.forEach(element => { element.textContent = time; });
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  document.querySelectorAll('a[href*="#payment"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = new URL(link.href, window.location.href);
      if (target.pathname === window.location.pathname && document.querySelector('#payment')) {
        event.preventDefault();
        launchConfetti();
        document.querySelector('#payment').scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', '#payment');
      } else {
        launchConfetti();
      }
    });
  });

  function launchConfetti() {
    const colors = ['#7C3AED', '#EC4899', '#F97316', '#FACC15'];
    for (let index = 0; index < 28; index += 1) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = colors[index % colors.length];
      piece.style.setProperty('--drift', `${Math.random() * 150 - 75}px`);
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 1300);
    }
  }
});
