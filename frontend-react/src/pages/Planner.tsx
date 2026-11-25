import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function PlannerPage() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 w-full flex-1 py-8">
        <h1 className="text-3xl font-heading mb-6">পড়ার প্ল্যানার ও রুটিন</h1>
        <div className="bg-slate-800/80 border border-white/10 p-8 rounded-2xl mb-8">
          <h3 className="text-xl font-heading mb-3">স্মার্ট রুটিন জেনারেটর</h3>
          <p className="text-slate-400 text-sm mb-6">আপনার দুর্বলতা এবং পরীক্ষার সময়ের উপর ভিত্তি করে প্রতিদিন স্বয়ংক্রিয়ভাবে রুটিন তৈরি হয়।</p>
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <strong className="block text-white text-base">সকাল শিফট: পদার্থবিজ্ঞান (গতিবিদ্যা)</strong>
                <small className="text-slate-400">কনসেপ্ট রিভিশন + ১০টি প্রবলেম সলভ</small>
              </div>
              <span className="text-yellow-400 font-bold text-xs bg-yellow-400/10 px-3 py-1 rounded-full">চলছে</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <strong className="block text-white text-base">বিকাল শিফট: রসায়ন (মৌলের পর্যায়বৃত্ত ধর্ম)</strong>
                <small className="text-slate-400">অনুশীলনী MCQ ও সৃজনশীল</small>
              </div>
              <span className="text-slate-400 text-xs bg-slate-800 px-3 py-1 rounded-full">বাকি</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
