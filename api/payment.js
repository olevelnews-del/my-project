const PRICE = 999;
const MAX_BODY_BYTES = 8192;
const MAX_UPSTREAM_BYTES = 32768;
const BKASH_TOKEN_CACHE_KEY = new Request("https://hsc-academic-hub.internal/bkash-token");

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (!isSameOrigin(request, url)) return json({ ok: false, error: "Origin is not allowed." }, 403);
    if (request.method !== "POST") return json({ ok: false, error: "POST is required." }, 405);

    let payload;
    try {
      payload = await readJson(request, MAX_BODY_BYTES);
    } catch (error) {
      return json({ ok: false, error: error.message }, 400);
    }

    try {
      if (url.pathname === "/api/payment") return await verifyAndSavePayment(payload, env);
      if (url.pathname === "/api/progress") return await handleProgress(payload, env);
      if (url.pathname === "/api/notebooklm") return await handleNotebook(payload, env);
      return json({ ok: false, error: "API route not found." }, 404);
    } catch (error) {
      console.error(JSON.stringify({
        message: "API request failed",
        route: url.pathname,
        error: error instanceof Error ? error.message : String(error)
      }));
      return json({ ok: false, error: "সার্ভার অনুরোধটি সম্পন্ন করতে পারেনি। পরে আবার চেষ্টা করো।" }, 502);
    }
  }
};

async function verifyAndSavePayment(payload, env) {
  const payment = validatePayment(payload);
  if (!payment.ok) return json({ ok: false, error: payment.error }, 400);
  if (!env.SHEET_WEBHOOK_URL) {
    console.log("[DEMO MODE] Sheet webhook not configured — returning demo payment response.");
    const record = {
      name: payment.name,
      phone: payment.phone,
      group: payment.group,
      method: payment.method,
      trxId: null,
      providerReference: payment.transaction,
      amount: PRICE,
      currency: "BDT",
      date: new Date().toISOString(),
      _demo: true
    };
    return json({ ok: true, verified: true, _mode: "demo", message: "ডেমো মোড — পেমেন্ট সাবমিট হয়েছে। প্রকৃত ভেরিফিকেশনের জন্য SHEET_WEBHOOK_URL সেট করো। WhatsApp-এ মেসেজ পাঠানো হবে: " + payment.phone, record });
  }

  let verified;
  if (payment.method === "bKash") {
    verified = await verifyBkash(payment.transaction, env);
  } else {
    verified = await verifySslCommerz(payment.transaction, env);
  }
  if (!verified) return json({ ok: false, error: "পেমেন্টটি যাচাই হয়নি। তথ্য মিলিয়ে আবার চেষ্টা করো।" }, 402);

  const record = {
    name: payment.name,
    phone: payment.phone,
    group: payment.group,
    method: payment.method,
    trxId: verified.trxId,
    providerReference: payment.transaction,
    amount: PRICE,
    currency: "BDT",
    date: new Date().toISOString()
  };
  const sheetResult = await callSheet(env, "verify-and-save-payment", record);
  if (!sheetResult?.ok) {
    return json({ ok: false, error: "পেমেন্ট যাচাই হয়েছে, কিন্তু ভর্তি তথ্য সংরক্ষণ হয়নি। WhatsApp-এ যোগাযোগ করো।" }, 503);
  }
  console.log(JSON.stringify({ message: "Verified payment saved", provider: payment.method }));
  return json({ ok: true, verified: true, trxId: verified.trxId });
}

function validatePayment(payload) {
  const name = cleanText(payload?.name, 80);
  const phone = normalizePhone(payload?.phone);
  const group = cleanText(payload?.group, 40);
  const method = payload?.method;
  const transaction = cleanText(payload?.transaction, 128);
  if (!name || !phone || !["বিজ্ঞান", "ব্যবসায়", "মানবিক"].includes(group)) {
    return { ok: false, error: "নাম, সঠিক ফোন নম্বর ও বিভাগ দাও।" };
  }
  if (!["bKash", "SSLCOMMERZ"].includes(method) || !transaction) {
    return { ok: false, error: "বৈধ payment method এবং gateway reference দাও।" };
  }
  return { ok: true, name, phone, group, method, transaction };
}

