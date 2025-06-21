import React from 'react';
import { Plus, TrendingUp, Shield, Brain, BarChart3, Users, Star, ArrowRight } from 'lucide-react';
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

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your risk profile and investment goals to create personalized portfolios.',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Sophisticated risk assessment ensures your investments align with your comfort level and timeline.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Monitoring',
      description: 'Track your portfolio performance with live updates and detailed analytics.',
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Stay informed with AI-curated market analysis and portfolio optimization suggestions.',
    },
  ];

  const stats = [
    { label: 'Assets Under Management', value: '$2.4B+' },
    { label: 'Active Investors', value: '50K+' },
    { label: 'Average Annual Return', value: '8.2%' },
    { label: 'Client Satisfaction', value: '98%' },
  ];

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
              Your AI-powered investment copilot is ready to help you build and manage your wealth with intelligent, personalized portfolio strategies.
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
                      <p className="text-headline-small font-headline font-semi-bold">
                        ${portfolio.balance.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="w-4 h-4 text-positive" />
                        <span className="text-positive text-label-large font-medium">+{portfolio.growth}%</span>
                      </div>
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
                    Diversify your investments with additional AI-generated portfolios tailored to different goals and risk profiles.
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
                    Get started with AI-powered portfolio management. Answer a few questions and let our advanced algorithms create a personalized investment strategy for you.
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

      {/* Stats Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-body-medium text-neutral-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-4">
            Why Choose InvestCopilot?
          </h2>
          <p className="text-body-large text-neutral-600 max-w-3xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with proven investment strategies to help you achieve your financial goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6 hover:shadow-elevation-2 transition-shadow">
              <div className="p-3 bg-neutral-100 rounded-lg w-fit mb-4">
                <feature.icon className="w-6 h-6 text-neutral-700" />
              </div>
              <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-body-medium text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-4">
              Trusted by Investors
            </h2>
            <div className="flex justify-center items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-warning fill-current" />
              ))}
              <span className="text-body-medium text-neutral-600 ml-2">4.9/5 from 10,000+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer',
                content: 'InvestCopilot helped me build a diversified portfolio that matches my risk tolerance perfectly. The AI insights are incredibly valuable.',
              },
              {
                name: 'Michael Rodriguez',
                role: 'Marketing Director',
                content: 'The automated rebalancing and market insights have saved me hours of research while improving my returns significantly.',
              },
              {
                name: 'Emily Johnson',
                role: 'Financial Advisor',
                content: 'I recommend InvestCopilot to my clients who want professional-grade portfolio management with transparent, low fees.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-body-medium text-neutral-700 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="text-label-large font-medium text-neutral-900">{testimonial.name}</div>
                  <div className="text-body-small text-neutral-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-headline-large font-headline font-semi-bold mb-4">
            Ready to Optimize Your Investments?
          </h2>
          <p className="text-body-large text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust InvestCopilot to manage their portfolios with AI-powered precision and transparency.
          </p>
          <button
            onClick={handleCreatePortfolio}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg text-label-large font-medium transition-colors inline-flex items-center gap-2"
          >
            {portfolio ? 'Create Another Portfolio' : 'Get Started Today'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};