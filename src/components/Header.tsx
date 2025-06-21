import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // Reload the page to reset the app state
    window.location.reload();
  };

  return (
    <header className="bg-neutral-200 border-b border-neutral-300 px-4 py-2 shadow-elevation-1">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-title-large font-headline font-semi-bold text-neutral-900">InvestCopilot</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-body-medium text-neutral-700">
              <User className="w-4 h-4" />
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-body-small text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};