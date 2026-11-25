import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function ScorecardPage() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 w-full flex-1 py-8">
        <h1 className="text-3xl font-heading mb-6">শিক্ষার্থী স্কোরকার্ড</h1>
        <div className="bg-slate-800/80 border border-white/10 p-8 rounded-2xl text-center mb-8">
          <span className="text-5xl font-bold text-yellow-400 block mb-2">৮৫/১০০</span>
          <p className="text-slate-400 text-sm">গড় মডেল টেস্ট স্কোর</p>
        </div>
        <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-heading mb-4">সাম্প্রতিক টেস্ট রেজাল্ট</h3>
          <div className="space-y-3">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <span>পদার্থবিজ্ঞান: গতিবিদ্যা উইকলি টেস্ট</span>
              <span className="text-green-400 font-bold">১৮/২০</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <span>উচ্চতর গণিত: ম্যাট্রিক্স মডেল টেস্ট</span>
              <span className="text-green-400 font-bold">২২/২৫</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
