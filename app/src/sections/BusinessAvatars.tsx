import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Gem, Package, Monitor, BookOpen, Store, Check } from 'lucide-react';
import Modal from '../components/Modal';
import AdBanner from '../components/AdBanner';

gsap.registerPlugin(ScrollTrigger);

const businessTypes = [
  {
    id: 1,
    name: 'Luxury Products',
    description: 'Showcase high-end watches, jewelry, and premium goods with elegant AI-generated content.',
    image: '/images/business-luxury.jpg',
    icon: Gem,
    color: '#fbbf24',
    features: ['Product showcases', 'Lifestyle content', 'Unboxing videos'],
  },
  {
    id: 2,
    name: 'Physical Products',
    description: 'Promote your e-commerce products with professional demo videos and reviews.',
    image: '/images/business-physical.jpg',
    icon: Package,
    color: '#60a5fa',
    features: ['Demo videos', 'Review content', 'Comparison videos'],
  },
  {
    id: 3,
    name: 'SaaS',
    description: 'Explain your software features with clear, engaging tutorial videos.',
    image: '/images/business-saas.jpg',
    icon: Monitor,
    color: '#a78bfa',
    features: ['Tutorial videos', 'Feature highlights', 'Onboarding content'],
  },
  {
    id: 4,
    name: 'E-Books',
    description: 'Create compelling book trailers and author content to boost sales.',
    image: '/images/business-ebook.jpg',
    icon: BookOpen,
    color: '#f472b6',
    features: ['Book trailers', 'Author stories', 'Chapter previews'],
  },
  {
    id: 5,
    name: 'Brick & Mortar',
    description: 'Drive foot traffic with local business promotions and event coverage.',
    image: '/images/business-store.jpg',
    icon: Store,
    color: '#4ade80',
    features: ['Store tours', 'Event coverage', 'Local promotions'],
  },
];

const BusinessAvatars = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<typeof businessTypes[0] | null>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.business-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        '.business-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.business-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % businessTypes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you! We'll contact you at ${email} about our ${selectedBusiness?.name} solutions.`);
    setIsSignupOpen(false);
    setEmail('');
  };

  return (
    <section ref={sectionRef} id="business" className="relative py-24 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#c0f748]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="business-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            AI Avatars for <span className="text-[#c0f748]">Business</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Our AI Agents will write, edit, and post videos everyday for your business
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mb-12">
          <motion.button
            onClick={() => {
              setSelectedBusiness(businessTypes[0]);
              setIsSignupOpen(true);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            GROW YOUR BUSINESS
            <ArrowRight size={18} />
          </motion.button>
        </div>

        {/* Ad Banner */}
        <div className="max-w-4xl mx-auto mb-12">
          <AdBanner position="top" size="small" />
        </div>

        {/* Accordion Grid */}
        <div
          className="business-list grid gap-4"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {businessTypes.map((business, index) => {
            const Icon = business.icon;
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={business.id}
                className="business-item"
                onMouseEnter={() => setActiveIndex(index)}
              >
                <motion.div
                  layout
                  onClick={() => setActiveIndex(index)}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ${
                    isActive ? 'bg-[#181818]' : 'bg-white/5 hover:bg-white/10'
                  }`}
                  style={{
                    height: isActive ? '300px' : '80px',
                  }}
                >
                  {/* Collapsed State */}
                  <div
                    className={`absolute inset-x-0 top-0 h-20 flex items-center justify-between px-6 transition-opacity duration-300 ${
                      isActive ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${business.color}20` }}
                      >
                        <Icon size={20} style={{ color: business.color }} />
                      </div>
                      <span className="font-semibold text-lg">{business.name}</span>
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-gray-500 transition-transform group-hover:translate-x-1"
                    />
                  </div>

                  {/* Expanded State */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <div className="grid md:grid-cols-2 h-full">
                          {/* Image */}
                          <div className="relative h-full overflow-hidden">
                            <motion.img
                              src={business.image}
                              alt={business.name}
                              className="w-full h-full object-cover"
                              initial={{ scale: 1.1 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#181818]" />
                          </div>

                          {/* Content */}
                          <div className="p-8 flex flex-col justify-center">
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                              style={{ backgroundColor: `${business.color}20` }}
                            >
                              <Icon size={28} style={{ color: business.color }} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{business.name}</h3>
                            <p className="text-gray-400 leading-relaxed mb-4">
                              {business.description}
                            </p>
                            <ul className="space-y-2 mb-6">
                              {business.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                                  <Check size={14} style={{ color: business.color }} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <button
                              onClick={() => {
                                setSelectedBusiness(business);
                                setIsSignupOpen(true);
                              }}
                              className="self-start flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                              style={{ 
                                color: business.color,
                                backgroundColor: `${business.color}20`
                              }}
                            >
                              Get Started
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Neon Border */}
                        <div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{
                            boxShadow: `inset 0 0 0 2px ${business.color}40`,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {businessTypes.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === index ? 'w-8 bg-[#c0f748]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Signup Modal */}
      <Modal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        title={`${selectedBusiness?.name} Solutions`}
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            Get personalized AI video solutions for your {selectedBusiness?.name.toLowerCase()} business.
          </p>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Business Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors"
                placeholder="business@example.com"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary">
              Request Demo
            </button>
          </form>
          <p className="text-xs text-gray-500 text-center">
            Free consultation. No commitment required.
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default BusinessAvatars;
