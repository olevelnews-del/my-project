// === Pricing Page JS ===
document.addEventListener('DOMContentLoaded', function() {
  // Populate subject price table from site data
  const tbody = document.getElementById('subject-prices');
  if (!tbody || !window.HSC_DATA) return;

  const courses = window.HSC_DATA.courses || [];
  const groupNames = {
    'science': 'বিজ্ঞান',
    'business-studies': 'ব্যবসা শিক্ষা',
    'humanities': 'মানবিক',
    'compulsory-subjects': 'সাধারণ শিক্ষা'
  };
  const groupColors = {
    'science': '#3b82f6',
    'business-studies': '#8b5cf6',
    'humanities': '#f97316',
    'compulsory-subjects': '#ef4444'
  };

  let rows = '';
  courses.sort((a,b) => a.group.localeCompare(b.group)).forEach(c => {
    const gname = groupNames[c.group] || c.group;
    const color = groupColors[c.group] || '#94a3b8';
    rows += `<tr>
      <td><strong>${c.subject}</strong></td>
      <td><span style="color:${color};font-weight:600">${gname}</span></td>
      <td>${c.total_chapters}</td>
      <td class="price-cell">৳ ৪৯৯</td>
    </tr>`;
  });
  tbody.innerHTML = rows;

  // FAQ Data
  const faqs = [
    { q: 'কোর্স কেনার পর কতদিন এক্সেস পাবো?', a: 'সম্পূর্ণ প্ল্যাক্টফর্ম বান্ডিল কিনলে লাইফটাইম এক্সেস পাবেন। এছাড়াও প্রতিটি কোর্সের পরীক্ষা শেষে আরও ৬ মাস রিভিশন এক্সেস বিনামূল্যে পাওয়া যাবে।' },
    { q: 'অফলিন মোডে কি ভিডিও ডাউনলোড করা যাবে?', a: 'হ্যাঁ! সম্পূর্ণ প্ল্যাক্টফর্ম ও কম্বো প্যাকেজে সব কোর্স অফলিন মোডে ডাউনলোড করে যেকোনো সময় দেখতে পারবেন — ইন্টারনেট ছাড়াই।' },
    { q: 'WhatsApp সাপোর্টে কে উত্তর দেবে?', a: 'প্রতিটি বিষয়ের বিষয় বিশেষজ্ঞ শিক্ষকগণ WhatsApp-এ প্রশ্নের উত্তর দেবেন। সাধারণত ৩০ মিনিটের মধ্যে উত্তর পাওয়ার নিশ্চয়তা দিচ্ছি।' },
    { q: '৭ দিনের মানি ব্যাক গ্যারান্টা কীভাবে কাজ করে?', a: 'কোর্স কিনে ৭ দিনের মধ্যে যদি সন্তুষ্ট না হন তবে কোনো প্রশ্ন ছাড়াই পুরো টাকা ফেরৎ পাবেন। আমাদের support@hsplatform.edu.bd ঠিকানায় ইমেইল করুন।' },
    { q: 'ভর্তি প্রস্তুতি কোর্স আলাদা কিনতে হবে?', a: 'না! HSC + ভর্তি কম্বো প্যাকেজে (৳৩,৯৯৯) দুটোই পাচ্ছেন — HSC কোর্স এবং বিশ্ববিদ্যালয় ভর্তির মৌলিক প্রস্তুতি। আলাদা করলে ১২,০০০+ টাকা লাগত।' },
    { q: 'কলেজ পড়ার সাথে সাথে কোর্স সম্ভব?', a: 'অবশ্যই! রেকর্ডেড ক্লাস আপনার সুবিধামতো সময় দেখতে পারবেন। প্রতিটি অধ্যায় ১৫-২০ মিনিটের সংক্ষেপে বাস্তবসম্মত, যা কলেজের পাঠক্রমের সাথে সামঞ্জস্য রেখে তৈরি।' },
    { q: 'কিস্তিতে টাকার ব্যবস্থা আছে?', a: 'বর্তমানে আমরা bKash / Nagad দিয়ে পুরো টাকা এককালীন পরিশোধের সুবিধা দিচ্ছি। কিস্তি ব্যবস্থার পরিকল্পনা চলছে, শীঘ্রই জানানো হবে।' }
  ];

  const faqList = document.getElementById('faq-list');
  if (faqList) {
    faqList.innerHTML = faqs.map(f => `
      <div class="faq-item">
        <div class="faq-question">${f.q}</div>
        <div class="faq-answer">${f.a}</div>
      </div>
    `).join('');

    faqList.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
    });
  }
});
