import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  position?: 'top' | 'bottom' | 'sidebar';
  size?: 'small' | 'medium' | 'large';
}

const AdBanner = ({ position = 'bottom', size = 'medium' }: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const sizeClasses = {
    small: 'h-16',
    medium: 'h-24',
    large: 'h-32',
  };

  const positionClasses = {
    top: 'sticky top-20 z-40',
    bottom: 'fixed bottom-0 left-0 right-0 z-40',
    sidebar: 'sticky top-24 w-64 hidden xl:block',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'bottom' ? 100 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${positionClasses[position]} ${sizeClasses[size]} bg-gradient-to-r from-[#181818] via-[#1a1a2e] to-[#181818] border border-white/10 rounded-lg overflow-hidden`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Ad Label */}
        <span className="absolute top-1 left-2 text-[10px] text-gray-500 uppercase tracking-wider">
          Advertisement
        </span>
        
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-2 p-1 text-gray-500 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>

        {/* Ad Content Placeholder */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">Your Ad Here</p>
          <p className="text-gray-600 text-xs mt-1">Contact us for advertising</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#c0f748]/20 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#c0f748]/20 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

export default AdBanner;
