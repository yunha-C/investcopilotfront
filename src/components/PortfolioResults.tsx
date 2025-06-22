import React from 'react';
import { ChevronRight, TrendingUp, DollarSign, Shield, ArrowLeft, Calculator, Info } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';

export const PortfolioResults: React.FC = () => {
  const { portfolio, setCurrentStep, updatePortfolioBalance } = useInvestmentStore();

  if (!portfolio) return null;

  const handleSavePortfolio = () => {
    // Simulate initial investment
    updatePortfolioBalance(10000);
    setCurrentStep('dashboard');
  };

  const handleModifyPortfolio = () => {
    setCurrentStep('questionnaire');
  };

  const calculateFeeExample = (amount: number) => {
    const annualFee = amount * 0.0001; // 0.01%
    const monthlyFee = annualFee / 12;
    return { annual: annualFee, monthly: monthlyFee };
  };

  const feeExamples = [
    { amount: 10000, label: '$10,000' },
    { amount: 50000, label: '$50,000' },
    { amount: 100000, label: '$100,000' },
    { amount: 500000, label: '$500,000' },
  ];

  return (
    <div className="min-h-screen bg-[#FCFDFD] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setCurrentStep('questionnaire')}
          className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-body-medium">Back to Questionnaire</span>
        </button>

        <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 overflow-hidden">
          <div className="p-8 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-2">
                  {portfolio.name}
                </h1>
                <p className="text-body-large text-neutral-600">
                  Your AI-generated investment portfolio is ready
                </p>
              </div>
              <div className="text-right">
                <div className="text-body-small text-neutral-600">Risk Score</div>
                <div className="text-headline-medium font-headline font-semi-bold text-neutral-900">{portfolio.riskScore}/5</div>
                <div className="text-body-small text-neutral-600">{portfolio.riskLevel} Risk</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">
                  Asset Allocation
                </h2>
                <PortfolioChart allocation={portfolio.allocation} />
              </div>

              <div className="space-y-6">
                <div className="bg-neutral-100 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-neutral-700" />
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Expected Performance</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-body-small text-neutral-600">Annual Return</p>
                      <p className="text-headline-medium font-headline font-semi-bold text-neutral-900">{portfolio.expectedReturn}%</p>
                    </div>
                    <div>
                      <p className="text-body-small text-neutral-600">Risk Level</p>
                      <p className="text-title-medium font-headline font-semi-bold text-neutral-800">{portfolio.riskLevel}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-100 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator className="w-5 h-5 text-neutral-700" />
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Fee Structure</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-headline-medium font-headline font-semi-bold text-neutral-900">{portfolio.managementFee}%</p>
                      <p className="text-body-small text-neutral-600">Annual management fee</p>
                    </div>
                    <div className="text-body-small text-neutral-600 space-y-1">
                      <p>• Calculated monthly on total assets</p>
                      <p>• No transaction or hidden fees</p>
                      <p>• Transparent, all-inclusive pricing</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-100 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-neutral-700" />
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Portfolio Breakdown</h3>
                  </div>
                  <div className="space-y-2">
                    {portfolio.allocation.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: asset.color }}
                          />
                          <span className="text-body-small text-neutral-800">{asset.name}</span>
                        </div>
                        <span className="text-body-small font-medium text-neutral-900">
                          {asset.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="p-6 bg-neutral-100 rounded-lg">
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">AI Strategy Reasoning</h3>
                <p className="text-body-medium text-neutral-700 leading-relaxed">
                  {portfolio.reasoning}
                </p>
              </div>

              <div className="p-6 bg-neutral-100 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-neutral-600" />
                  <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Fee Examples</h3>
                </div>
                <div className="space-y-2">
                  {feeExamples.map((example) => {
                    const fees = calculateFeeExample(example.amount);
                    return (
                      <div key={example.amount} className="flex justify-between text-body-small">
                        <span className="text-neutral-700">{example.label} portfolio:</span>
                        <div className="text-right">
                          <div className="text-neutral-800 font-medium">
                            ${fees.annual.toFixed(2)}/year
                          </div>
                          <div className="text-neutral-600 text-body-small">
                            (${fees.monthly.toFixed(2)}/month)
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-300">
                  <p className="text-body-small text-neutral-600">
                    Fees automatically deducted monthly from your account
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSavePortfolio}
                className="flex-1 bg-neutral-900 text-white py-4 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                Accept Portfolio & Continue
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleModifyPortfolio}
                className="px-6 py-4 border-2 border-neutral-400 text-neutral-700 rounded-lg text-label-large font-medium hover:bg-neutral-100 transition-colors"
              >
                Modify Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};