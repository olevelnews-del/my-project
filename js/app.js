/* Add pricing.css to index.html head via JS — already statically linked */

// === Home Page JS ===
document.addEventListener('DOMContentLoaded', function() {
  if (!window.HSC_DATA) return;

  const courses = window.HSC_DATA.courses || [];
  const bundles = window.HSC_DATA.bundles || [];
  const groupNames = {
    'science': 'বিজ্ঞান',
    'business-studies': 'ব্যবসায় শিক্ষা',
    'humanities': 'মানবিক',
    'compulsory-subjects': 'সাধারণ শিক্ষা'
  };
  const thumbClasses = {
    'science': 'thumb-sci',
    'business-studies': 'thumb-bus',
    'humanities': 'thumb-hum',
    'compulsory-subjects': 'thumb-com'
  };

  // Stats
  const sc = document.getElementById('stat-courses');
  const sb = document.getElementById('stat-bundles');
  if (sc) sc.textContent = courses.length + '+';
  if (sb) sb.textContent = bundles.length;

  // Course count
  const cc = document.getElementById('course-count');
  if (cc) cc.textContent = `${courses.length} কোর্স • প্রতিটিতে ফ্রি প্রিভিউ`;

  // Featured bundles (top 6 by discount)
  const featuredBundles = bundles.sort((a,b) => b.discount_percent - a.discount_percent).slice(0, 6);
  const fbContainer = document.getElementById('featured-bundles');
  if (fbContainer && featuredBundles.length > 0) {
    fbContainer.innerHTML = featuredBundles.map(b => `
      <div class="bundle-card">
        ${b.is_featured ? '<div class="bundle-featured">⭐ জনপ্রিয় বান্ডিল</div>' : ''}
        <div class="bundle-body">
          <div class="bundle-header">
            <div class="bundle-icon">${b.icon}</div>
            <div>
              <h3>${b.name}</h3>
              <div class="desc">${b.description}</div>
            </div>
          </div>
          <div class="bundle-stats">
            <span>📚 ${b.courses?.length || 0} টি কোর্স</span>
            <span>📖 ${b.total_chapters || 0} অধ্যায়</span>
          </div>
          <div class="bundle-pricing">
            <span class="bundle-price">৳${formatPrice(b.bundle_price)}</span>
            <span class="bundle-original">৳${formatPrice(b.original_price)}</span>
            <span class="bundle-discount">${b.discount_percent}% ছাড়</span>
          </div>
          <a href="/bundles/" class="btn btn-primary">বিস্তারিত দেখুন</a>
        </div>
      </div>
    `).join('');
  }

  // Home courses grid (first 12)
  const hcContainer = document.getElementById('home-courses');
  const showMoreWrap = document.getElementById('show-more-wrap');
  const moreCount = document.getElementById('more-count');
  if (hcContainer) {
    const display = courses.slice(0, 12);
    renderCourses(hcContainer, display);
    if (courses.length > 12) {
      showMoreWrap.style.display = 'block';
      if (moreCount) moreCount.textContent = courses.length - 12;
    }
  }

  // Show more button
  window.showMoreCourses = function() {
    if (!hcContainer) return;
    hcContainer.innerHTML = '';
    renderCourses(hcContainer, courses);
    if (showMoreWrap) showMoreWrap.style.display = 'none';
  };
});

function renderCourses(container, courseList) {
  container.className = 'courses-grid';
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
  container.style.gap = '24px';

  container.innerHTML = courseList.map(c => `
    <div class="course-card fade-in">
      <div class="course-thumb ${thumbClasses[c.group] || 'thumb-sci'}">
        ${getSubjectEmoji(c.subject)}
        ${c.price === 0 || c.is_free ? '<span class="badge-free">ফ্রি পাইলট</span>' : ''}
        <span class="badge-chapters">${c.total_chapters} অধ্যায়</span>
      </div>
      <div class="course-body">
        <h3>${c.subject}</h3>
        <div class="paper">${c.paper || c.group_name || ''}</div>
        <div class="course-meta">
          <span>🎥 ${c.total_chapters} ভিডিও</span>
          <span>📝 মডেল টেস্ট</span>
        </div>
        <div class="course-footer">
          <span class="price">${c.price > 0 ? '৳' + formatPrice(c.price) : 'ফ্রি'}</span>
          <a href="/courses/" class="btn btn-primary" style="padding:8px 16px;font-size:13px;">দেখুন →</a>
        </div>
      </div>
    </div>
  `).join('');

  // Animate fade-ins
  setTimeout(() => {
    container.querySelectorAll('.fade-in').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  }, 50);
}

function getSubjectEmoji(subject) {
  const s = subject.toLowerCase();
  if (s.includes('physics') || s.includes('পদার্থ')) return '⚛️';
  if (s.includes('chemistry') || s.includes('রসায়ন')) return '🧪';
  if (s.includes('biology') || s.includes('জীববিজ্ঞান') || s.includes('বাংলা')) return '🧬';
  if (s.includes('math') || s.includes('গণিত') || s.includes('Higher Math')) return '📐';
  if (s.includes('ict') || s.includes('তথ্য')) return '💻';
  if (s.includes('english')) return '📖';
  if (s.includes('accounting') || s.includes(' হিসাব')) return '📒';
  if (s.includes('business') || s.includes('ব্যবসা')) return '💼';
  if (s.includes('economics') || s.includes('অর্থনীতি')) return '📊';
  if (s.includes('history') || s.includes('ইতিহাস')) return '🏛️';
  if (s.includes('geography') || s.includes('ভূগোল')) return '🌍';
  if (s.includes('social')) return '👥';
  if (s.includes('religion') || s.includes('ধর্ম')) return '🕌';
  return '📘';
}

function formatPrice(n) {
  if (!n) return '0';
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
