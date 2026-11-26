import React, { useState } from 'react';

export function HubbyGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <button 
          onClick={() => setOpen(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 transition transform hover:scale-105"
        >
          <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-lg">হ</div>
          <span className="font-medium text-sm pr-2 hidden sm:inline">Hubby Guide</span>
        </button>
      ) : (
        <div className="bg-slate-900 border border-white/20 w-80 sm:w-96 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-violet-950 p-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xl">হ</div>
              <div>
                <h4 className="font-heading font-bold text-white text-sm">Hubby — Your Prep Partner</h4>
                <span className="text-[10px] text-slate-400">Rule-based Guide (No AI)</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-lg">✕</button>
          </div>

          <div className="p-4 bg-slate-900/90 text-xs text-slate-300 border-b border-white/10">
            Hi, I'm Hubby. I guide you through practice, clarify doubts, generate flashcards, create mock tests, and keep your preparation on track.
          </div>

          <div className="p-4 space-y-2.5 bg-slate-950">
            <a href="/chapter" className="block w-full bg-slate-900 hover:bg-slate-800 border border-white/10 p-2.5 rounded-xl text-xs font-medium text-left transition flex items-center justify-between">
              <span>🎯 Practice করো (অধ্যায়ভিত্তিক)</span>
              <span>→</span>
            </a>
            <a href="https://wa.me/8801616200174?text=Doubt:%20আমার%20একটি%20প্রশ্ন%20ছিল" target="_blank" rel="noreferrer" className="block w-full bg-slate-900 hover:bg-slate-800 border border-white/10 p-2.5 rounded-xl text-xs font-medium text-left transition flex items-center justify-between">
              <span>❓ Doubt আছে? (WhatsApp 01616200174)</span>
              <span>💬</span>
            </a>
            <a href="/flashcards" className="block w-full bg-slate-900 hover:bg-slate-800 border border-white/10 p-2.5 rounded-xl text-xs font-medium text-left transition flex items-center justify-between">
              <span>🃏 Flashcard বানাও / রিভিশন</span>
              <span>→</span>
            </a>
            <a href="/mock-test" className="block w-full bg-slate-900 hover:bg-slate-800 border border-white/10 p-2.5 rounded-xl text-xs font-medium text-left transition flex items-center justify-between">
              <span>📝 Mock Test দাও (PYQs সহ)</span>
              <span>→</span>
            </a>
            <a href="/scorecard" className="block w-full bg-slate-900 hover:bg-slate-800 border border-white/10 p-2.5 rounded-xl text-xs font-medium text-left transition flex items-center justify-between">
              <span>📊 আজকের Progress দেখো</span>
              <span>→</span>
            </a>
          </div>

          <div className="p-3 bg-slate-900 border-t border-white/10 text-center text-[11px] text-slate-400">
            HSC Academic Hub • hsctutorbd.com • ৳999 একবার
          </div>
        </div>
      )}
    </div>
  );
}
