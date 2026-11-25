import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function SyllabusPage() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 w-full flex-1 py-8">
        <h1 className="text-3xl font-heading mb-6">সম্পূর্ণ সিলেবাস কভারেজ</h1>
        <div className="bg-slate-800/80 border border-white/10 p-8 rounded-2xl">
          <h3 className="text-xl font-heading mb-4">HSC সকল বিষয় (Science, Arts, Commerce)</h3>
          <p className="text-slate-400 text-sm mb-6">প্রতিটি বিষয়ের প্রতিটি অধ্যায়ের অগ্রগতি ট্র্যাক করুন।</p>
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <span>পদার্থবিজ্ঞান ১ম ও ২য় পত্র (২০+ অধ্যায়)</span>
              <span className="text-violet-400 font-bold">45% সম্পন্ন</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <span>রসায়ন ১ম ও ২য় পত্র (২০+ অধ্যায়)</span>
              <span className="text-violet-400 font-bold">30% সম্পন্ন</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <span>উচ্চতর গণিত ১ম ও ২য় পত্র (১৬+ অধ্যায়)</span>
              <span className="text-violet-400 font-bold">60% সম্পন্ন</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
