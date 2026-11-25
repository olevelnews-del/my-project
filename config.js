const BRAND_NAME = "HSC Academic Hub";
const DOMAIN = "hsctutorbd.com";
const SUPPORT_PHONE = "01616200174";
const SUPPORT_WHATSAPP = "8801616200174";
const PRICE = 999;
const PRICE_TYPE = "one-time";
const PRICE_FOR = "one student - all access";
const PRICE_LABEL = "৳999 একবার - একজন শিক্ষার্থীর জন্য সবকিছু";
const WHATSAPP_LINK = "https://wa.me/8801616200174?text=" + encodeURIComponent("আসসালামু আলাইকুম, আমি HSC Academic Hub 999 টাকায় (একজন শিক্ষার্থীর জন্য সবকিছু) ভর্তি হতে চাই");
const FACEBOOK_LINK = "https://facebook.com/hsctutorbd";

window.HSCTUTOR_CONFIG = {
  BRAND_NAME,
  DOMAIN,
  SUPPORT_PHONE,
  SUPPORT_WHATSAPP,
  PRICE,
  PRICE_TYPE,
  PRICE_FOR,
  PRICE_LABEL,
  WHATSAPP_LINK,
  FACEBOOK_LINK,
  whatsappLinkWithDetails(details) {
    const greeting = new URL(WHATSAPP_LINK).searchParams.get("text") || "";
    const message = details ? `${greeting}\n\n${details}` : greeting;
    return `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`;
  }
};

window.HSC_PROGRESS_CONFIG = {
  FIREBASE_CONFIG: null,
  SHEET_WEBHOOK_URL: ""
};

window.HSC_LINKS_READY = fetch("/links.json", { cache: "no-store" }).then((response) => {
  if (!response.ok) throw new Error(`links.json returned ${response.status}`);
  return response.json();
}).then((links) => {
  window.HSC_LINKS = links;
  return links;
}).catch((error) => {
  console.error("links.json লোড করা যায়নি।", error);
  document.querySelectorAll("[data-links-status]").forEach((element) => {
    element.textContent = "কনটেন্ট লিংক লোড করা যায়নি। পরে আবার চেষ্টা করো।";
  });
  return null;
});

