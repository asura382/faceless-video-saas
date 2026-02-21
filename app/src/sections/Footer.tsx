import { useState } from 'react';
import { motion } from 'framer-motion';
import { Twitter, Youtube, Instagram, Linkedin, Github, Sparkles, ArrowRight } from 'lucide-react';
import Modal from '../components/Modal';
import AdBanner from '../components/AdBanner';

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
];

const Footer = () => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const footerLinks = {
    Product: [
      { name: 'Features', action: () => document.getElementById('video-creator')?.scrollIntoView({ behavior: 'smooth' }) },
      { name: 'Pricing', action: () => alert('Free forever plan available! Premium features coming soon.') },
      { name: 'API Access', action: () => alert('API documentation coming soon!') },
      { name: 'Integrations', action: () => alert('TikTok, YouTube, Instagram, and Facebook supported!') },
    ],
    Company: [
      { name: 'About', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
      { name: 'Blog', action: () => alert('Blog coming soon!') },
      { name: 'Careers', action: () => alert('We\'re hiring! Contact us for opportunities.') },
      { name: 'Press', action: () => alert('Press kit available upon request.') },
    ],
    Resources: [
      { name: 'Documentation', action: () => alert('Full documentation coming soon!') },
      { name: 'Tutorials', action: () => alert('Video tutorials coming soon!') },
      { name: 'Support', action: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) },
      { name: 'Community', action: () => alert('Join our Discord community!') },
    ],
    Legal: [
      { name: 'Terms of Use', action: () => setTermsOpen(true) },
      { name: 'Privacy Policy', action: () => setPrivacyOpen(true) },
      { name: 'Cookie Policy', action: () => alert('We use minimal cookies for site functionality.') },
      { name: 'Affiliate Terms', action: () => document.getElementById('affiliate')?.scrollIntoView({ behavior: 'smooth' }) },
    ],
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    localStorage.setItem('faceless_newsletter', email);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="relative bg-black border-t border-white/5">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-400">Get the latest features and updates delivered to your inbox</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c0f748] transition-colors"
              required
            />
            <button type="submit" className="btn-primary flex items-center gap-2">
              {subscribed ? 'Subscribed!' : 'Subscribe'}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Ad Space */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner position="top" size="small" />
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-2 mb-6"
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-8 h-8 rounded-full bg-[#c0f748] flex items-center justify-center">
                <Sparkles size={18} className="text-black" />
              </div>
              <span className="font-bold text-lg">faceless.video</span>
            </motion.a>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              Create faceless videos for free using AI. No subscriptions, no credit card required.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#c0f748] hover:text-black transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={link.action}
                      className="text-sm text-gray-400 hover:text-[#c0f748] transition-colors relative group text-left"
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute left-0 bottom-0 w-0 h-px bg-[#c0f748] transition-all duration-300 group-hover:w-full" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Faceless.video. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setTermsOpen(true)}
                className="text-sm text-gray-500 hover:text-[#c0f748] transition-colors"
              >
                Terms of Use
              </button>
              <button 
                onClick={() => setPrivacyOpen(true)}
                className="text-sm text-gray-500 hover:text-[#c0f748] transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => document.getElementById('affiliate')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-gray-500 hover:text-[#c0f748] transition-colors"
              >
                Affiliate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c0f748]/50 to-transparent" />

      {/* Terms Modal */}
      <Modal isOpen={termsOpen} onClose={() => setTermsOpen(false)} title="Terms of Use">
        <div className="space-y-4 text-gray-400 text-sm max-h-96 overflow-y-auto">
          <h4 className="text-white font-semibold">1. Acceptance of Terms</h4>
          <p>By using Faceless.video, you agree to these terms of service.</p>
          <h4 className="text-white font-semibold">2. Free Service</h4>
          <p>Our basic service is free to use. We display ads to support the platform.</p>
          <h4 className="text-white font-semibold">3. User Content</h4>
          <p>You retain ownership of content you create. We may use anonymized data to improve our AI models.</p>
          <h4 className="text-white font-semibold">4. Prohibited Uses</h4>
          <p>You may not use our service for illegal, harmful, or infringing content.</p>
          <h4 className="text-white font-semibold">5. Disclaimer</h4>
          <p>Our service is provided "as is" without warranties of any kind.</p>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} title="Privacy Policy">
        <div className="space-y-4 text-gray-400 text-sm max-h-96 overflow-y-auto">
          <h4 className="text-white font-semibold">1. Information We Collect</h4>
          <p>We collect email addresses for account creation and newsletter subscriptions.</p>
          <h4 className="text-white font-semibold">2. How We Use Data</h4>
          <p>We use your data to provide and improve our services. We never sell your personal information.</p>
          <h4 className="text-white font-semibold">3. Cookies</h4>
          <p>We use minimal cookies for site functionality and analytics.</p>
          <h4 className="text-white font-semibold">4. Third Parties</h4>
          <p>We use free AI services (Pollinations, Web Speech API) that may process your content.</p>
          <h4 className="text-white font-semibold">5. Your Rights</h4>
          <p>You can request deletion of your account and data at any time.</p>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
