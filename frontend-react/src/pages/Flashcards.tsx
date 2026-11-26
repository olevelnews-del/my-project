import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface FlashcardItem {
  id: number;
  front: string;
  back: string;
  mastered: boolean;
}

export function FlashcardsPage() {
  const [cards, setCards] = useState<FlashcardItem[]>([
    { id: 1, front: "পদার্থবিজ্ঞান: ভেক্টরের স্কেলার গুণন (Dot Product) এর মান কত?", back: "A · B = AB cosθ", mastered: false },
    { id: 2, front: "বাংলা: 'অপরিচিতা' গল্পের কথক বা নায়কের নাম কী?", back: "অনুপম", mastered: false },
    { id: 3, front: "রসায়ন: অ্যাভোকাড্রো সংখ্যা (N_A) এর মান কত?", back: "6.023 × 10²³ mol⁻¹", mastered: false },
    { id: 4, front: "জীববিজ্ঞান: কোষ বিভাজনের কোন পর্যায়ে নিউক্লিওলাসের পুনরাবির্ভাব ঘটে?", back: "টেলোফেজ (Telophase)", mastered: false },
    { id: 5, front: "আইসিটি: বাইনারি সংখ্যা 1011 এর সমকক্ষ দশমিক সংখ্যা কত?", back: "11", mastered: false }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const masteredCount = cards.filter(c => c.mastered).length;
  const pendingCount = cards.length - masteredCount;

  const handleKnow = () => {
    const updated = [...cards];
    updated[currentIndex].mastered = true;
    setCards(updated);
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleDontKnow = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront || !newBack) return;
    setCards([...cards, { id: Date.now(), front: newFront, back: newBack, mastered: false }]);
    setNewFront('');
    setNewBack('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between pt-24">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 w-full flex-1 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading">Flashcards — স্মার্ট রিভিশন</h1>
          <div className="text-sm bg-slate-900 border border-white/10 px-4 py-2 rounded-xl">
            <span>Flashcards: {cards.length}</span> | <span className="text-green-400">Mastered: {masteredCount}</span> | <span className="text-yellow-400">Pending: {pendingCount}</span>
          </div>
        </div>

        {cards.length > 0 && currentIndex < cards.length && (
          <div className="mb-8">
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className={`bg-slate-900 border border-white/20 h-64 rounded-3xl p-8 flex flex-col justify-between cursor-pointer transition transform duration-300 shadow-2xl ${isFlipped ? 'bg-violet-950/40 border-violet-500' : ''}`}
            >
              <div className="flex justify-between text-xs text-slate-400">
                <span>Card {currentIndex + 1} of {cards.length}</span>
                <span>{isFlipped ? 'উত্তর (Back)' : 'প্রশ্ন (Front) — ক্লিক করে উল্টান'}</span>
              </div>
              <div className="text-center">
                <p className="text-xl font-medium text-white">
                  {isFlipped ? cards[currentIndex].back : cards[currentIndex].front}
                </p>
              </div>
              <div className="text-center text-xs text-slate-500">
                {isFlipped ? 'সঠিক উত্তর' : 'উত্তর দেখতে কার্ডে ক্লিক করুন'}
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button onClick={handleDontKnow} className="w-1/2 bg-red-950/50 hover:bg-red-900/50 border border-red-500/30 text-red-300 font-bold py-3 rounded-xl transition">
                Don't Know (আবার দেখাও)
              </button>
              <button onClick={handleKnow} className="w-1/2 bg-green-950/50 hover:bg-green-900/50 border border-green-500/30 text-green-300 font-bold py-3 rounded-xl transition">
                Know It (মুখস্থ হয়েছে)
              </button>
            </div>
          </div>
        )}

        <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl mt-8">
          <h3 className="text-lg font-heading mb-4">নতুন Flashcard তৈরি করুন</h3>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">প্রশ্ন (Front):</label>
              <input type="text" value={newFront} onChange={e => setNewFront(e.target.value)} placeholder="যেমন: নিউটনের ৩য় সূত্র কী?" className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">উত্তর (Back):</label>
              <input type="text" value={newBack} onChange={e => setNewBack(e.target.value)} placeholder="যেমন: প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া আছে।" className="w-full bg-slate-950 border border-white/20 rounded-xl p-3 text-white" />
            </div>
            <button type="submit" className="w-full bg-yellow-400 text-slate-950 font-bold py-3 rounded-xl">Flashcard সেভ করুন</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
