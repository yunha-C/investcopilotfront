import React, { useState, useEffect } from "react";
import { LogOut, User, Settings, Moon, Sun } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const [showSettings, setShowSettings] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    // Reload the page to reset the app state
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/30 dark:bg-dark-surface-primary/30 backdrop-blur-2xl shadow-lg dark:shadow-dark-elevation-2 border border-white/30 dark:border-dark-border-primary/30"
          : "bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <img
            src="/vestie logo v1.png"
            alt="Vestie"
            className="h-4 w-auto transition-all duration-300"
            style={{
              filter: isDarkMode
                ? "brightness(0) invert(1)" // White in dark mode
                : "brightness(0) saturate(100%) invert(4%) sepia(6%) saturate(1%) hue-rotate(314deg) brightness(96%) contrast(96%)", // Dark in light mode
            }}
          />
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-body-medium text-neutral-700 dark:text-gray-300">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {user.firstName} {user.lastName}
              </span>
              <span className="sm:hidden">{user.firstName}</span>
            </div>

            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-3 py-2 text-body-small text-neutral-600 dark:text-gray-400 hover:text-neutral-800 dark:hover:text-gray-200 rounded-lg transition-all duration-200 ${
                  isScrolled
                    ? "hover:bg-neutral-100 dark:hover:bg-gray-700"
                    : "hover:bg-neutral-100/50 dark:hover:bg-gray-700/50"
                }`}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>

              {showSettings && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-600 rounded-lg shadow-elevation-3 dark:shadow-dark-elevation-3 z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        toggleDarkMode();
                        setShowSettings(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {isDarkMode ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                      <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                    </button>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-gray-600 p-2">
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowSettings(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-body-small text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSettings(false)}
        />
      )}
    </header>
  );
};
