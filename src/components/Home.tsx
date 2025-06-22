import React from 'react';
import { Plus, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { useAuthStore } from '../store/authStore';

export const Home: React.FC = () => {
  const { setCurrentStep, portfolio } = useInvestmentStore();
  const { user } = useAuthStore();

  const handleCreatePortfolio = () => {
    setCurrentStep('questionnaire');
  };

  const handleViewPortfolio = () => {
    setCurrentStep('dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-display-medium font-headline font-semi-bold mb-6">
              Welcome back, {user?.firstName}
            </h1>
            <p className="text-title-large text-neutral-200 mb-8 max-w-3xl mx-auto">
              Your AI-powered investment management platform
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {portfolio ? (
              <>
                <div 
                  onClick={handleViewPortfolio}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 cursor-pointer hover:bg-white/15 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-positive/20 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-positive" />
                    </div>
                    <div>
                      <h3 className="text-title-large font-headline font-semi-bold">View Portfolio</h3>
                      <p className="text-body-medium text-neutral-300">{portfolio.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {portfolio.balance > 0 ? (
                        <>
                          <p className="text-headline-small font-headline font-semi-bold">
                            ${portfolio.balance.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <TrendingUp className="w-4 h-4 text-positive" />
                            <span className="text-positive text-label-large font-medium">+{portfolio.growth}%</span>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="text-body-medium text-neutral-300">Portfolio created</p>
                          <p className="text-body-small text-neutral-400">Add value to start tracking</p>
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                  </div>
                </div>

                <div 
                  onClick={handleCreatePortfolio}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 cursor-pointer hover:bg-white/15 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary-500/20 rounded-lg">
                      <Plus className="w-6 h-6 text-primary-300" />
                    </div>
                    <div>
                      <h3 className="text-title-large font-headline font-semi-bold">Create New Portfolio</h3>
                      <p className="text-body-medium text-neutral-300">Build another investment strategy</p>
                    </div>
                  </div>
                  <p className="text-body-medium text-neutral-400">
                    Create additional portfolios for different investment goals and strategies.
                  </p>
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors mt-4" />
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <div 
                  onClick={handleCreatePortfolio}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 cursor-pointer hover:bg-white/15 transition-all hover:scale-[1.02] group text-center"
                >
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-primary-500/20 rounded-full">
                      <Plus className="w-8 h-8 text-primary-300" />
                    </div>
                  </div>
                  <h3 className="text-headline-medium font-headline font-semi-bold mb-4">Create Your First Portfolio</h3>
                  <p className="text-body-large text-neutral-300 mb-6 max-w-2xl mx-auto">
                    Answer a few questions to create a personalized investment portfolio tailored to your goals and risk tolerance.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-primary-300 group-hover:text-white transition-colors">
                    <span className="text-label-large font-medium">Start Building</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="p-4 bg-neutral-100 rounded-full w-fit mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-neutral-700" />
            </div>
            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              Portfolio Management
            </h3>
            <p className="text-body-medium text-neutral-600">
              Create and manage diversified investment portfolios based on your preferences.
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 bg-neutral-100 rounded-full w-fit mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-neutral-700" />
            </div>
            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              Performance Tracking
            </h3>
            <p className="text-body-medium text-neutral-600">
              Monitor your portfolio performance with real-time updates and detailed analytics.
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 bg-neutral-100 rounded-full w-fit mx-auto mb-4">
              <Plus className="w-8 h-8 text-neutral-700" />
            </div>
            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              Easy Setup
            </h3>
            <p className="text-body-medium text-neutral-600">
              Quick questionnaire to understand your investment goals and risk tolerance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};