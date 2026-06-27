import React, { useState } from 'react';
import { Mail, Lock, User, Linkedin, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';
import { mockUser } from '../mockData';

interface AuthViewProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('alex@mercerconsulting.com');
  const [password, setPassword] = useState('password');
  const [fullName, setFullName] = useState('');
  const [planType, setPlanType] = useState<'Free' | 'Pro'>('Pro');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Mock login validation
      if (email === 'alex@mercerconsulting.com' && password === 'password') {
        onLoginSuccess(mockUser);
      } else if (email && password) {
        // Create an ad-hoc user for any other login
        const adhocUser: UserType = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
          email: email,
          plan_type: 'Free',
          created_at: new Date().toISOString(),
        };
        onLoginSuccess(adhocUser);
      } else {
        setError('Please enter both email and password.');
      }
    } else {
      // Signup
      if (!fullName || !email || !password) {
        setError('Please fill in all fields.');
        return;
      }
      const newUser: UserType = {
        id: `usr_${Date.now()}`,
        name: fullName,
        email: email,
        plan_type: planType,
        created_at: new Date().toISOString(),
      };
      onLoginSuccess(newUser);
    }
  };

  const handleQuickDemo = () => {
    onLoginSuccess(mockUser);
  };

  return (
    <div id="auth-container" className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto w-full max-w-md my-auto">
        <div className="text-center mb-8">
          {/* Logo Brand Icon */}
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-4">
            <Linkedin className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-display">
            LinkedIn CRM
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin ? 'Acquire prospects and track outbound deals' : 'Start growing your sales pipeline'}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Plan Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlanType('Free')}
                    className={`py-2 px-3 border rounded-xl text-center text-sm font-medium transition-all ${
                      planType === 'Free'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Free Trial
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanType('Pro')}
                    className={`py-2 px-3 border rounded-xl text-center text-sm font-medium transition-all relative ${
                      planType === 'Pro'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Pro Outreach
                    <span className="absolute -top-2 -right-1 px-1.5 py-0.5 bg-blue-600 text-[9px] text-white rounded-full font-bold uppercase tracking-wider">
                      Pro
                    </span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-blue-600/15 group"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-white px-2.5 text-slate-400 font-medium">Or Experience Now</span>
            </div>
          </div>

          <div>
            <button
              onClick={handleQuickDemo}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
            >
              <Sparkles className="mr-2 h-4 w-4 text-amber-400 animate-pulse" />
              Quick Demo Login (Alex)
            </button>
            <p className="mt-1.5 text-center text-[11px] text-slate-400">
              Instant login with fully populated mock data
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center space-x-1.5 font-medium text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>LinkedIn Outbound Compliance Protection Active</span>
        </div>
        <p>This CRM operates manually. No automated bots or scraping tools are used.</p>
      </div>
    </div>
  );
}
