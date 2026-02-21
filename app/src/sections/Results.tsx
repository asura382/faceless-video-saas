import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Play, Eye, Heart } from 'lucide-react';
import Modal from '../components/Modal';
import AdBanner from '../components/AdBanner';

gsap.registerPlugin(ScrollTrigger);

const resultCards = [
  { id: 1, image: '/images/result-1.jpg', title: 'Astronaut Vision', views: '2.4M views', likes: '125K', pinned: true },
  { id: 2, image: '/images/result-2.jpg', title: 'Dream Home Tour', views: '1.8M views', likes: '89K', pinned: false },
  { id: 3, image: '/images/result-3.jpg', title: 'Midnight Horror', views: '3.2M views', likes: '210K', pinned: false },
  { id: 4, image: '/images/result-4.jpg', title: 'Mountain Escape', views: '5.1M views', likes: '340K', pinned: true },
];

const Results = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<typeof resultCards[0] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = trackRef.current?.querySelectorAll('.result-card');
      if (cards) {
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50, rotateY: -15 },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: direction === 'left' ? '+=400' : '-=400',
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section ref={sectionRef} className="relative py-20 bg-black overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c0f748]/5 rounded-full blur-[200px]" />
      </div>

      {/* Title */}
      <div ref={titleRef} className="relative z-10 text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          We Get <span className="text-[#c0f748]">Views</span>
        </h2>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto">
          Check out these results from creators using our free AI tools
        </p>
      </div>

      {/* Ad Banner */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <AdBanner position="top" size="small" />
      </div>

      {/* Navigation Arrows */}
      <div className="relative z-10 flex justify-center gap-4 mb-8">
        <button
          onClick={() => scroll('left')}
          className="p-3 rounded-full bg-white/10 hover:bg-[#c0f748] hover:text-black transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="p-3 rounded-full bg-white/10 hover:bg-[#c0f748] hover:text-black transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Cards Track */}
      <div className="relative overflow-visible">
        <div
          ref={trackRef}
          className="flex gap-6 px-8 md:px-16"
          style={{ width: 'max-content' }}
        >
          {resultCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="result-card relative group cursor-pointer"
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: `rotate(${(index % 2 === 0 ? -2 : 2)}deg)`,
              }}
              onClick={() => setSelectedVideo(card)}
            >
              <div className="relative w-64 md:w-80 aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-[#c0f748] flex items-center justify-center">
                    <Play size={28} className="text-black ml-1" />
                  </div>
                </div>
                
                {/* Pinned Badge */}
                {card.pinned && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Pinned
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#c0f748] flex items-center gap-1">
                      <Eye size={14} /> {card.views}
                    </span>
                    <span className="text-pink-400 flex items-center gap-1">
                      <Heart size={14} /> {card.likes}
                    </span>
                  </div>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-[#c0f748] rounded-2xl" />
              </div>
            </motion.div>
          ))}

          {/* Duplicate cards */}
          {resultCards.map((card, index) => (
            <motion.div
              key={`dup-${card.id}`}
              className="result-card relative group cursor-pointer"
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: `rotate(${(index % 2 === 0 ? -2 : 2)}deg)`,
              }}
              onClick={() => setSelectedVideo(card)}
            >
              <div className="relative w-64 md:w-80 aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-[#c0f748] flex items-center justify-center">
                    <Play size={28} className="text-black ml-1" />
                  </div>
                </div>
                {card.pinned && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Pinned
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#c0f748] flex items-center gap-1">
                      <Eye size={14} /> {card.views}
                    </span>
                    <span className="text-pink-400 flex items-center gap-1">
                      <Heart size={14} /> {card.likes}
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-[#c0f748] rounded-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 mt-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {[
            { value: '10M+', label: 'Videos Created' },
            { value: '500K+', label: 'Active Creators' },
            { value: '1B+', label: 'Total Views' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#c0f748]">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        title={selectedVideo?.title || ''}
        size="md"
      >
        {selectedVideo && (
          <div className="space-y-4">
            <div className="aspect-[9/16] max-w-sm mx-auto rounded-xl overflow-hidden">
              <img
                src={selectedVideo.image}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-6">
              <span className="text-[#c0f748] flex items-center gap-2">
                <Eye size={18} /> {selectedVideo.views}
              </span>
              <span className="text-pink-400 flex items-center gap-2">
                <Heart size={18} /> {selectedVideo.likes}
              </span>
            </div>
            <p className="text-center text-gray-400 text-sm">
              This video was created using our free AI tools. You can create similar videos in minutes!
            </p>
            <button
              onClick={() => {
                setSelectedVideo(null);
                document.getElementById('video-creator')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full btn-primary"
            >
              Create Similar Video
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Results;
