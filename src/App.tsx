import { useEffect } from 'react';
import { useInvestmentStore } from './store/investmentStore';
import { useAuthStore } from './store/authStore';
import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { Questionnaire } from './components/Questionnaire';
import { PortfolioResults } from './components/PortfolioResults';
import { Dashboard } from './components/Dashboard';
import { PortfolioDetails } from './components/PortfolioDetails';
import { InsightAnalysis } from './components/InsightAnalysis';
import { Home } from './components/Home';

function App() {
  const { currentStep, setCurrentStep, portfolio, loadUserPortfolios } = useInvestmentStore();
  const { isAuthenticated, checkAuthStatus, user, isLoading } = useAuthStore();

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


  const handleAuthenticated = () => {
    console.log('=== AUTHENTICATION SUCCESS ===');
    // Re-check auth status after successful authentication
    checkAuthStatus();
    // Set to home page after successful authentication
    setCurrentStep('home');
  };

  return (
    <>
      {/* Responsive Gradient Background - Always Present */}
      <div className="background-container">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="blur-overlay"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          <AuthPage onAuthenticated={handleAuthenticated} />
        ) : (
          <>
            <Header />
            <div className="min-h-screen">
              {currentStep === 'home' && <Home />}
              {currentStep === 'questionnaire' && <Questionnaire />}
              {currentStep === 'results' && <PortfolioResults />}
              {currentStep === 'dashboard' && <Dashboard />}
              {currentStep === 'portfolio-details' && <PortfolioDetails />}
              {currentStep === 'insight-analysis' && <InsightAnalysis />}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;