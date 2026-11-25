import React from 'react';

export function Footer() {
  return (
    <footer className="relative z-10 bg-slate-950 border-t border-white/10 py-12 px-5 sm:px-8 text-center text-slate-400 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-heading text-white text-base mb-1">HSC Academic Hub (hsctutorbd.com)</p>
          <p className="text-xs text-slate-500">© 2026 ৳999 এককালীন ভর্তি। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
        <div className="flex items-center gap-6 text-xs font-medium">
          <a href="https://wa.me/8801616200174?text=HSC%20Hub" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
            💬 WhatsApp: 01616200174
          </a>
        </div>
      </div>
    </footer>
  );
}
