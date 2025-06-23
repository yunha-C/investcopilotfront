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
  const { currentStep, updatePortfolioBalance, setCurrentStep, portfolio, loadUserPortfolios } = useInvestmentStore();
  const { isAuthenticated, checkAuthStatus, user } = useAuthStore();

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Load user portfolios when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      console.log('=== LOADING USER PORTFOLIOS ===');
      console.log('User authenticated, loading portfolios for user:', user.id);
      loadUserPortfolios(user.id);
    }
  }, [isAuthenticated, user?.id, loadUserPortfolios]);

  // Handle initial routing after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('=== APP ROUTING DEBUG ===');
      console.log('User authenticated:', user.firstName);
      console.log('Current step:', currentStep);
      console.log('Has portfolio:', !!portfolio);
      
      // Only redirect to home if user is not actively using the app
      if (currentStep === 'questionnaire' && !portfolio) {
        // User is starting questionnaire without portfolio - this is normal, don't redirect
        console.log('User starting questionnaire - allowing to continue');
      } else if (currentStep === 'questionnaire' && portfolio) {
        // User has portfolio but somehow ended up on questionnaire, go to home
        console.log('User has portfolio but on questionnaire - redirecting to home');
        setCurrentStep('home');
      }
    }
  }, [isAuthenticated, user, setCurrentStep]); // Removed currentStep and portfolio from deps to prevent loops

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
    console.log('=== AUTHENTICATION SUCCESS ===');
    // Re-check auth status after successful authentication
    checkAuthStatus();
    // Set to home page after successful authentication
    setCurrentStep('home');
  };

  if (!isAuthenticated) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  console.log('=== APP RENDER DEBUG ===');
  console.log('Current step:', currentStep);
  console.log('Rendering component for step:', currentStep);

  return (
    <>
      {/* Global Background - Always Present */}
      <div className="background-wrapper">
        <div className="gradient-circle-1"></div>
        <div className="gradient-circle-2"></div>
        <div className="blur-overlay"></div>
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen relative z-10">
        <Header />
        
        {currentStep === 'home' && <Home />}
        {currentStep === 'questionnaire' && <Questionnaire />}
        {currentStep === 'results' && <PortfolioResults />}
        {currentStep === 'dashboard' && <Dashboard />}
        {currentStep === 'portfolio-details' && <PortfolioDetails />}
      </div>
    </>
  );
}

export default App;