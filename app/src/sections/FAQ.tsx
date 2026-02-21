import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus, MessageCircle, Mail } from 'lucide-react';
import Modal from '../components/Modal';
import AdBanner from '../components/AdBanner';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    id: 1,
    question: 'Is Faceless.video really free?',
    answer: 'Yes! Our basic plan is completely free forever. You can create unlimited videos using free AI models with no credit card required. We also offer premium features for users who need advanced capabilities.',
  },
  {
    id: 2,
    question: 'What AI models do you use?',
    answer: 'We use only free and open-source AI models including Pollinations AI for image generation, Web Speech API for voiceovers, and free stock video sources. This allows us to offer our service at no cost to you.',
  },
  {
    id: 3,
    question: 'Do I need to make videos for this to work?',
    answer: 'Not at all! Our AI handles everything from script writing to video creation. You just need to set up your preferences and let our system do the work. The videos are automatically generated, edited, and posted to your social media accounts.',
  },
  {
    id: 4,
    question: 'What if I want to edit a video before it\'s posted?',
    answer: 'You have full control! Our dashboard allows you to review and edit any video before it goes live. You can modify the script, change the background, adjust the voiceover, or even schedule it for a different time.',
  },
  {
    id: 5,
    question: 'What platforms do you support?',
    answer: 'We currently support TikTok, YouTube Shorts, Instagram Reels, and Facebook. We\'re constantly adding new platforms based on user demand. You can connect multiple accounts and cross-post content automatically.',
  },
  {
    id: 6,
    question: 'How do you make money if the service is free?',
    answer: 'We display minimal, non-intrusive ads on our platform. We also offer a premium plan with additional features for power users. This allows us to keep the basic service free for everyone while sustaining the platform.',
  },
];

const FAQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-header',
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
        '.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsContactOpen(false);
      setIsSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <section ref={sectionRef} id="faq" className="relative py-24 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#c0f748]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="faq-header text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Frequently Asked <span className="text-[#c0f748]">Questions</span>
          </h2>
          <p className="text-gray-400">
            Everything you need to know about Faceless.video
          </p>
        </div>

        {/* Ad Banner */}
        <div className="mb-8">
          <AdBanner position="top" size="small" />
        </div>

        {/* FAQ List */}
        <div className="faq-list space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                className="faq-item"
                initial={false}
              >
                <div
                  className={`rounded-xl overflow-hidden transition-all duration-300 ${
                    isOpen ? 'bg-[#181818]' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                    <motion.div
                      initial={false}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-[#c0f748] text-black' : 'bg-white/10 text-white'
                      }`}
                    >
                      {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6">
                          <div className="h-px bg-white/10 mb-4" />
                          <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">Still have questions?</p>
          <button
            onClick={() => setIsContactOpen(true)}
            className="inline-flex items-center gap-2 text-[#c0f748] font-medium hover:underline"
          >
            <MessageCircle size={18} />
            Contact our support team
          </button>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} title="Contact Support">
        {!isSubmitted ? (
          <form onSubmit={handleContact} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors resize-none"
                placeholder="How can we help?"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
              <Mail size={18} />
              Send Message
            </button>
            <p className="text-xs text-gray-500 text-center">
              We typically respond within 24 hours
            </p>
          </form>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-[#c0f748] flex items-center justify-center mx-auto mb-4"
            >
              <Mail size={32} className="text-black" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
            <p className="text-gray-400">We'll get back to you soon.</p>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default FAQ;
