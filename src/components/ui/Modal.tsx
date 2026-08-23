import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="modal-overlay" 
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 'var(--space-4)'
          }}
        >
          <motion.div 
            className="modal-content card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              width: '100%',
              maxWidth: 500,
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--color-bg-base)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'var(--weight-semibold)' }}>{title}</h2>
              <button 
                onClick={onClose} 
                className="btn-icon" 
                style={{ width: 32, height: 32, background: 'var(--color-bg-subtle)' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <div>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
