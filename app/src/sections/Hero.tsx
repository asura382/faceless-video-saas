import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import Modal from '../components/Modal';
import AdBanner from '../components/AdBanner';

const heroCards = [
  { id: 1, image: '/images/hero-card-1.jpg', label: 'INTO HUES' },
  { id: 2, image: '/images/hero-card-2.jpg', label: 'WILD' },
  { id: 3, image: '/images/hero-card-3.jpg', label: 'ON THE' },
  { id: 4, image: '/images/hero-card-4.jpg', label: 'MYSTIC' },
  { id: 5, image: '/images/hero-card-5.jpg', label: 'MEDIA' },
];

const Hero = () => {
  const cardsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, rotateX: 30 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'expo.out', delay: 0.3 }
      );

      const cards = cardsRef.current?.querySelectorAll('.hero-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 100, scale: 0.8 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            delay: 0.5,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.querySelectorAll('.hero-card');
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      cards.forEach((card, index) => {
        const factor = (index - 2) * 0.3;
        gsap.to(card, {
          x: x * factor,
          y: y * factor,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToCreator = () => {
    document.getElementById('video-creator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c0f748]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c0f748]/5 rounded-full blur-[200px]" />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* Top Ad Banner */}
      <div className="absolute top-24 left-0 right-0 px-4 z-20">
        <AdBanner position="top" size="small" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 pt-32 pb-20">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            style={{ perspective: '1000px' }}
          >
            Create Faceless Videos
            <br />
            <span className="text-[#c0f748] text-glow">For Free</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Use free AI models to automatically create and post custom videos daily. 
            No subscriptions, no credit card required.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={scrollToCreator}
            className="btn-primary text-lg px-8 py-4 animate-pulse-glow flex items-center gap-2"
          >
            START FOR FREE
            <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => setIsVideoModalOpen(true)}
            className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <Play size={20} className="text-[#c0f748]" />
            Watch Demo
          </button>
        </motion.div>

        {/* Free Features Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {['Free Forever Plan', 'No Credit Card', 'Unlimited Videos'].map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 rounded-full bg-[#c0f748]/10 text-[#c0f748] text-sm"
            >
              ✓ {feature}
            </span>
          ))}
        </motion.div>

        {/* Video Cards */}
        <div
          ref={cardsRef}
          className="mt-16 flex items-center justify-center gap-3 md:gap-4 px-4"
        >
          {heroCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="hero-card relative group cursor-pointer"
              whileHover={{ scale: 1.1, zIndex: 10 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: `rotate(${(index - 2) * 3}deg)`,
              }}
              onClick={() => setIsInfoModalOpen(true)}
            >
              <div className="relative w-24 sm:w-32 md:w-40 lg:w-48 aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] sm:text-xs font-bold text-[#c0f748] bg-black/50 px-2 py-1 rounded">
                    {card.label}
                  </span>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_30px_rgba(192,247,72,0.3)]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />

      {/* Video Demo Modal */}
      <Modal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} title="How It Works" size="lg">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Play size={64} className="mx-auto text-[#c0f748] mb-4" />
              <p className="text-gray-400">Demo video coming soon!</p>
              <p className="text-sm text-gray-600 mt-2">Experience the magic of AI video creation</p>
            </div>
          </div>
        </div>
      </Modal>

      {/* Info Modal */}
      <Modal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} title="Sample Videos">
        <div className="space-y-4">
          <p className="text-gray-400">
            These are examples of videos you can create using our free AI tools:
          </p>
          <ul className="space-y-2">
            {[
              'Gaming content with AI-generated gameplay',
              'Nature documentaries with free stock footage',
              'Abstract visual stories with AI art',
              'Wildlife content with public domain footage',
              'Luxury lifestyle with AI-generated scenes',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c0f748]" />
                {item}
              </li>
            ))}
          </ul>
          <button onClick={scrollToCreator} className="w-full btn-primary mt-4">
            Create Your Own
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Hero;
