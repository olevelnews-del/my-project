import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTypewriter } from '../hooks/useTypewriter';

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [copied, setCopied] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const navigate = useNavigate();

  const typewriterText = "আমরা শুধু পড়াই না - প্রতিদিন পড়তে বসাই, অগ্রগতি দেখাই, দুর্বলতা ঠিক করতে সাহায্য করি। এখন, আজ কী পড়বা?";
  const { displayed, done } = useTypewriter(typewriterText, 38, 600);

  // Mouse scrub background video effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX = 0;
    let targetTime = 0;
    let isSeeking = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration || isNaN(video.duration)) return;
      const delta = e.clientX - prevX;
      prevX = e.clientX;

      targetTime += (delta / window.innerWidth) * 0.8 * video.duration;
      if (targetTime < 0) targetTime = 0;
      if (targetTime > video.duration) targetTime = video.duration;

      if (!isSeeking) {
        isSeeking = true;
        video.currentTime = targetTime;
        setTimeout(() => {
          isSeeking = false;
        }, 50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Pills reveal timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText("01616200174");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden max-w-xl z-10">
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40"
        style={{ objectPosition: '70% center' }}
      />

      {/* Dark Overlay Gradient for Readability */}
      <div className="fixed inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 pt-20">
        {/* Blurred Intro Label */}
        <div 
          className="pointer-events-none select-none mb-5 sm:mb-6 font-normal text-white"
          style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: '1.3', filter: 'blur(4px)' }}
        >
          Hey there, meet HSC Academic Hub,<br />
          তোমার HSC Study System - প্রতিদিন পড়তে বসাই
        </div>

        {/* Typewriter Hook */}
        <p 
          className="text-white mb-5 sm:mb-6 font-normal min-h-[54px]"
          style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: '1.35' }}
        >
          {displayed}
          {!done && <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-1 animate-blink" />}
        </p>

        {/* Action Pills */}
        <div 
          className={`flex flex-wrap gap-y-2 transition-all duration-700 ${pillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <button 
            onClick={() => navigate('/planner')}
            className="inline-flex items-center justify-center bg-white text-slate-950 border border-black/10 rounded-full text-xs sm:text-sm px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] font-medium hover:bg-slate-900 hover:text-white transition-colors duration-200 cursor-pointer shadow-md"
          >
            আজকের প্ল্যান দেখো
          </button>

          <button 
            onClick={() => navigate('/syllabus')}
            className="inline-flex items-center justify-center bg-white text-slate-950 border border-black/10 rounded-full text-xs sm:text-sm px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] font-medium hover:bg-slate-900 hover:text-white transition-colors duration-200 cursor-pointer shadow-md"
          >
            Syllabus Coverage দেখো
          </button>

          <button 
            onClick={() => navigate('/revision')}
            className="inline-flex items-center justify-center bg-white text-slate-950 border border-black/10 rounded-full text-xs sm:text-sm px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] font-medium hover:bg-slate-900 hover:text-white transition-colors duration-200 cursor-pointer shadow-md"
          >
            Revision Queue দেখো
          </button>

          <button 
            onClick={() => navigate('/scorecard')}
            className="inline-flex items-center justify-center bg-white text-slate-950 border border-black/10 rounded-full text-xs sm:text-sm px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] font-medium hover:bg-slate-900 hover:text-white transition-colors duration-200 cursor-pointer shadow-md"
          >
            Scorecard দেখো
          </button>

          {/* WhatsApp Outline Pill with Copy */}
          <button 
            onClick={handleCopyWhatsApp}
            className="inline-flex items-center gap-2 sm:gap-3 bg-transparent text-white border border-white/40 rounded-full text-xs sm:text-sm px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] font-medium hover:bg-white hover:text-slate-950 transition-colors duration-200 cursor-pointer"
            title="Click to copy WhatsApp number"
          >
            <span className="underline underline-offset-2">WhatsApp: 01616200174</span>
            <svg className="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copied && <span className="text-xs text-yellow-300 font-bold ml-1">Copied!</span>}
          </button>
        </div>
      </div>
    </section>
  );
}