async function verifyBkash(paymentId, env) {
  const appKey = env.BKASH_APP_KEY || env.BKASH_API_KEY;
  if (!appKey || !env.BKASH_APP_SECRET || !env.BKASH_USERNAME || !env.BKASH_PASSWORD) {
    throw new Error("bKash merchant credentials are not configured.");
  }
  const baseUrl = validateBkashBase(env.BKASH_BASE_URL || "https://tokenized.sandbox.bka.sh");
  const token = await getBkashToken(baseUrl, appKey, env);
  const response = await fetch(`${baseUrl}/v2/tokenized-checkout/query/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-APP-Key": appKey,
      Authorization: token
    },
    body: JSON.stringify({ paymentId }),
    signal: AbortSignal.timeout(10000)
  });
  const result = await readUpstreamJson(response);
  if (!response.ok) throw new Error(`bKash payment query returned ${response.status}.`);
  if (
    result.transactionStatus !== "Completed"
    || Number(result.amount).toFixed(2) !== `${PRICE}.00`
    || result.currency !== "BDT"
    || !result.trxId
  ) return null;
  return { trxId: String(result.trxId) };
}

async function getBkashToken(baseUrl, appKey, env) {
  const cache = caches.default;
  const cached = await cache.match(BKASH_TOKEN_CACHE_KEY);
  if (cached) {
    const token = await cached.text();
    if (token) return token;
  }
  const response = await fetch(`${baseUrl}/v2/tokenized-checkout/auth/grant-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: env.BKASH_USERNAME,
      password: env.BKASH_PASSWORD
    },
    body: JSON.stringify({ app_key: appKey, app_secret: env.BKASH_APP_SECRET }),
    signal: AbortSignal.timeout(10000)
  });
  const result = await readUpstreamJson(response);
  if (!response.ok || !result.id_token) throw new Error("bKash authentication failed.");
  const expiry = Math.max(60, Math.min(Number(result.expires_in) - 60 || 3000, 3300));
  await cache.put(BKASH_TOKEN_CACHE_KEY, new Response(result.id_token, {
    headers: { "Cache-Control": `public, max-age=${expiry}` }
  }));
  return result.id_token;
}

function validateBkashBase(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".bka.sh")) {
    throw new Error("BKASH_BASE_URL must use an official HTTPS bka.sh hostname.");
  }
  return url.origin;
}

async function verifySslCommerz(validationId, env) {
  if (!env.SSLCOMMERZ_STORE_ID || !env.SSLCOMMERZ_STORE_PASSWORD) {
    throw new Error("SSLCOMMERZ merchant credentials are not configured.");
  }
  const sandbox = env.SSLCOMMERZ_MODE !== "live";
  const base = sandbox
    ? "https://sandbox.sslcommerz.com"
    : "https://securepay.sslcommerz.com";
  const url = new URL("/validator/api/validationserverAPI.php", base);
  url.searchParams.set("val_id", validationId);
  url.searchParams.set("store_id", env.SSLCOMMERZ_STORE_ID);
  url.searchParams.set("store_passwd", env.SSLCOMMERZ_STORE_PASSWORD);
  url.searchParams.set("format", "json");
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const result = await readUpstreamJson(response);
  if (!response.ok) throw new Error(`SSLCOMMERZ validation returned ${response.status}.`);
  if (
    !["VALID", "VALIDATED"].includes(result.status)
    || Number(result.amount).toFixed(2) !== `${PRICE}.00`
    || result.currency !== "BDT"
    || String(result.risk_level) !== "0"
    || !result.tran_id
  ) return null;
  return { trxId: String(result.tran_id) };
}

