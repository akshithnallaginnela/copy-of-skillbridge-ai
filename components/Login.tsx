
import React, { useState } from 'react';
import { Briefcase, Mail, Lock, ArrowRight, User, Phone, ShieldCheck, Chrome, Wrench, Search, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: (user: UserType) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'WORKER' | 'CUSTOMER'>('WORKER');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Signup
        const response = await authService.signup(name, email, password, role);
        if (response.success && response.user) {
          onLogin(response.user);
        }
      } else {
        // Login
        const response = await authService.login(email, password);
        if (response.success && response.user) {
          onLogin(response.user);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-50 transition-colors duration-500 ${role === 'WORKER' ? 'bg-blue-100' : 'bg-emerald-100'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-50 transition-colors duration-500 ${role === 'WORKER' ? 'bg-indigo-100' : 'bg-teal-100'}`} />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={onBack}
          className="inline-flex items-center gap-2 font-black text-4xl text-blue-600 cursor-pointer mb-6"
        >
          <Briefcase className="w-12 h-12" />
          SkillBridge
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {isSignUp ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="mt-3 text-lg text-slate-600">
          {role === 'WORKER'
            ? 'Join the community of verified experts today'
            : 'Find and hire the best local professionals'}
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Role Selector Tabs */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-[24px] mb-6 shadow-inner">
          <button
            onClick={() => setRole('WORKER')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[20px] text-lg font-bold transition-all ${role === 'WORKER'
              ? 'bg-white text-blue-600 shadow-md'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <Wrench className="w-5 h-5" />
            I want to Work
          </button>
          <button
            onClick={() => setRole('CUSTOMER')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[20px] text-lg font-bold transition-all ${role === 'CUSTOMER'
              ? 'bg-white text-emerald-600 shadow-md'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <Search className="w-5 h-5" />
            I want to Hire
          </button>
        </div>

        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/50 border border-slate-100 sm:rounded-[40px] sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="name" className="block text-xl font-bold text-slate-800 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-slate-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl text-slate-900 bg-slate-50/50 transition-all"
                    placeholder="e.g. Akshith N"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xl font-bold text-slate-800 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl text-slate-900 bg-slate-50/50 transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xl font-bold text-slate-800 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl text-slate-900 bg-slate-50/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-lg cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-lg text-slate-700 font-medium cursor-pointer">
                    Remember me
                  </label>
                </div>
                <div className="text-lg">
                  <a href="#" className="font-bold text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-lg text-xl font-black text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 ${role === 'WORKER' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                  }`}
              >
                {isLoading ? (
                  <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {isSignUp ? `Join as ${role === 'WORKER' ? 'Pro' : 'Customer'}` : 'Sign In'}
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-sm uppercase tracking-wider font-bold">
                <span className="px-4 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="w-full inline-flex justify-center py-4 px-4 rounded-2xl border border-slate-200 bg-white text-lg font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <Chrome className="w-6 h-6 text-blue-600 mr-2" />
                Google
              </button>
              <button className="w-full inline-flex justify-center py-4 px-4 rounded-2xl border border-slate-200 bg-white text-lg font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                <Phone className="w-6 h-6 text-green-600 mr-2" />
                Phone
              </button>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setName('');
                setError('');
              }}
              className="text-lg font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-sm font-bold uppercase tracking-widest">Secure & Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
