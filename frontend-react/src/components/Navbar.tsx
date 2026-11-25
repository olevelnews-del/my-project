import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10">
      <Link to="/" className="flex items-center gap-2 text-white font-heading tracking-tight text-lg sm:text-xl">
        <span>HSC Academic Hub</span>
        <span className="text-pink-500 font-bold">✳</span>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-white/80 font-medium">
        <Link to="/courses" className="hover:text-white hover:opacity-100 transition">Courses</Link>
        <span className="text-white/20">,</span>
        <Link to="/planner" className="hover:text-white hover:opacity-100 transition">Planner</Link>
        <span className="text-white/20">,</span>
        <Link to="/syllabus" className="hover:text-white hover:opacity-100 transition">Syllabus</Link>
        <span className="text-white/20">,</span>
        <Link to="/scorecard" className="hover:text-white hover:opacity-100 transition">Scorecard</Link>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <a 
          href="https://wa.me/8801616200174?text=HSC%20Hub%20Support" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white text-sm font-medium underline underline-offset-4 hover:text-yellow-400 transition"
        >
          WhatsApp করো
        </a>
        <Link 
          to="/pricing"
          className="bg-yellow-400 text-slate-900 font-bold px-4 py-2 rounded-full text-xs sm:text-sm hover:bg-yellow-300 transition"
        >
          ভর্তি (৳999)
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 z-50 focus:outline-none"
        aria-label="Toggle Menu"
      >
        <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center px-8 gap-6 z-40 transition-all duration-300 md:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <Link to="/" onClick={() => setMobileOpen(false)} className="text-2xl font-heading text-white">হোম</Link>
        <Link to="/courses" onClick={() => setMobileOpen(false)} className="text-2xl font-heading text-white">Courses</Link>
        <Link to="/planner" onClick={() => setMobileOpen(false)} className="text-2xl font-heading text-white">Planner</Link>
        <Link to="/syllabus" onClick={() => setMobileOpen(false)} className="text-2xl font-heading text-white">Syllabus</Link>
        <Link to="/scorecard" onClick={() => setMobileOpen(false)} className="text-2xl font-heading text-white">Scorecard</Link>
        <Link to="/pricing" onClick={() => setMobileOpen(false)} className="text-2xl font-heading text-yellow-400 font-bold">ভর্তি (৳999)</Link>
        <a 
          href="https://wa.me/8801616200174?text=HSC%20Hub%20Support" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white text-base underline underline-offset-4 mt-4"
        >
          WhatsApp: 01616200174
        </a>
      </div>
    </nav>
  );
}
