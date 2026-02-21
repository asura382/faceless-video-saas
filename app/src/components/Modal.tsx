import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full ${sizeClasses[size]} z-50 px-4`}
          >
            <div className="bg-[#181818] border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-xl font-bold">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
