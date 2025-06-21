import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface AuthPageProps {
  onAuthenticated: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  // Clear auth error when component mounts or auth mode changes
  useEffect(() => {
    clearError();
  }, [isLogin, clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      onAuthenticated();
    }
  }, [isAuthenticated, onAuthenticated]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.firstName, formData.lastName, formData.email, formData.password);
      }
      // onAuthenticated will be called via useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled by the store and displayed via the error state
      console.error('Authentication error:', error);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    clearError();
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-2">
            InvestCopilot
          </h1>
          <p className="text-body-large text-neutral-600">
            Investment agent powered by AI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-elevation-2 border border-neutral-300 p-8">
          <div className="mb-6">
            <h2 className="text-headline-medium font-headline font-semi-bold text-neutral-900 mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-body-medium text-neutral-600">
              {isLogin 
                ? 'Enter your information to access your portfolio' 
                : 'Join thousands of investors using AI-powered portfolio management'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-negative/10 border border-negative/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-negative flex-shrink-0 mt-0.5" />
              <p className="text-body-small text-negative">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-label-large font-medium text-neutral-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-body-medium focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${
                        errors.firstName 
                          ? 'border-negative bg-negative/5' 
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                      placeholder="John"
                      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      aria-invalid={!!errors.firstName}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.firstName && (
                    <p id="firstName-error" className="mt-2 text-body-small text-negative" role="alert">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-label-large font-medium text-neutral-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg text-body-medium focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${
                        errors.lastName 
                          ? 'border-negative bg-negative/5' 
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                      placeholder="Doe"
                      aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                      aria-invalid={!!errors.lastName}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.lastName && (
                    <p id="lastName-error" className="mt-2 text-body-small text-negative" role="alert">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-label-large font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-body-medium focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${
                    errors.email 
                      ? 'border-negative bg-negative/5' 
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                  placeholder="john@example.com"
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-2 text-body-small text-negative" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-label-large font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg text-body-medium focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${
                    errors.password 
                      ? 'border-negative bg-negative/5' 
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  aria-describedby={errors.password ? 'password-error' : 'password-help'}
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && !errors.password && (
                <p id="password-help" className="mt-2 text-body-small text-neutral-600">
                  Password must be at least 8 characters long
                </p>
              )}
              {errors.password && (
                <p id="password-error" className="mt-2 text-body-small text-negative" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-label-large font-medium text-neutral-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg text-body-medium focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword 
                        ? 'border-negative bg-negative/5' 
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    aria-invalid={!!errors.confirmPassword}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors disabled:opacity-50"
                    aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-2 text-body-small text-negative" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-4 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <button 
                className="text-body-medium text-neutral-600 hover:text-neutral-800 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
            <p className="text-body-medium text-neutral-600 mb-3">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={toggleAuthMode}
              className="text-label-large font-medium text-neutral-900 hover:text-neutral-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="mt-6 text-center">
            <p className="text-body-small text-neutral-500">
              By creating an account, you agree to our{' '}
              <button className="text-neutral-700 hover:text-neutral-900 underline transition-colors">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-neutral-700 hover:text-neutral-900 underline transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};