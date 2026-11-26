import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';

export function PersonaliserPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('full-time');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('21:30');
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);
  const [q3, setQ3] = useState(0);
  const [q4, setQ4] = useState(0);
  const [weakSub, setWeakSub] = useState('পদার্থবিজ্ঞান');
  const [learnerType, setLearnerType] = useState('');

  const calculateHours = () => {
    try {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      let diff = (eh * 60 + em) - (sh * 60 + sm);
      if (diff < 0) diff += 24 * 60;
      return (diff / 60).toFixed(1);
    } catch {
      return '3.5';
    }
  };

  const handleFinish = () => {
    // Determine learner type
    const types = [
      "Visual Learner — Video + Diagram দিয়ে পড়া উপযোগী",
      "Practice Learner — MCQ ও প্র্যাকটিস বেশি করো",
      "Writer Learner — নোট লিখে পড়া মনে রাখা ভালো"
    ];
    const selectedType = types[q1 % types.length];
    setLearnerType(selectedType);

    localStorage.setItem('hsc_personaliser', JSON.stringify({
      mode,
      startTime,
      endTime,
      hours: calculateHours(),
      weakSub,
      learnerType: selectedType
    }));

    setStep(4); // Ready state
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 w-full flex-1 py-8">
        <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h1 className="text-2xl font-heading text-white">Personaliser — তোমার Prep Personalise করো</h1>
            <span className="text-sm text-yellow-400 font-bold">Step {step} of 4</span>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-200">How do you want to start your prep? (প্রস্তুতির ধরণ নির্বাচন করো)</h3>
              <div className="space-y-3">
                <label className={`block p-4 rounded-xl border cursor-pointer transition ${mode === 'full-time' ? 'border-violet-500 bg-violet-950/40' : 'border-white/10 bg-slate-900'}`}>
                  <input type="radio" name="mode" value="full-time" checked={mode === 'full-time'} onChange={() => setMode('full-time')} className="mr-3" />
                  <span className="font-bold">A) Full-time HSC Student</span> — কলেজ + HSC-ই মেইন ফোকাস
                </label>
                <label className={`block p-4 rounded-xl border cursor-pointer transition ${mode === 'part-time' ? 'border-violet-500 bg-violet-950/40' : 'border-white/10 bg-slate-900'}`}>
                  <input type="radio" name="mode" value="part-time" checked={mode === 'part-time'} onChange={() => setMode('part-time')} className="mr-3" />
                  <span className="font-bold">B) Part-time HSC Student</span> — কলেজ + কোচিং + HSC ব্যালেন্স করছি
                </label>
                <label className={`block p-4 rounded-xl border cursor-pointer transition ${mode === 'upcoming' ? 'border-violet-500 bg-violet-950/40' : 'border-white/10 bg-slate-900'}`}>
                  <input type="radio" name="mode" value="upcoming" checked={mode === 'upcoming'} onChange={() => setMode('upcoming')} className="mr-3" />
                  <span className="font-bold">C) Upcoming HSC Student</span> — এখনই প্রস্তুতি শুরু করছি (HSC 2027)
                </label>
              </div>
              <button onClick={() => setStep(2)} className="w-full bg-yellow-400 text-slate-950 font-bold py-3 rounded-xl mt-6">পরবর্তী ধাপ</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-200">When do you usually study? (দৈনিক পড়ার সময়)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">শুরু করার সময়:</label>
                  <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">শেষ করার সময়:</label>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white" />
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl text-center border border-white/10">
                <span className="text-3xl font-bold text-yellow-400">{calculateHours()} Hrs</span>
                <p className="text-xs text-slate-400 mt-1">দৈনিক স্টাডি স্লট — এর উপর ভিত্তি করে স্মার্ট রুটিন তৈরি হবে</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="w-1/2 bg-slate-800 text-white font-bold py-3 rounded-xl">পূর্ববর্তী</button>
                <button onClick={() => setStep(3)} className="w-1/2 bg-yellow-400 text-slate-950 font-bold py-3 rounded-xl">সাইকোমেট্রি টেস্ট</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-slate-200">Psychometry Test (১ মিনিটের লার্নার প্রোফাইল টেস্ট)</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Q1: নতুন চ্যাপ্টার পড়ার সময় তুমি কী করো?</p>
                  <select value={q1} onChange={e => setQ1(Number(e.target.value))} className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-white">
                    <option value={0}>A) ভিডিও লেকচার দেখি</option>
                    <option value={1}>B) মূল বই রিডিং পড়ি</option>
                    <option value={2}>C) নিজে নোট তৈরি করি</option>
                  </select>
                </div>

                <div>
                  <p className="font-medium mb-1">Q2: তোমার সবচেয়ে দুর্বল বিষয় কোনটি?</p>
                  <select value={weakSub} onChange={e => setWeakSub(e.target.value)} className="w-full bg-slate-950 border border-white/20 rounded-xl p-2.5 text-white">
                    <option value="পদার্থবিজ্ঞান">পদার্থবিজ্ঞান</option>
                    <option value="রসায়ন">রসায়ন</option>
                    <option value="উচ্চতর গণিত">উচ্চতর গণিত</option>
                    <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
                    <option value="ইংরেজি">ইংরেজি</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(2)} className="w-1/2 bg-slate-800 text-white font-bold py-3 rounded-xl">পূর্ববর্তী</button>
                <button onClick={handleFinish} className="w-1/2 bg-yellow-400 text-slate-950 font-bold py-3 rounded-xl">প্রস্তুতি সম্পন্ন করো</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-6 py-6">
              <span className="text-5xl">✨</span>
              <h2 className="text-2xl font-heading text-white">Your Personalised Plan is Ready!</h2>
              <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 text-left space-y-3">
                <p><strong>মোড:</strong> {mode === 'full-time' ? 'Full-time HSC Student' : mode === 'part-time' ? 'Part-time HSC Student' : 'Upcoming HSC Student'}</p>
                <p><strong>দৈনিক পড়ার সময়:</strong> {calculateHours()} Hours ({startTime} - {endTime})</p>
                <p><strong>লার্নার টাইপ:</strong> <span className="text-yellow-400">{learnerType}</span></p>
                <p><strong>প্রধান দুর্বলতা:</strong> <span className="text-pink-400">{weakSub}</span></p>
              </div>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-yellow-400 text-slate-950 font-bold py-3.5 rounded-xl text-base shadow-lg">ড্যাশবোর্ড দেখো (Smart Routine Active)</button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}
