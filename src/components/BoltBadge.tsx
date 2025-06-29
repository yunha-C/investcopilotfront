import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const BoltBadge: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show scroll to top button when user has scrolled down 300px
      setShowScrollTop(scrollTop > 300);
      
      // Check if user is near bottom (within 100px of bottom)
      const isAtBottom = scrollTop + windowHeight >= documentHeight - 100;
      setIsNearBottom(isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Bolt Badge - Always visible */}
      <div className={`fixed bottom-4 right-4 z-50 transition-transform duration-300 ${
        isNearBottom ? 'transform translate-y-[-60px]' : ''
      }`}>
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform duration-200 hover:scale-110 hover:shadow-lg"
          aria-label="Powered by Bolt.new"
        >
          <div className="relative">
            {/* Fallback SVG badge if images don't load */}
            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg ${
              isDarkMode 
                ? 'bg-white text-black border-2 border-gray-300' 
                : 'bg-black text-white border-2 border-gray-700'
            }`}>
              <div className="text-center leading-tight">
                <div className="text-[8px] sm:text-[10px] md:text-xs font-bold">POWERED BY</div>
                <div className="text-sm sm:text-base md:text-lg font-black">bolt</div>
                <div className="text-[6px] sm:text-[8px] md:text-[10px] font-medium">NEW MADE IN</div>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Scroll to Top Button - Shows when scrolled down */}
      {showScrollTop && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={scrollToTop}
            className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 ${
              isDarkMode
                ? 'bg-dark-surface-primary border border-dark-border-primary text-dark-text-primary hover:bg-dark-surface-secondary'
                : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
            } ${isNearBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </>
  );
};