document.addEventListener("DOMContentLoaded", () => {
  document.title = `${BRAND_NAME} | ৳${PRICE} একবার - একজন শিক্ষার্থীর জন্য সবকিছু`;
  document.querySelectorAll("[data-brand]").forEach((element) => {
    element.textContent = BRAND_NAME;
  });
  document.querySelectorAll("[data-domain]").forEach((element) => {
    element.textContent = DOMAIN;
    element.href = `https://${DOMAIN}`;
  });
  document.querySelectorAll("[data-support-phone]").forEach((element) => {
    element.textContent = SUPPORT_PHONE;
  });
  document.querySelectorAll("[data-price-label]").forEach((element) => {
    element.textContent = PRICE_LABEL;
  });
  document.querySelectorAll("[data-whatsapp]").forEach((element) => {
    element.href = WHATSAPP_LINK;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  });
  document.querySelectorAll("[data-facebook]").forEach((element) => {
    element.href = FACEBOOK_LINK;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  });

  const courseContent = document.querySelector(".course-detail-main");
  if (!courseContent) return;
  const slug = window.location.pathname.split("/").pop().replace(/\.html$/, "");
  const chapterId = courseChapterIds[slug] || slug;
  const title = document.querySelector(".page-hero h1")?.textContent.trim() || "HSC Chapter";
  const watchLink = courseContent.querySelector('a[href*="video-player.html"]');
  if (watchLink) {
    watchLink.href = `/video-player.html?video=${encodeURIComponent(chapterId)}`;
  }
  const preview = document.querySelector(".preview-embed iframe");
  if (preview) {
    window.HSC_LINKS_READY.then((links) => {
      const videoUrl = links?.videos?.[chapterId];
      if (videoUrl && isYouTubeEmbed(videoUrl)) {
        preview.src = videoUrl;
      } else {
        preview.removeAttribute("src");
        preview.replaceWith(Object.assign(document.createElement("p"), {
          className: "media-empty",
          textContent: "ভিডিও আসছে - YouTube link links.json এ যোগ করো"
        }));
      }
    });
  }
  const courseSidebar = document.querySelector(".course-sidebar");
  if (courseSidebar) {
    courseSidebar.innerHTML = `<div class="sidebar-card">
      <div class="included-label">✅ ৳999 একবারে সব অন্তর্ভুক্ত</div>
      <p>একজন শিক্ষার্থীর জন্য সব বিষয় ও সব গ্রুপ, HSC পরীক্ষা পর্যন্ত।</p>
      <a href="/pricing.html#package" class="btn btn-primary" style="display:block;text-align:center;margin:12px 0;background:#FFC800;color:#111827">ভর্তি হও →</a>
      <a href="/video-player.html?video=${encodeURIComponent(chapterId)}" class="btn btn-outline" style="display:block;text-align:center">পাঠ দেখো ▶</a>
    </div>
    <div class="sidebar-card"><h4>এই Membership-এ</h4>
      <p>YouTube ভিডিও · Google Drive Notes · অধ্যায়ের প্রশ্ন · নিজের NotebookLM · বাহ্যিক পরীক্ষা</p>
    </div>`;
  }
  const footerDescription = document.querySelector(".footer-brand > p");
  if (footerDescription) {
    footerDescription.textContent = "HSC পরীক্ষার্থীদের জন্য অধ্যায়ভিত্তিক ভিডিও, নোট, প্রশ্ন ও বাহ্যিক পরীক্ষার লিংক।";
  }
  const topics = [...courseContent.querySelectorAll(".chapters-list .ch-name")]
    .map((item) => item.textContent.trim());
  const section = document.createElement("section");
  section.className = "notebooklm-section course-notebooklm";
  section.dataset.notebooklmSection = "";
  section.dataset.chapterId = chapterId;
  section.dataset.courseTitle = title;
  section.dataset.topics = JSON.stringify(topics);
  section.innerHTML = `<h2>Connect Your NotebookLM - One Time</h2>
    <p>একবার Connect করলেই সব Subject এ কাজ করবে - আলাদা করে Connect করতে হবে না। NotebookLM নতুন ট্যাবে খুলবে - Google iframe block করে।</p>
    <button class="notebooklm-button notebooklm-button-primary" type="button" data-open-notebooklm>🔗 Connect Your NotebookLM</button>
    <button class="notebooklm-button notebooklm-button-white" type="button" data-download-chapter>📥 Download Chapter Sources for NotebookLM</button>
    <div data-connection-card aria-live="polite"></div>
    <p data-notebooklm-error role="status"></p>`;
  courseContent.append(section);

  if (!document.getElementById("notebooklm-modal")) {
    const modal = document.createElement("dialog");
    modal.id = "notebooklm-modal";
    modal.className = "notebooklm-modal";
    modal.innerHTML = `<button class="modal-close" type="button" data-close-notebooklm aria-label="বন্ধ করো">×</button>
      <h2>Connect Your NotebookLM - One Time</h2>
      <section class="modal-step"><h3>ধাপ ১: NotebookLM খোলো</h3>
        <button class="notebooklm-button notebooklm-button-primary" type="button" data-open-notebooklm-site>🔗 Connect Your NotebookLM</button>
      </section>
      <section class="modal-step"><h3>ধাপ ২: তোমার NotebookLM share link দাও</h3>
        <label class="modal-field">তোমার ফোন নম্বর (অন্য ডিভাইসে link পেতে)<input id="notebooklm-phone" class="notebooklm-input" type="tel" inputmode="tel" placeholder="তোমার ফোন নম্বর" autocomplete="tel" /></label>
        <label class="modal-field">Paste Your NotebookLM Share Link<input id="notebooklm-link" class="notebooklm-input" type="url" placeholder="Paste Your NotebookLM Share Link" autocomplete="url" /></label>
        <button class="notebooklm-button notebooklm-button-primary" type="button" data-save-notebooklm>Save Once</button>
      </section>
      <p class="modal-note">একবার Connect করলেই সব Subject এ কাজ করবে - আলাদা করে Connect করতে হবে না। NotebookLM নতুন ট্যাবে খুলবে - Google iframe block করে।</p>
      <p id="notebooklm-modal-status" role="status" aria-live="polite"></p>`;
    document.body.append(modal);
  }

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "/css/video-player.css";
  document.head.append(stylesheet);
  const script = document.createElement("script");
  script.src = "/js/notebooklm.js";
  document.body.append(script);
});

const courseChapterIds = {
  "accounting-1st-paper": "acct-ch1",
  "accounting-2nd-paper": "acct-ch1",
  "bangla-2nd-paper": "bangla-2nd",
  "biology-1st-paper": "bio-ch3",
  "biology-2nd-paper": "bio-ch3",
  "chemistry-1st-paper": "chem-ch2",
  "chemistry-2nd-paper": "chemistry-ch3",
  "physics-1st-paper": "phy-ch4",
  "physics-2nd-paper": "physics-ch2"
};

function isYouTubeEmbed(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "www.youtube.com" && url.pathname.startsWith("/embed/");
  } catch {
    return false;
  }
}
