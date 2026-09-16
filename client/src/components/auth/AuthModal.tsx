import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Github, Phone, AlertCircle, Sparkles, Eye, EyeOff, KeyRound } from 'lucide-react';
import { api } from '../../services/api';
import type { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: User, message?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await api.login(email.trim(), password);
        localStorage.setItem('token', res.token);
        onSuccess(res.user, 'Welcome back to JobTrackr.io!');
        onClose();
      } else {
        if (!name.trim()) {
          throw new Error('Please provide your full name');
        }
        if (!email.trim() || !password) {
          throw new Error('Email and password are required');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        const res = await api.signup({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
          portfolio: portfolio.trim() || undefined
        });

        localStorage.setItem('token', res.token);
        onSuccess(res.user, 'Account created! Welcome to JobTrackr.io.');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#130924] border border-pink-500/30 rounded-3xl shadow-2xl shadow-purple-950/80 p-6 md:p-8 overflow-hidden text-white">
        {/* Glow ambient decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-pink-600/30 mb-3 text-white">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {mode === 'signin' ? 'Welcome Back to' : 'Join'} <span className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">JobTrackr.io</span>
          </h2>
          <p className="text-xs text-pink-200/60 mt-1">
            {mode === 'signin'
              ? 'Sign in to access your personal applications & heatmap'
              : 'Free & Open Source career cockpit for developers'}
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 p-1 bg-white/5 border border-pink-500/20 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Demo Credentials Quick Fill Box (Sign In Mode) */}
        {mode === 'signin' && (
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/30 text-xs flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-pink-300 text-[11px]">
                <KeyRound className="w-3.5 h-3.5 shrink-0" />
                <span>Default Account:</span>
              </div>
              <div className="text-[11px] text-slate-300 truncate mt-0.5">
                <span className="font-mono text-white">kaviyamurugan3016@gmail.com</span>
                <span className="text-slate-400"> (PW: <code className="text-pink-300 font-mono">password123</code>)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('kaviyamurugan3016@gmail.com');
                setPassword('password123');
                setError(null);
              }}
              className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-xl bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 hover:text-white border border-pink-500/40 transition-all cursor-pointer"
            >
              Autofill
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs mb-4 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-semibold text-pink-200/80 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kaviya Murugan"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-pink-500/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-pink-200/80 mb-1.5 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'signin' ? 'e.g. kaviyamurugan3016@gmail.com' : 'e.g. yourname@example.com'}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-pink-500/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-pink-200/80 mb-1.5 uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signin' ? 'Enter password (default: password123)' : 'Create password (min 6 characters)'}
                className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-pink-500/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-pink-200/80 mb-1.5 uppercase tracking-wider">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 74180 82136"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-pink-500/20 focus:border-pink-500 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-pink-200/80 mb-1.5 uppercase tracking-wider">
                  Portfolio / GitHub
                </label>
                <div className="relative">
                  <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="url"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="e.g. https://github.com/Kaviya-3016"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-pink-500/20 focus:border-pink-500 rounded-xl text-xs text-white placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-center text-[11px] text-slate-400 mt-5">
          100% Open Source under MIT License • Personal data is stored locally.
        </p>
      </div>
    </div>
  );
};
