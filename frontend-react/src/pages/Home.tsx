import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { BangladeshiStudents } from '../components/BangladeshiStudents';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-between">
      <Navbar />
      <Hero />
      <BangladeshiStudents />
      <Footer />
    </div>
  );
}
