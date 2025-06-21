import React, { useEffect } from 'react';
import { useInvestmentStore } from './store/investmentStore';
import { useAuthStore } from './store/authStore';
import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { Questionnaire } from './components/Questionnaire';
import { PortfolioResults } from './components/PortfolioResults';
import { Dashboard } from './components/Dashboard';
import { PortfolioDetails } from './components/PortfolioDetails';
import { Home } from './components/Home';

function App() {
  const { currentStep, updatePortfolioBalance } = useInvestmentStore();
  const { isAuthenticated, checkAuthStatus } = useAuthStore();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Simulate portfolio growth over time
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const randomGrowth = Math.random() * 0.1 - 0.05; // Random growth between -0.05% and +0.05%
      updatePortfolioBalance(10000 + (Math.random() * 400)); // Simulate small balance changes
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updatePortfolioBalance, isAuthenticated]);

  const handleAuthenticated = () => {
    // Re-check auth status after successful authentication
    checkAuthStatus();
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-surface-100">
      <Header />
      
      {currentStep === 'home' && <Home />}
      {currentStep === 'questionnaire' && <Questionnaire />}
      {currentStep === 'results' && <PortfolioResults />}
      {currentStep === 'dashboard' && <Dashboard />}
      {currentStep === 'portfolio-details' && <PortfolioDetails />}
    </div>
  );
}

export default App;