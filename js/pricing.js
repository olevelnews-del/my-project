document.addEventListener('DOMContentLoaded', () => {
  const faqList = document.getElementById('faq-list');
  if (!faqList) return;

  const faqs = [
    { q: '৯৯৯ টাকায় কি সব বিভাগ পাব?', a: 'বিজ্ঞান, ব্যবসায় ও মানবিক বিভাগের পাঠ Membership-এর অন্তর্ভুক্ত।' },
    { q: 'Dedicated Teacher কীভাবে পাব?', a: 'Membership শুরু হলে সাপ্তাহিক ১-অন-১ Video Call-এর সময়সূচি নির্ধারণ করা হবে।' },
    { q: 'টাকা কীভাবে দেব?', a: 'bKash, Nagad অথবা Rocket-এ পেমেন্ট করে TrxID-সহ ফর্ম জমা দাও।' },
    { q: 'মানি ব্যাক সুবিধা আছে?', a: 'Membership-এর প্রথম ৭ দিনের মধ্যে সহায়তার জন্য যোগাযোগ করো।' },
    { q: 'পরীক্ষা কীভাবে হবে?', a: 'প্রতি সপ্তাহে MCQ এবং প্রতি মাসে Model Test দিয়ে অগ্রগতি দেখা যাবে।' },
    { q: 'অফলাইনে পড়তে পারব?', a: 'ডাউনলোড-সুবিধা নির্ভর করবে প্রতিটি ভিডিও ও নোটের অনুমতির ওপর।' }
  ];

  faqList.innerHTML = faqs.map(({ q, a }) => `
    <details class="faq-item">
      <summary class="faq-question">${q}</summary>
      <div class="faq-answer">${a}</div>
    </details>
  `).join('');
});
