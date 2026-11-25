import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function ChapterPage() {
  const [subject, setSubject] = useState('পদার্থবিজ্ঞান');
  const [chapter, setChapter] = useState('ভেক্টর');

  const getYoutubeSearchUrl = (subj: string, chap: string) => {
    const query = `HSC ${subj} ${chap} full class bangla`;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 w-full flex-1 py-8">
        <h1 className="text-3xl font-heading mb-6">চ্যাপ্টার লার্নিং ও টিউটোরিয়াল</h1>

        <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <input 
            type="text" 
            value={subject} 
            onChange={e => setSubject(e.target.value)}
            placeholder="বিষয় (যেমন: পদার্থবিজ্ঞান)" 
            className="bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white flex-1 w-full"
          />
          <input 
            type="text" 
            value={chapter} 
            onChange={e => setChapter(e.target.value)}
            placeholder="অধ্যায় (যেমন: ভেক্টর)" 
            className="bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white flex-1 w-full"
          />
          <a 
            href={getYoutubeSearchUrl(subject, chapter)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl transition w-full sm:w-auto text-center"
          >
            ▶ Watch Tutorial
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-heading mb-3">অধ্যায় নোট (Expert Notes)</h3>
            <p className="text-slate-400 text-sm mb-4">আমাদের অভিজ্ঞ শিক্ষকদের তৈরি সংক্ষিপ্ত ও নিখুঁত রিভিশন নোট।</p>
            <span className="text-violet-400 font-bold text-xs bg-violet-500/10 px-3 py-1 rounded-full">নোট প্রস্তুত হচ্ছে</span>
          </div>

          <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-xl font-heading mb-3">MCQ & Test</h3>
            <p className="text-slate-400 text-sm mb-4">এই অধ্যায়ের উপর নিজের প্রস্তুতি যাচাই করতে টেস্ট দিন।</p>
            <span className="text-yellow-400 font-bold text-xs bg-yellow-500/10 px-3 py-1 rounded-full">Coming Soon</span>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
