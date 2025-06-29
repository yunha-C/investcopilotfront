import React from 'react';
import { useThemeStore } from '../store/themeStore';

export const BoltBadge: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform duration-200 hover:scale-110 hover:shadow-lg"
        aria-label="Powered by Bolt.new"
      >
        <img
          src={isDarkMode ? "/white_circle_360x360.png" : "/black_circle_360x360.png"}
          alt="Powered by Bolt.new"
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          style={{
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))'
          }}
        />
      </a>
    </div>
  );
};