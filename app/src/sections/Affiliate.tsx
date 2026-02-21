import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, Users, TrendingUp, ArrowRight, Copy, Check, Gift } from 'lucide-react';
import Modal from '../components/Modal';
import AdBanner from '../components/AdBanner';

gsap.registerPlugin(ScrollTrigger);

const avatars = [
  '/images/avatar-1.jpg',
  '/images/avatar-2.jpg',
  '/images/avatar-3.jpg',
  '/images/avatar-4.jpg',
  '/images/avatar-5.jpg',
  '/images/avatar-6.jpg',
  '/images/avatar-7.jpg',
];

const Affiliate = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbitsRef = useRef<HTMLDivElement>(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.affiliate-header',
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

      const orbitItems = orbitsRef.current?.querySelectorAll('.orbit-avatar');
      if (orbitItems) {
        orbitItems.forEach((item, index) => {
          const angle = (index / orbitItems.length) * 360;
          const duration = 20 + index * 2;

          gsap.to(item, {
            rotation: 360,
            duration,
            repeat: -1,
            ease: 'none',
          });

          gsap.set(item, {
            rotation: angle,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate random referral code
    const code = 'FACE' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(code);
    setIsJoined(true);
    localStorage.setItem('faceless_affiliate', JSON.stringify({ email, code, joined: true }));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(`https://faceless.video/?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} id="affiliate" className="relative py-24 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c0f748]/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="affiliate-header text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c0f748]/10 text-[#c0f748] text-sm font-medium mb-6"
          >
            <Gift size={16} />
            Earn While You Grow
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Join Our <span className="text-[#c0f748]">Affiliate Program</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Earn 20% lifetime commission of every sale made by users you refer to our platform—every month, for as long as they stay subscribed.
          </p>
        </div>

        {/* Ad Banner */}
        <div className="max-w-4xl mx-auto mb-12">
          <AdBanner position="top" size="small" />
        </div>

        {/* Orbit Section */}
        <div className="relative h-[400px] md:h-[500px] mb-16">
          {/* Center Content */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              viewport={{ once: true }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#c0f748] to-green-600 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setIsJoinOpen(true)}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-black">20%</div>
                <div className="text-xs md:text-sm text-black/70 font-medium">Commission</div>
              </div>
            </motion.div>
          </div>

          {/* Orbiting Avatars */}
          <div
            ref={orbitsRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className="orbit-avatar absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-24px',
                  marginTop: '-24px',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#c0f748] shadow-lg"
                >
                  <img
                    src={avatar}
                    alt={`Affiliate ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full border border-white/5" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Users, value: '$10K+', label: 'Top Earner', color: '#c0f748' },
            { icon: TrendingUp, value: '20%', label: 'Lifetime Commission', color: '#60a5fa' },
            { icon: DollarSign, value: 'Monthly', label: 'Recurring Payouts', color: '#f472b6' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            Join our affiliate program and earn commissions for every new user who signs up. One of our affiliates has already earned over $10K, and you can too!
          </p>
          <motion.button
            onClick={() => setIsJoinOpen(true)}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(192, 247, 72, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            Start Earning Today
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Join Modal */}
      <Modal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} title="Join Affiliate Program">
        {!isJoined ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c0f748]/10 text-[#c0f748] text-sm mb-4">
                <DollarSign size={16} />
                20% Lifetime Commission
              </div>
              <p className="text-gray-400 text-sm">
                Earn money for every user you refer. Payouts every month!
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">How will you promote us?</label>
              <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors">
                <option>Social Media</option>
                <option>YouTube Channel</option>
                <option>Blog/Website</option>
                <option>Email Marketing</option>
                <option>Other</option>
              </select>
            </div>
            <button type="submit" className="w-full btn-primary">
              Join Program
            </button>
            <p className="text-xs text-gray-500 text-center">
              By joining, you agree to our Affiliate Terms of Service
            </p>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#c0f748] flex items-center justify-center mx-auto">
              <Check size={32} className="text-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Welcome to the Program!</h3>
              <p className="text-gray-400">Your unique referral link is ready</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400 mb-2">Your referral link</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black rounded-lg px-3 py-2 text-sm text-[#c0f748]">
                  https://faceless.video/?ref={referralCode}
                </code>
                <button
                  onClick={copyCode}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {copied ? <Check size={18} className="text-[#c0f748]" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-400">Commission</p>
                <p className="text-[#c0f748] font-bold">20%</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-400">Cookie Duration</p>
                <p className="text-[#c0f748] font-bold">30 days</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Affiliate;
