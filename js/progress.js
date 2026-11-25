const initializeProgress = () => {
  const storageKey = "hscProgress";
  const phoneInput = document.getElementById("progress-phone");
  const dashboardPhone = document.getElementById("dashboard-phone");
  const dashboardLoad = document.getElementById("dashboard-load");
  const dashboardList = document.getElementById("dashboard-progress");
  const dashboardStatus = document.getElementById("dashboard-status");
  const chapterId = new URLSearchParams(location.search).get("video")
    || document.querySelector("[data-notebooklm-section]")?.dataset.chapterId
    || "";
  const localPhone = localStorage.getItem("hscStudentPhone") || "";
  if (phoneInput && localPhone) phoneInput.value = localPhone;
  if (dashboardPhone && localPhone) dashboardPhone.value = localPhone;

  const watchedButton = document.querySelector("[data-mark-video]");
  const testButton = document.querySelector("[data-mark-test]");
  if (watchedButton) watchedButton.addEventListener("click", () => updateChapter("videoWatched"));
  if (testButton) testButton.addEventListener("click", () => updateChapter("testDone"));
  dashboardLoad?.addEventListener("click", loadDashboard);
  if (chapterId && normalizePhone(phoneInput?.value || localStorage.getItem("hscStudentPhone") || "")) {
    updateChapter("lastVisit");
  }

  async function updateChapter(field) {
    const phone = normalizePhone(phoneInput?.value || localStorage.getItem("hscStudentPhone") || "");
    const status = document.querySelector("[data-progress-message]");
    if (!phone) {
      if (status) status.textContent = "Progress রাখতে আগে ফোন নম্বর দাও।";
      return;
    }
    localStorage.setItem("hscStudentPhone", phone);
    if (!chapterId) {
      if (status) status.textContent = "অধ্যায়ের পরিচয় পাওয়া যায়নি।";
      return;
    }
    const records = readRecords();
    const existing = records.find(record => record.studentPhone === phone && record.chapterId === chapterId);
    const record = {
      studentPhone: phone,
      chapterId,
      videoWatched: field === "videoWatched" ? true : Boolean(existing?.videoWatched),
      testDone: field === "testDone" ? true : Boolean(existing?.testDone),
      lastVisit: new Date().toISOString()
    };
    saveLocalRecord(records, record);
    if (status) status.textContent = "Demo - Connect Firebase to enable progress saving.";
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || `HTTP ${response.status}`);
      if (status) status.textContent = "Progress cloud-এ সংরক্ষিত হয়েছে ✅";
    } catch (error) {
      console.error("Progress cloud sync failed.", error);
    }
  }

  async function loadDashboard() {
    const phone = normalizePhone(dashboardPhone?.value || "");
    if (!phone) {
      if (dashboardStatus) dashboardStatus.textContent = "সঠিক ফোন নম্বর দাও।";
      return;
    }
    localStorage.setItem("hscStudentPhone", phone);
    let records = readRecords().filter(record => record.studentPhone === phone);
    if (dashboardStatus) dashboardStatus.textContent = "Demo - Connect Firebase to enable progress saving.";
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", studentPhone: phone })
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true || !Array.isArray(result.records)) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }
      records = result.records;
      if (dashboardStatus) dashboardStatus.textContent = "Cloud progress loaded.";
    } catch (error) {
      console.error("Cloud progress could not be loaded; showing local demo data.", error);
    }
    renderDashboard(records);
  }

  function renderDashboard(records) {
    if (!dashboardList) return;
    dashboardList.innerHTML = records.length
      ? records.map(record => `<article class="workspace-source-card">
          <h3>${escapeHTML(record.chapterId)}</h3>
          <p>ভিডিও: ${record.videoWatched ? "দেখা হয়েছে ✅" : "বাকি"} · পরীক্ষা: ${record.testDone ? "সম্পন্ন ✅" : "বাকি"}</p>
          <small>শেষ দেখা: ${escapeHTML(record.lastVisit || "তথ্য নেই")}</small>
        </article>`).join("")
      : '<p class="empty-card">এই নম্বরে কোনো অধ্যায়ের অগ্রগতি নেই।';
  }

  function readRecords() {
    try {
      const records = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(records) ? records.filter(isProgressRecord) : [];
    } catch (error) {
      console.error("Local progress data could not be read.", error);
      return [];
    }
  }

  function saveLocalRecord(records, record) {
    const index = records.findIndex(item =>
      item.studentPhone === record.studentPhone && item.chapterId === record.chapterId
    );
    if (index >= 0) records[index] = record;
    else records.push(record);
    try {
      localStorage.setItem(storageKey, JSON.stringify(records.slice(-500)));
    } catch (error) {
      console.error("Local progress data could not be saved.", error);
      const status = document.querySelector("[data-progress-message]");
      if (status) status.textContent = "এই ব্রাউজারে progress সংরক্ষণ করা যায়নি।";
    }
  }

  function isProgressRecord(record) {
    return record && typeof record.studentPhone === "string"
      && typeof record.chapterId === "string"
      && typeof record.videoWatched === "boolean"
      && typeof record.testDone === "boolean"
      && typeof record.lastVisit === "string";
  }

  function normalizePhone(value) {
    const phone = String(value || "").replace(/[^\d+]/g, "");
    return /^(?:\+?88)?01[3-9]\d{8}$/.test(phone) ? phone : "";
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeProgress);
} else {
  initializeProgress();
}
