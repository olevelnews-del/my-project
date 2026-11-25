import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function DashboardPage() {
  const [phone, setPhone] = useState(localStorage.getItem('hscStudentPhone') || '');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async (p: string) => {
    if (!p) return;
    setLoading(true);
    localStorage.setItem('hscStudentPhone', p);
    try {
      const res = await fetch(`http://127.0.0.1:3000/api/dashboard?phone=${p}`);
      const json = await res.json();
      if (json.ok) setData(json);
    } catch (e) {
      // Fallback demo data if node backend isn't running
      setData({
        streak: 7,
        coveragePercent: 45,
        completedVideos: 18,
        completedTests: 12,
        todayTasks: [
          { id: 1, title: 'পদার্থবিজ্ঞান: গতিবিদ্যা One-Shot Class', done: false },
          { id: 2, title: 'উচ্চতর গণিত: ম্যাট্রিক্স MCQ Test', done: false }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 w-full flex-1 py-8">
        <h1 className="text-3xl font-heading mb-6">শিক্ষার্থী ড্যাশবোর্ড</h1>

        <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 mb-8">
          <label className="block text-sm text-slate-400 mb-2">আপনার মোবাইল নম্বর দিন (Phone Number):</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              placeholder="01712345678"
              className="bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white flex-1 focus:outline-none focus:border-violet-500"
            />
            <button 
              onClick={() => fetchDashboard(phone)}
              className="bg-violet-600 hover:bg-violet-500 px-6 py-2.5 rounded-xl font-bold text-white transition"
            >
              লোড করো
            </button>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl text-center">
              <span className="text-3xl font-bold text-yellow-400 block mb-1">🔥 {data.streak} দিন</span>
              <span className="text-xs text-slate-400">স্ট্রিক (Streak)</span>
            </div>
            <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl text-center">
              <span className="text-3xl font-bold text-violet-400 block mb-1">{data.coveragePercent}%</span>
              <span className="text-xs text-slate-400">সিলেবাস কভারেজ</span>
            </div>
            <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl text-center">
              <span className="text-3xl font-bold text-green-400 block mb-1">{data.completedVideos}টি</span>
              <span className="text-xs text-slate-400">সম্পন্ন ক্লাস</span>
            </div>
          </div>
        )}

        <div className="bg-slate-800/80 border border-white/10 p-6 rounded-2xl">
          <h3 className="text-xl font-heading mb-4">আজকের ৩ টাস্ক (Today's Tasks)</h3>
          <p className="text-slate-400 text-sm mb-4">প্রতিদিন নিয়ম করে এই ৩টি টাস্ক শেষ করো এবং ড্যাশবোর্ড আপডেট রাখো।</p>
          <div className="space-y-3">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <span>১. পদার্থবিজ্ঞান: ভেক্টর - ১টি One-Shot ক্লাস ও নোট</span>
              <span className="text-yellow-400 font-bold text-xs bg-yellow-400/10 px-3 py-1 rounded-full">বাকি আছে</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <span>২. উচ্চতর গণিত: ম্যাট্রিক্স ও নির্ণায়ক MCQ টেস্ট</span>
              <span className="text-yellow-400 font-bold text-xs bg-yellow-400/10 px-3 py-1 rounded-full">বাকি আছে</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <span>৩. রসায়ন: গুণগত রসায়ন রিভিশন কিউ</span>
              <span className="text-green-400 font-bold text-xs bg-green-400/10 px-3 py-1 rounded-full">সম্পন্ন ✓</span>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
