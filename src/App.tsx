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
  const { currentStep, updatePortfolioBalance, setCurrentStep } = useInvestmentStore();
  const { isAuthenticated, checkAuthStatus, user } = useAuthStore();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Check if user has completed investment profile and handle initial routing
  useEffect(() => {
    console.log('App useEffect triggered:', {
      isAuthenticated,
      hasCompletedProfile: user?.hasCompletedInvestmentProfile,
      currentStep
    });
    
    if (isAuthenticated && user) {
      if (user.hasCompletedInvestmentProfile && currentStep === 'questionnaire') {
        // User has already completed the questionnaire, go directly to dashboard
        console.log('User has completed investment profile, skipping questionnaire');
        setCurrentStep('dashboard');
      } else if (!user.hasCompletedInvestmentProfile && currentStep !== 'questionnaire' && currentStep !== 'results') {
        // User hasn't completed questionnaire but is not on questionnaire or results step
        // Allow results step to show after questionnaire completion
        console.log('User needs to complete investment profile, showing questionnaire');
        setCurrentStep('questionnaire');
      }
    }
  }, [isAuthenticated, user, currentStep, setCurrentStep]);

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
      
      {currentStep === 'questionnaire' && <Questionnaire key="questionnaire" />}
      {currentStep === 'results' && <PortfolioResults key="results" />}
      {currentStep === 'dashboard' && <Dashboard key="dashboard" />}
      {currentStep === 'portfolio-details' && <PortfolioDetails key="portfolio-details" />}
    </div>
  );
}

export default App;