async function handleProgress(payload, env) {
  const phone = normalizePhone(payload?.studentPhone);
  if (!phone) return json({ ok: false, error: "সঠিক ফোন নম্বর দাও।" }, 400);
  if (!env.SHEET_WEBHOOK_URL) {
    console.log("[DEMO MODE] Sheet webhook not configured — returning demo progress response.");
    return json({ ok: true, _mode: "demo", records: [], message: "ডেমো মোড — প্ৰগ্রেস লোকালস্টোর-এ সংরক্ষিত হচ্ছে। প্রকৃত ক্লাউড সিঙ্কের জন্য SHEET_WEBHOOK_URL সেট করো।" });
  }
  if (payload.action === "get") {
    const result = await callSheet(env, "get-progress", { studentPhone: phone });
    if (!result?.ok || !Array.isArray(result.records)) return json({ ok: false, error: "Progress data is unavailable." }, 502);
    return json({ ok: true, records: result.records.slice(0, 500) });
  }
  const chapterId = cleanText(payload.chapterId, 80);
  if (!chapterId || typeof payload.videoWatched !== "boolean" || typeof payload.testDone !== "boolean") {
    return json({ ok: false, error: "Progress record is invalid." }, 400);
  }
  const record = {
    studentPhone: phone,
    chapterId,
    videoWatched: payload.videoWatched,
    testDone: payload.testDone,
    lastVisit: new Date().toISOString()
  };
  const result = await callSheet(env, "save-progress", record);
  if (!result?.ok) return json({ ok: false, error: "Progress could not be saved." }, 502);
  return json({ ok: true, record });
}

async function handleNotebook(payload, env) {
  const action = payload.action;
  const studentPhone = normalizePhone(payload.studentPhone);
  if (!studentPhone || !["get", "save", "delete"].includes(action)) {
    return json({ ok: false, error: "NotebookLM request is invalid." }, 400);
  }
  if (!env.SHEET_WEBHOOK_URL) return json({ ok: true, _mode: "demo", link: "", message: "ডেমো মোড — NotebookLM的云同步 নেই, শুধুমাত্র লোকালস্টোর ব্যবহার হচ্ছে।" });
  if (action === "get") {
    const result = await callSheet(env, "get-notebooklm", { studentPhone });
    if (!result?.ok || (result.link && !isNotebookLink(result.link))) {
      return json({ ok: false, error: "NotebookLM link could not be loaded." }, 502);
    }
    return json({ ok: true, link: result.link || "" });
  }
  const record = { studentPhone };
  if (action === "save") {
    if (!isNotebookLink(payload.link)) return json({ ok: false, error: "NotebookLM link is invalid." }, 400);
    record.link = payload.link;
  }
  const result = await callSheet(env, `${action}-notebooklm`, record);
  if (!result?.ok) return json({ ok: false, error: "NotebookLM link could not be saved." }, 502);
  return json({ ok: true });
}

async function callSheet(env, action, payload) {
  const endpoint = new URL(env.SHEET_WEBHOOK_URL);
  if (endpoint.protocol !== "https:") throw new Error("SHEET_WEBHOOK_URL must use HTTPS.");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
    signal: AbortSignal.timeout(10000)
  });
  const result = await readUpstreamJson(response);
  if (!response.ok) throw new Error(`Sheet webhook returned ${response.status}.`);
  return result;
}

async function readJson(request, maxBytes) {
  const length = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(length) && length > maxBytes) throw new Error("Request body is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Request body is required.");
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Request body is too large.");
    }
    chunks.push(value);
  }
  const text = new TextDecoder().decode(concat(chunks, total));
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

async function readUpstreamJson(response) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Payment provider returned an empty response.");
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_UPSTREAM_BYTES) {
      await reader.cancel();
      throw new Error("Payment provider response is too large.");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(new TextDecoder().decode(concat(chunks, total)));
  } catch {
    throw new Error("Payment provider returned invalid JSON.");
  }
}

function concat(chunks, total) {
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

function isSameOrigin(request, url) {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === url.host;
  } catch {
    return false;
  }
}

function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

function normalizePhone(value) {
  const phone = String(value || "").replace(/[^\d+]/g, "");
  return /^(?:\+?88)?01[3-9]\d{8}$/.test(phone) ? phone : "";
}

function isNotebookLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "notebooklm.google.com";
  } catch {
    return false;
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
