import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles } from 'lucide-react';
import Modal from '../components/Modal';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Pricing', href: '#pricing', action: () => alert('Pricing page coming soon!') },
    { name: 'About', href: '#about', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'For Business', href: '#business', action: () => document.getElementById('business')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'Affiliate', href: '#affiliate', action: () => document.getElementById('affiliate')?.scrollIntoView({ behavior: 'smooth' }) },
    { name: 'FAQ', href: '#faq', action: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    localStorage.setItem('faceless_user', JSON.stringify({ email, loggedIn: true }));
    alert(`Welcome back, ${email}!`);
    setIsLoginOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleTrial = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate trial signup
    localStorage.setItem('faceless_trial', JSON.stringify({ email, startDate: new Date() }));
    alert(`Free trial started for ${email}! Check your email for confirmation.`);
    setIsTrialOpen(false);
    setEmail('');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-8 h-8 rounded-full bg-[#c0f748] flex items-center justify-center">
                <Sparkles size={18} className="text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight">faceless.video</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  onClick={link.action}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="text-sm text-gray-300 hover:text-white underline-animate transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={() => setIsLoginOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Log In
              </motion.button>
              <motion.button
                onClick={() => setIsTrialOpen(true)}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(192, 247, 72, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-sm"
              >
                FREE TRIAL
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20 md:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  onClick={() => {
                    link.action();
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-xl text-white hover:text-[#c0f748] transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLoginOpen(true);
                }}
                className="text-xl text-gray-400 hover:text-white transition-colors mt-4"
              >
                Log In
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsTrialOpen(true);
                }}
                className="btn-primary mt-4"
              >
                FREE TRIAL
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} title="Welcome Back">
        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3">
            Log In
          </button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => {
                setIsLoginOpen(false);
                setIsTrialOpen(true);
              }}
              className="text-[#c0f748] hover:underline"
            >
              Start free trial
            </button>
          </p>
        </form>
      </Modal>

      {/* Free Trial Modal */}
      <Modal isOpen={isTrialOpen} onClose={() => setIsTrialOpen(false)} title="Start Your Free Trial">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c0f748]/10 text-[#c0f748] text-sm mb-4">
            <Sparkles size={16} />
            7 Days Free - No Credit Card Required
          </div>
          <p className="text-gray-400">Get full access to all features</p>
        </div>
        <form onSubmit={handleTrial} className="space-y-4">
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
          <div className="flex items-start gap-3">
            <input type="checkbox" id="terms" className="mt-1" required />
            <label htmlFor="terms" className="text-sm text-gray-400">
              I agree to the{' '}
              <a href="#" className="text-[#c0f748] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#c0f748] hover:underline">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
            <Sparkles size={18} />
            Start Free Trial
          </button>
          <p className="text-center text-xs text-gray-500">
            Free forever plan also available with limited features
          </p>
        </form>
      </Modal>
    </>
  );
};

export default Navigation;
