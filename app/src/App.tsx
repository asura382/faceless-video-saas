import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'sonner';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import Results from './sections/Results';
import HowItWorks from './sections/HowItWorks';
import VideoCreator from './sections/VideoCreator';
import BusinessAvatars from './sections/BusinessAvatars';
import Affiliate from './sections/Affiliate';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.defaults({
        toggleActions: 'play none none reverse',
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen bg-black text-white overflow-x-hidden">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#181818',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Navigation />
      <main>
        <Hero />
        <Results />
        <HowItWorks />
        <VideoCreator />
        <BusinessAvatars />
        <Affiliate />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;
