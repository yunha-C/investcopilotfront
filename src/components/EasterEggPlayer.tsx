import React from 'react';
import { X } from 'lucide-react';

interface EasterEggPlayerProps {
  isVisible: boolean;
  onClose: () => void;
}

export const EasterEggPlayer: React.FC<EasterEggPlayerProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999]">
      <div className="relative bg-white dark:bg-dark-surface-primary rounded-lg p-6 w-full max-w-4xl shadow-elevation-3 dark:shadow-dark-elevation-3">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-900 dark:hover:text-dark-text-primary hover:bg-neutral-100 dark:hover:bg-dark-surface-secondary rounded-lg transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Easter Egg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary">
            Nice try. Vestie sees what you did there.
          </p>
        </div>
      </div>
    </div>
  );
};