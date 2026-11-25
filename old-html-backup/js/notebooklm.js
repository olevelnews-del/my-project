const initializeStudyPage = async () => {
  const query = new URLSearchParams(window.location.search);
  const section = document.querySelector("[data-notebooklm-section]");
  const requestedChapterId = query.get("video") || query.get("chapter") || section?.dataset.chapterId || "";
  const picker = document.getElementById("notebooklm-chapter-picker");
  const modal = document.getElementById("notebooklm-modal");
  const linkInput = document.getElementById("notebooklm-link");
  const phoneInput = document.getElementById("notebooklm-phone");
  const status = document.getElementById("notebooklm-modal-status");
  let links;
  let chapters = [];
  let questions = [];

  try {
    links = await (window.HSC_LINKS_READY || fetch("/links.json").then(response => {
      if (!response.ok) throw new Error(`links.json returned ${response.status}`);
      return response.json();
    }));
    if (!links || typeof links !== "object" || !links.videos || !links.notes || !links.tests) {
      throw new Error("links.json has an invalid shape");
    }
    const [chapterResponse, questionResponse] = await Promise.all([
      fetch("/data/academic.json"),
      fetch("/data/questions.json")
    ]);
    if (!chapterResponse.ok) throw new Error(`academic.json returned ${chapterResponse.status}`);
    if (!questionResponse.ok) throw new Error(`questions.json returned ${questionResponse.status}`);
    chapters = await chapterResponse.json();
    questions = await questionResponse.json();
    if (!Array.isArray(chapters) || !Array.isArray(questions)) {
      throw new Error("Chapter or question data has an invalid shape");
    }
  } catch (error) {
    console.error("অধ্যায়ের লিংক বা উপকরণ লোড করা যায়নি।", error);
    document.querySelectorAll("[data-links-status], [data-notebooklm-error]").forEach((element) => {
      element.textContent = "অধ্যায়ের উপকরণ লোড করা যায়নি। পরে আবার চেষ্টা করো।";
    });
    return;
  }

  const courseTitle = section?.dataset.courseTitle || "";
  let currentChapter = chapters.find(chapter => chapter.chapterId === requestedChapterId);
  if (!currentChapter && requestedChapterId) {
    let topics = [];
    try {
      topics = JSON.parse(section?.dataset.topics || "[]");
    } catch (error) {
      console.error("অধ্যায়ের বিষয় তালিকা পড়া যায়নি।", error);
    }
    currentChapter = {
      chapterId: requestedChapterId,
      course: courseTitle,
      chapter: courseTitle,
      title: courseTitle ? `${courseTitle} — অধ্যায়` : requestedChapterId,
      topics,
      notes: "",
      formulas: [],
      transcript: "",
      boardQuestions: []
    };
  }
  currentChapter ||= chapters[0];
  if (!currentChapter) return;

  if (picker) {
    picker.innerHTML = chapters.map(chapter =>
      `<option value="${escapeHTML(chapter.chapterId)}">${escapeHTML(chapter.title)}</option>`
    ).join("");
    if (chapters.some(chapter => chapter.chapterId === requestedChapterId)) {
      picker.value = requestedChapterId;
    }
    picker.addEventListener("change", () => renderWorkspaceSources(selectedChapter()));
  }

  if (document.getElementById("lesson-video")) renderChapter(selectedChapter());
  if (picker) renderWorkspaceSources(selectedChapter());
  renderNotebookCard();
  bindNotebookControls();
  bindMobileTabs();

  const oldPhone = localStorage.getItem("hscStudentPhone") || "";
  if (phoneInput && oldPhone) phoneInput.value = oldPhone;

  function selectedChapter() {
    const id = picker?.value || requestedChapterId;
    return chapters.find(chapter => chapter.chapterId === id)
      || (id === currentChapter.chapterId ? currentChapter : currentChapter);
  }

  function renderChapter(chapter) {
    const chapterId = chapter.chapterId;
    const videoUrl = validYouTubeLink(links.videos?.[chapterId]) ? links.videos[chapterId] : "";
    const notesUrl = validDriveLink(links.notes?.[chapterId]) ? links.notes[chapterId] : "";
    const video = document.getElementById("lesson-video");
    const videoEmpty = document.getElementById("video-empty");
    const videoTitle = document.getElementById("video-title");
    if (videoTitle) {
      const englishTitle = {
        "physics-ch2": "Physics Chapter 2",
        "chemistry-ch3": "Chemistry Chapter 3"
      }[chapterId];
      videoTitle.textContent = `${englishTitle || chapter.title || `${chapter.course} ${chapter.chapter}`} - এক পেজে সবকিছু`;
    }
    if (section) section.dataset.chapterId = chapterId;

    if (video && videoUrl) {
      video.src = videoUrl;
      video.hidden = false;
      if (videoEmpty) videoEmpty.hidden = true;
    } else {
      if (video) {
        video.removeAttribute("src");
        video.hidden = true;
      }
      if (videoEmpty) {
        videoEmpty.hidden = false;
        videoEmpty.textContent = "ভিডিও আসছে - YouTube link links.json এ যোগ করো";
      }
    }

    const notesFrame = document.getElementById("chapter-notes-frame");
    const driveFrame = document.getElementById("drive-frame");
    const notesEmpty = document.getElementById("notes-empty");
    const openDrive = document.getElementById("open-drive");
    if (notesFrame && driveFrame && notesUrl) {
      notesFrame.src = notesUrl;
      driveFrame.hidden = false;
      if (notesEmpty) notesEmpty.hidden = true;
      if (openDrive) {
        openDrive.href = notesUrl.replace(/\/preview(?:\?.*)?$/, "/view");
        openDrive.hidden = false;
      }
    } else {
      if (notesFrame) notesFrame.removeAttribute("src");
      if (driveFrame) driveFrame.hidden = true;
      if (notesEmpty) notesEmpty.hidden = false;
      if (openDrive) openDrive.hidden = true;
    }
    const notesText = document.getElementById("notes-text");
    if (notesText) notesText.textContent = chapter.notes || "";
    renderQuestions(chapter);
    renderExternalTest(chapterId);
    renderNotebookCard();
    document.dispatchEvent(new CustomEvent("hsc:chapter-change", { detail: { chapterId } }));
  }

  function renderQuestions(chapter) {
    const container = document.getElementById("practice-questions");
    const empty = document.getElementById("question-empty");
    if (!container) return;
    const chapterQuestions = questions.filter(question => question.chapter === chapter.chapterId);
    container.innerHTML = chapterQuestions.map(question => `
      <article class="practice-question">
        <p><strong>${escapeHTML(question.question)}</strong></p>
        <ul>${question.options.map((option, index) => `<li>${["ক", "খ", "গ", "ঘ"][index]}. ${escapeHTML(option)}</li>`).join("")}</ul>
        <details><summary>উত্তর ও ব্যাখ্যা দেখো</summary><p>${escapeHTML(question.options[question.correct])} — ${escapeHTML(question.explanation)}</p></details>
        <small>${escapeHTML(question.subject)} · ${escapeHTML(question.paper)} · ${escapeHTML(question.board)} ${escapeHTML(String(question.year))} · ${escapeHTML(question.difficulty)}</small>
      </article>
    `).join("");
    if (empty) empty.hidden = chapterQuestions.length > 0;
  }

  function renderExternalTest(chapterId) {
    const link = links.tests?.[chapterId];
    const test = document.getElementById("external-test");
    const empty = document.getElementById("test-empty");
    const valid = validTestLink(link);
    if (test) {
      test.hidden = !valid;
      if (valid) test.href = link;
    }
    if (empty) empty.hidden = valid;
  }

  function renderWorkspaceSources(chapter) {
    const container = document.querySelector("[data-workspace-sources]");
    if (!container) return;
    const videoUrl = validYouTubeLink(links.videos?.[chapter.chapterId]) ? links.videos[chapter.chapterId] : "";
    const notesUrl = validDriveLink(links.notes?.[chapter.chapterId]) ? links.notes[chapter.chapterId] : "";
    container.innerHTML = `<article class="workspace-source-card">
      <h3>${escapeHTML(chapter.title)}</h3>
      <p><strong>Notes:</strong> ${escapeHTML(chapter.notes || "Drive নোট এখনো যোগ করা হয়নি।")}</p>
      <p><strong>ভিডিও:</strong> ${videoUrl ? `<a href="${escapeHTML(videoUrl)}" target="_blank" rel="noopener noreferrer">YouTube-এ দেখো ↗</a>` : "ভিডিও আসছে - links.json এ যোগ করো"}</p>
      <p><strong>Drive Notes:</strong> ${notesUrl ? `<a href="${escapeHTML(notesUrl.replace(/\/preview(?:\?.*)?$/, "/view"))}" target="_blank" rel="noopener noreferrer">Google Drive-এ খোলো ↗</a>` : "Drive নোট আসছে - links.json এ যোগ করো"}</p>
      <a class="notebooklm-button notebooklm-button-white" href="/video-player.html?video=${encodeURIComponent(chapter.chapterId)}">এক পেজে অধ্যায় খোলো →</a>
      <button class="notebooklm-button notebooklm-button-white" type="button" data-download-workspace="${escapeHTML(chapter.chapterId)}">Sources Download</button>
    </article>`;
    container.querySelector("[data-download-workspace]")?.addEventListener("click", () => downloadChapter(chapter));
  }

  function bindNotebookControls() {
    document.querySelectorAll("[data-open-notebooklm]").forEach(button => {
      button.addEventListener("click", () => {
        if (phoneInput) phoneInput.value = localStorage.getItem("hscStudentPhone") || "";
        if (linkInput) linkInput.value = localStorage.getItem("notebooklmLink") || "";
        status && (status.textContent = "");
        modal?.showModal();
      });
    });
    document.querySelectorAll("[data-open-notebooklm-site]").forEach(button => {
      button.addEventListener("click", () => window.open("https://notebooklm.google.com", "_blank", "noopener,noreferrer"));
    });
    document.querySelectorAll("[data-save-notebooklm]").forEach(button => {
      button.addEventListener("click", saveNotebook);
    });
    document.querySelectorAll("[data-close-notebooklm]").forEach(button => {
      button.addEventListener("click", () => modal?.close());
    });
    document.querySelector("[data-download-chapter]")?.addEventListener("click", () => downloadChapter(selectedChapter()));
    phoneInput?.addEventListener("change", loadNotebookFromCloud);
  }

  function bindMobileTabs() {
    document.querySelectorAll("[data-mobile-tab]").forEach(button => {
      button.addEventListener("click", () => {
        const selected = button.dataset.mobileTab;
        document.querySelectorAll("[data-mobile-tab]").forEach(tab => {
          tab.classList.toggle("active", tab === button);
        });
        document.querySelectorAll("[data-chapter-panel]").forEach(panel => {
          panel.classList.toggle("mobile-active", panel.dataset.chapterPanel === selected);
        });
      });
    });
  }

  async function loadNotebookFromCloud() {
    const phone = normalizePhone(phoneInput?.value || "");
    if (!phone || !linkInput || linkInput.value.trim()) return;
    try {
      const response = await fetch("/api/notebooklm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", studentPhone: phone })
      });
      if (!response.ok) return;
      const result = await response.json();
      if (validNotebookLink(result.link)) {
        linkInput.value = result.link;
        status && (status.textContent = "তোমার আগের NotebookLM link পাওয়া গেছে।");
      }
    } catch (error) {
      console.error("NotebookLM cloud link লোড করা যায়নি।", error);
    }
  }

  async function saveNotebook() {
    const link = linkInput?.value.trim() || "";
    const phone = normalizePhone(phoneInput?.value || "");
    if (!validNotebookLink(link)) {
      if (status) status.textContent = "শুধু notebooklm.google.com-এর HTTPS share link দাও।";
      return;
    }
    localStorage.setItem("notebooklmLink", link);
    if (phone) localStorage.setItem("hscStudentPhone", phone);
    renderNotebookCard();
    if (!phone) {
      if (status) status.textContent = "NotebookLM link এই ডিভাইসে সংরক্ষিত হয়েছে। অন্য ডিভাইসে পেতে ফোন নম্বর দাও।";
      modal?.close();
      return;
    }
    if (status) status.textContent = "NotebookLM link সংরক্ষণ করা হচ্ছে…";
    try {
      const response = await fetch("/api/notebooklm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", studentPhone: phone, link })
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(result.error || `HTTP ${response.status}`);
      if (status) status.textContent = "NotebookLM link cloud-এ সংরক্ষিত হয়েছে ✅";
      modal?.close();
    } catch (error) {
      console.error("NotebookLM cloud link সংরক্ষণ করা যায়নি।", error);
      if (status) status.textContent = "Link এই ডিভাইসে সংরক্ষিত হয়েছে; cloud sync চালু নেই। Worker ও Sheet webhook configure করো।";
    }
  }

  function renderNotebookCard() {
    const card = document.querySelector("[data-connection-card]");
    if (!card) return;
    const link = localStorage.getItem("notebooklmLink");
    card.innerHTML = link && validNotebookLink(link)
      ? `<div class="connected-card"><h3>✅ Your NotebookLM Connected</h3>
          <a class="notebooklm-button notebooklm-button-white" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">Open My NotebookLM ↗</a>
          <button type="button" class="notebooklm-button notebooklm-button-white" data-change-link>Change Link</button>
          <button type="button" class="notebooklm-button notebooklm-button-danger" data-disconnect-link>Disconnect</button>
          <p>একবার Connect করলেই সব Subject এ কাজ করবে - আলাদা করে Connect করতে হবে না।</p>
          <p>NotebookLM নতুন ট্যাবে খুলবে - Google iframe block করে।</p>
        </div>`
      : '<div class="empty-card"><strong>Not Connected Yet</strong> - Connect করো</div>';
    card.querySelector("[data-change-link]")?.addEventListener("click", () => modal?.showModal());
    card.querySelector("[data-disconnect-link]")?.addEventListener("click", () => {
      localStorage.removeItem("notebooklmLink");
      renderNotebookCard();
    });
    const list = document.querySelector("[data-connected-notebooks]");
    if (list) {
      list.innerHTML = link && validNotebookLink(link)
        ? `<article class="workspace-source-card"><h3>✅ Your NotebookLM Connected</h3><a class="notebooklm-button notebooklm-button-white" href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">Open My NotebookLM ↗</a></article>`
        : '<p class="empty-card">Not Connected Yet - Connect করো।';
    }
  }

  function downloadChapter(chapter) {
    const relevantQuestions = questions.filter(question => question.chapter === chapter.chapterId);
    const content = [
      "এই file টা NotebookLM এ Source হিসেবে Upload করো",
      "",
      `Chapter Title: ${chapter.title}`,
      `Topics:\n${(chapter.topics || []).map(topic => `- ${topic}`).join("\n")}`,
      `Notes:\n${chapter.notes || "এই অধ্যায়ের লিখিত নোট links.json-এর Google Drive link থেকে দেখো।"}`,
      `Formulas:\n${(chapter.formulas || []).join("\n") || "এই অধ্যায়ে সূত্র দেওয়া নেই।"}`,
      `Practice Questions:\n${relevantQuestions.map(question =>
        `- ${question.question}\n  Options: ${question.options.join(" | ")}\n  Correct: ${question.options[question.correct]}\n  Explanation: ${question.explanation}`
      ).join("\n") || "এই অধ্যায়ের প্রশ্ন এখনো যোগ করা হয়নি।"}`,
      `Video Link:\n${validYouTubeLink(links.videos?.[chapter.chapterId]) ? links.videos[chapter.chapterId] : "ভিডিও আসছে।"}`,
      `Drive Notes:\n${validDriveLink(links.notes?.[chapter.chapterId]) ? links.notes[chapter.chapterId] : "Drive notes আসছে।"}`
    ].join("\n\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${chapter.chapterId}-Sources-for-NotebookLM.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function validYouTubeLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "www.youtube.com" && url.pathname.startsWith("/embed/");
    } catch {
      return false;
    }
  }

  function validDriveLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "drive.google.com" && /^\/file\/d\/[^/]+\/preview$/.test(url.pathname);
    } catch {
      return false;
    }
  }

  function validTestLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && (
        url.hostname === "quizizz.com" || url.hostname === "www.quizizz.com"
        || url.hostname === "forms.gle" || url.hostname === "docs.google.com"
      );
    } catch {
      return false;
    }
  }

  function validNotebookLink(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && url.hostname === "notebooklm.google.com";
    } catch {
      return false;
    }
  }

  function normalizePhone(value) {
    const phone = String(value).replace(/[^\d+]/g, "");
    return /^(?:\+?88)?01[3-9]\d{8}$/.test(phone) ? phone : "";
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeStudyPage);
} else {
  initializeStudyPage();
}
