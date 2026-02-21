import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

import AnimatedPage from '../components/AnimatedPage';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
        {/* Simple Decorative Circles */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="w-full max-w-lg relative z-10 py-10">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl p-10 md:p-12">
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Login</h1>
              <p className="text-slate-500 mt-2 text-center font-medium">Access your workspace</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    className={`w-full bg-slate-50 border ${
                      errors.email ? 'border-red-500' : 'border-slate-200'
                    } rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                  <input
                    {...register('password')}
                    id="password"
                    type="password"
                    className={`w-full bg-slate-50 border ${
                      errors.password ? 'border-red-500' : 'border-slate-200'
                    } rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black py-4.5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 mt-6 active:scale-95 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Session</span>
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                Unregistered identity?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-extrabold transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    </AnimatedPage>
  );
};

export default Login;
