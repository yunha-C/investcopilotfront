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
  const { currentStep, updatePortfolioBalance, setCurrentStep, portfolio } = useInvestmentStore();
  const { isAuthenticated, checkAuthStatus, user } = useAuthStore();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handle initial routing after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      // Always start at home page after login
      if (currentStep === 'questionnaire' && !portfolio) {
        // Only redirect to home if user is on questionnaire but has no portfolio
        // This prevents interrupting the questionnaire flow
        setCurrentStep('home');
      } else if (currentStep === 'questionnaire' && portfolio) {
        // User has portfolio but somehow ended up on questionnaire, go to home
        setCurrentStep('home');
      }
    }
  }, [isAuthenticated, user, currentStep, portfolio, setCurrentStep]);

  // Simulate portfolio growth over time
  useEffect(() => {
    if (!isAuthenticated || !portfolio) return;

    const interval = setInterval(() => {
      const randomGrowth = Math.random() * 0.1 - 0.05; // Random growth between -0.05% and +0.05%
      updatePortfolioBalance(10000 + (Math.random() * 400)); // Simulate small balance changes
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updatePortfolioBalance, isAuthenticated, portfolio]);

  const handleAuthenticated = () => {
    // Re-check auth status after successful authentication
    checkAuthStatus();
    // Set to home page after successful authentication
    setCurrentStep('home');
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