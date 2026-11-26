import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function MockTestPage() {
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      question: "মাইটোসিসের কোন ধাপে ক্রোমোজোম বিষুবীয় অঞ্চলে সারিবদ্ধ হয়?",
      options: ["প্রোফেজ", "মেটাফেজ", "অ্যানাফেজ", "টেলোফেজ"],
      correct: 1,
      explanation: "মেটাফেজে ক্রোমোজোমগুলো কোষের বিষুবীয় অঞ্চলে সারিবদ্ধ হয়।"
    },
    {
      id: "q2",
      question: "ধ্রুব ভরের ক্ষেত্রে নিউটনের দ্বিতীয় সূত্রের গাণিতিক রূপ কোনটি?",
      options: ["F = ma", "F = m/a", "F = a/m", "F = m + a"],
      correct: 0,
      explanation: "বল বস্তুর ভর ও ত্বরণের গুণফলের সমান: F = ma।"
    },
    {
      id: "q3",
      question: "আধুনিক পর্যায় সূত্রে মৌলগুলো কোন ক্রমে সাজানো হয়?",
      options: ["পারমাণবিক সংখ্যা", "পারমাণবিক ভর", "ঘনত্ব", "গলনাঙ্ক"],
      correct: 0,
      explanation: "আধুনিক পর্যায় সূত্র পারমাণবিক সংখ্যার ওপর ভিত্তি করে।"
    },
    {
      id: "q4",
      question: "৩টি সারি ও ২টি স্তম্ভবিশিষ্ট ম্যাট্রিক্সের ক্রম কত?",
      options: ["২ × ৩", "৩ × ২", "৩ + ২", "৬ × ১"],
      correct: 1,
      explanation: "ম্যাট্রিক্সের ক্রম = সারির সংখ্যা × স্তম্ভের সংখ্যা।"
    },
    {
      id: "q5",
      question: "বাংলা 'অপরিচিতা' গল্পের কল্যাণীর মামার আসল স্বভাব কেমন ছিল?",
      options: ["সহৃদয়", "গহনা প্রেমিক ও কড়া मिজাজ", "শিক্ষানুরাগী", "উদার"],
      correct: 1,
      explanation: "কল্যাণীর মামা শম্ভুনাথ সেনের বিপরীতে কড়া মেজাজের ছিলেন।"
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min

  useEffect(() => {
    if (testStarted && !submitted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted) {
      setSubmitted(true);
    }
  }, [testStarted, submitted, timeLeft]);

  const handleSelect = (optionIdx: number) => {
    const updated = [...selectedAnswers];
    updated[currentIndex] = optionIdx;
    setSelectedAnswers(updated);
  };

  const score = questions.reduce((acc, q, idx) => acc + (selectedAnswers[idx] === q.correct ? 1 : 0), 0);
  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 w-full flex-1 py-8">
        
        {!testStarted ? (
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl text-center space-y-6">
            <h1 className="text-3xl font-heading">Mock Test + Board PYQs</h1>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              ১০টি গুরুত্বপূর্ণ MCQ প্রশ্ন, ১০ মিনিট সময়। কোনো নেতিবাচক মার্কিং নেই। টেস্ট শেষে ডিটেইলড ইভালুয়েশন ও রিভিশন কিউ আপডেট হবে।
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div onClick={() => setTestStarted(true)} className="bg-slate-950 p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-violet-500 transition">
                <span className="text-xs text-yellow-400 font-bold block mb-1">মডেল টেস্ট</span>
                <h3 className="text-lg font-bold">HSC Science & Bangla Comprehensive</h3>
                <p className="text-xs text-slate-400 mt-2">৫টি প্রশ্ন • ১০ মিনিট • ঢাকা বোর্ড স্ট্যান্ডার্ড</p>
              </div>
              <div onClick={() => setTestStarted(true)} className="bg-slate-950 p-6 rounded-2xl border border-white/10 cursor-pointer hover:border-violet-500 transition">
                <span className="text-xs text-yellow-400 font-bold block mb-1">বোর্ড প্রশ্ন (PYQ)</span>
                <h3 className="text-lg font-bold">Dhaka Board 2024 Physics & Math</h3>
                <p className="text-xs text-slate-400 mt-2">৫টি প্রশ্ন • ১০ মিনিট • প্রিভিয়াস ইয়ার প্রশ্ন</p>
              </div>
            </div>
          </div>
        ) : !submitted ? (
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-sm font-medium text-slate-400">প্রশ্ন {currentIndex + 1} / {questions.length}</span>
              <span className="text-sm font-bold text-yellow-400">সময় বাকি: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>

            <h3 className="text-xl font-heading text-white">{questions[currentIndex].question}</h3>

            <div className="space-y-3">
              {questions[currentIndex].options.map((opt, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${selectedAnswers[currentIndex] === idx ? 'bg-violet-950/60 border-violet-500 text-white' : 'bg-slate-950 border-white/10 text-slate-300 hover:border-white/30'}`}
                >
                  <span className="font-bold mr-2">{['ক', 'খ', 'গ', 'ঘ'][idx]})</span> {opt}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button 
                disabled={currentIndex === 0} 
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-xl disabled:opacity-50"
              >
                পূর্ববর্তী
              </button>
              {currentIndex < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="bg-yellow-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl"
                >
                  পরবর্তী
                </button>
              ) : (
                <button 
                  onClick={() => setSubmitted(true)}
                  className="bg-green-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl"
                >
                  টেস্ট জমা দিন
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 text-center">
            <span className="text-5xl">📊</span>
            <h1 className="text-3xl font-heading">Evaluation & Scorecard</h1>
            
            <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-3xl font-bold text-yellow-400">{score} / {questions.length}</span>
                <p className="text-xs text-slate-400 mt-1">প্রাপ্ত স্কোর</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-green-400">{accuracy}%</span>
                <p className="text-xs text-slate-400 mt-1">সঠিকতার হার</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-violet-400">Top 20%</span>
                <p className="text-xs text-slate-400 mt-1">মেধা তালিকায় অবস্থান</p>
              </div>
            </div>

            <div className="text-left space-y-4">
              <h3 className="text-lg font-heading">উত্তর বিশ্লেষণ ও ব্যাখ্যা:</h3>
              {questions.map((q, idx) => {
                const isCorrect = selectedAnswers[idx] === q.correct;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-950/20 border-green-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
                    <p className="font-medium text-sm mb-1">{idx + 1}. {q.question}</p>
                    <p className="text-xs text-slate-400 mb-1">আপনার উত্তর: {selectedAnswers[idx] !== undefined ? q.options[selectedAnswers[idx]] : 'উত্তর দেননি'} ({isCorrect ? '✅ সঠিক' : '❌ ভুল'})</p>
                    <p className="text-xs text-slate-300"><strong>সঠিক ব্যাখ্যা:</strong> {q.explanation}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 pt-4">
              <a href="/dashboard" className="w-1/2 bg-slate-800 text-white font-bold py-3 rounded-xl block">ড্যাশবোর্ডে ফিরে যান</a>
              <a href="/flashcards" className="w-1/2 bg-yellow-400 text-slate-950 font-bold py-3 rounded-xl block">Flashcard রিভিশন করো</a>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
