/**
 * HSC Academic Hub Common JS Bundle
 * Centralized API Integration & Helpers
 */

const HSC_HUB = {
  API_BASE_NODE: 'http://127.0.0.1:3000',
  API_BASE_PYTHON: 'http://127.0.0.1:5000',

  normalizePhone(value) {
    const digits = String(value || '').replace(/[^\d+]/g, '');
    return /^(?:\+?88)?01[3-9]\d{8}$/.test(digits) ? digits.slice(-11) : '';
  },

  escapeHTML(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  },

  getYoutubeSearchUrl(subject, chapterBangla, chapterEnglish = '') {
    const query = `HSC ${subject} ${chapterBangla} ${chapterEnglish} full class bangla`.trim();
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  },

  getPhone() {
    return localStorage.getItem('hscStudentPhone') || '';
  },

  setPhone(phone) {
    const norm = this.normalizePhone(phone);
    if (norm) localStorage.setItem('hscStudentPhone', norm);
    return norm;
  },

  async loadProgress(phone = this.getPhone()) {
    const normalized = this.normalizePhone(phone);
    let localData = [];
    try {
      localData = JSON.parse(localStorage.getItem('hscProgress') || '[]');
    } catch (e) { localData = []; }

    if (!normalized) return localData;

    try {
      const res = await fetch(`${this.API_BASE_PYTHON}/api/progress?studentPhone=${normalized}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.records)) {
        return data.records;
      }
    } catch (err) {
      console.warn('API fetch failed, falling back to offline localStorage', err);
    }
    return localData;
  },

  async saveProgress(chapterId, videoWatched = false, testDone = false) {
    const phone = this.getPhone();
    const record = {
      studentPhone: phone,
      chapterId,
      videoWatched,
      testDone,
      lastVisit: new Date().toISOString()
    };

    // Save offline localStorage
    try {
      let local = JSON.parse(localStorage.getItem('hscProgress') || '[]');
      const idx = local.findIndex(item => item.chapterId === chapterId && item.studentPhone === phone);
      if (idx >= 0) local[idx] = { ...local[idx], ...record };
      else local.push(record);
      localStorage.setItem('hscProgress', JSON.stringify(local.slice(-300)));
    } catch (e) {}

    // Async save to SQLite Python API
    if (phone) {
      try {
        await fetch(`${this.API_BASE_PYTHON}/api/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
      } catch (e) {
        console.warn('Backend sync failed, saved locally.');
      }
    }
  },

  async doCheckin() {
    const phone = this.getPhone();
    if (!phone) return { ok: false, error: 'ফোন নম্বর সেট নেই' };
    try {
      const res = await fetch(`${this.API_BASE_PYTHON}/api/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentPhone: phone })
      });
      return await res.json();
    } catch (err) {
      return { ok: true, streak: 1, offline: true };
    }
  },

  initMobileSidebar() {
    document.addEventListener('DOMContentLoaded', () => {
      const menuToggle = document.getElementById('menuToggle');
      const sidebarClose = document.getElementById('sidebarClose');
      const sidebar = document.getElementById('sidebar');

      menuToggle?.addEventListener('click', () => sidebar?.classList.add('active'));
      sidebarClose?.addEventListener('click', () => sidebar?.classList.remove('active'));
    });
  }
};

HSC_HUB.initMobileSidebar();
