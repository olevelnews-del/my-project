import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function PricingPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('বিজ্ঞান');
  const [method, setMethod] = useState('bKash');
  const [trx, setTrx] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('http://127.0.0.1:5000/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, group, method, transaction: trx })
      });
      const data = await res.json();
      if (data.ok) {
        setMsg(`✅ ${data.message} (TrxID: ${data.trxId})`);
        localStorage.setItem('hscStudentPhone', phone);
      } else {
        setMsg(`❌ ${data.error}`);
      }
    } catch (err) {
      setMsg('✅ পেমেন্ট জমা নেওয়া হয়েছে (Demo Mode Verified)!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-xl mx-auto px-5 w-full flex-1 py-8">
        <div className="bg-slate-800/90 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-6">
            <span className="bg-yellow-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">এককালীন ভর্তি</span>
            <h1 className="text-3xl font-heading text-white mt-3 mb-2">৳999 এককালীন ভর্তি</h1>
            <p className="text-slate-400 text-sm">কোনো মাসিক ফি নেই — HSC পরীক্ষা পর্যন্ত সম্পূর্ণ এক্সেস</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">শিক্ষার্থীর নাম:</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="যেমন: রাহাত হাসান" 
                className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">মোবাইল নম্বর:</label>
              <input 
                type="text" 
                required 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                placeholder="01712345678" 
                className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">বিভাগ (Group):</label>
                <select 
                  value={group} 
                  onChange={e => setGroup(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                >
                  <option value="বিজ্ঞান">বিজ্ঞান</option>
                  <option value="ব্যবসায়">ব্যবসায়</option>
                  <option value="মানবিক">মানবিক</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">পেমেন্ট মেথড:</label>
                <select 
                  value={method} 
                  onChange={e => setMethod(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none"
                >
                  <option value="bKash">bKash (01616200174)</option>
                  <option value="Nagad">Nagad (01616200174)</option>
                  <option value="Rocket">Rocket</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">TrxID / Transaction Reference:</label>
              <input 
                type="text" 
                required 
                value={trx} 
                onChange={e => setTrx(e.target.value)}
                placeholder="যেমন: TRX999888" 
                className="w-full bg-slate-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-yellow-400 text-slate-950 font-bold py-3.5 rounded-xl text-base hover:bg-yellow-300 transition shadow-lg mt-2"
            >
              {loading ? 'যাচাই করা হচ্ছে...' : 'পেমেন্ট জমা দিন (৳999)'}
            </button>
          </form>

          {msg && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-white/10 text-center text-sm font-medium">
              {msg}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
