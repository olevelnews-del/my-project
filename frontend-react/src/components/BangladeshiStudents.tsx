import React from 'react';
import { Link } from 'react-router-dom';

export function BangladeshiStudents() {
  return (
    <section className="relative z-10 py-24 px-5 sm:px-8 bg-slate-900/90 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-pink-500 font-semibold tracking-wider text-sm uppercase mb-3 block">HSC Study System</span>
          <h2 className="text-3xl sm:text-4xl font-heading text-white mb-4">
            বাংলাদেশের HSC শিক্ষার্থীরা প্রতিদিন যেভাবে পড়ছে
          </h2>
          <p className="text-slate-400 text-base">
            কোনো র্যান্ডম ভিডিও বা নোট নয় — নিয়মতান্ত্রিক ডেস্কে বসে প্রতিদিনের টাস্ক ও রিভিশন।
          </p>
        </div>

        {/* 3 Animated Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Card 1: Rahat */}
          <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-violet-500/50 transition duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-violet-600/30 text-violet-400 font-bold flex items-center justify-center text-lg border border-violet-500/30">
                র
              </div>
              <div>
                <h3 className="text-white font-heading text-lg">রাহাত</h3>
                <p className="text-xs text-slate-400">Dhaka • Science (পদার্থবিজ্ঞান)</p>
              </div>
              <span className="ml-auto bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">
                🔥 ১২ দিন Streak
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>সিলেবাস কভারেজ</span>
                  <span className="text-white font-semibold">৬০%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-full rounded-full w-3/5 transition-all duration-1000" />
                </div>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                <span>আজকের চেক-ইন ও টেস্ট</span>
                <span className="text-green-400 font-bold">✓ সম্পন্ন</span>
              </div>
            </div>
          </div>

          {/* Card 2: Mim */}
          <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-violet-500/50 transition duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-pink-600/30 text-pink-400 font-bold flex items-center justify-center text-lg border border-pink-500/30">
                মি
              </div>
              <div>
                <h3 className="text-white font-heading text-lg">মিম</h3>
                <p className="text-xs text-slate-400">Chattogram • Commerce</p>
              </div>
              <span className="ml-auto bg-pink-500/20 text-pink-400 text-xs px-2.5 py-1 rounded-full font-medium">
                🔖 রিভিশন কিউ
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>ভুল প্রশ্ন রিভিশন বাকি</span>
                  <span className="text-yellow-400 font-semibold">৩টি প্রশ্ন</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full rounded-full w-2/5 transition-all duration-1000" />
                </div>
              </div>

              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 flex items-center justify-between">
                <span>হিসাববিজ্ঞান চ্যাপ্টার ২</span>
                <span className="text-yellow-400 font-bold">রিভিশন চলছে</span>
              </div>
            </div>
          </div>

          {/* Card 3: Sakib */}
          <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-violet-500/50 transition duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-yellow-600/30 text-yellow-400 font-bold flex items-center justify-center text-lg border border-yellow-500/30">
                সা
              </div>
              <div>
                <h3 className="text-white font-heading text-lg">সাকিব</h3>
                <p className="text-xs text-slate-400">Sylhet • Arts (পৌরনীতি)</p>
              </div>
              <span className="ml-auto bg-violet-500/20 text-violet-400 text-xs px-2.5 py-1 rounded-full font-medium">
                🎯 স্মার্ট রুটিন
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="text-green-400 font-bold">✓</span>
                <span className="text-slate-300 line-through">পৌরনীতি ১ম পত্র ক্লাস</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-violet-500/30 flex items-center gap-2">
                <span className="text-yellow-400 font-bold animate-pulse">●</span>
                <span className="text-white font-medium">বাংলা ২য় পত্র MCQ প্র্যাকটিস</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-violet-900/40 via-slate-800 to-slate-900 border border-violet-500/30 rounded-2xl p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="text-left">
            <h3 className="text-xl font-heading text-white mb-1">৳999 একবার — একজন শিক্ষার্থীর জন্য সবকিছু</h3>
            <p className="text-slate-400 text-sm">কোনো মাসিক ফি নেই। একবার ভর্তি হয়ে HSC পর্যন্ত ফুল এক্সেস পান।</p>
          </div>
          <Link 
            to="/pricing"
            className="bg-yellow-400 text-slate-950 font-bold px-8 py-3.5 rounded-full text-sm hover:bg-yellow-300 transition shadow-lg shrink-0"
          >
            ভর্তি হও (৳999)
          </Link>
        </div>

      </div>
    </section>
  );
}
