import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, Loader2, Check, Shield } from 'lucide-react';
import api from '../services/api';

import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  role: z.enum(['USER', 'ADMIN']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'USER',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)] overflow-hidden relative">
        <AnimatePresence>
          {isSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--background)]/80 backdrop-blur-md"
            >
              <motion.div 
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] shadow-2xl p-12 text-center"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <Check className="w-12 h-12 text-green-500" />
                </motion.div>
                <h1 className="text-4xl font-black text-[var(--foreground)] mb-4 tracking-tight">Success!</h1>
                <p className="text-[var(--foreground)] opacity-60 font-medium">Your account is ready. Redirecting...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Background Elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" 
        />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-lg relative z-10 py-10"
        >
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] shadow-2xl p-10 md:p-12 backdrop-blur-sm">
            <div className="flex flex-col items-center mb-10">
              <motion.div 
                whileHover={{ rotate: -12, scale: 1.1 }}
                className="w-20 h-20 bg-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-primary-600/30 transform -rotate-12"
              >
                <UserPlus className="w-10 h-10 text-white transform rotate-12" />
              </motion.div>
              <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tight">Join TaskFlow</h1>
              <p className="text-[var(--foreground)] opacity-50 mt-2 text-center font-medium">Start managing your tasks with style</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-500 font-bold">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-[var(--foreground)] opacity-70 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)] opacity-40 group-focus-within:text-primary-500 group-focus-within:opacity-100 transition-all" />
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    className={`w-full bg-[var(--background)] border ${
                      errors.email ? 'border-red-500' : 'border-[var(--card-border)]'
                    } rounded-2xl py-4 pl-12 pr-4 text-[var(--foreground)] font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-bold text-[var(--foreground)] opacity-70 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)] opacity-40 group-focus-within:text-primary-500 group-focus-within:opacity-100 transition-all" />
                    <input
                      {...register('password')}
                      id="password"
                      type="password"
                      className={`w-full bg-[var(--background)] border ${
                        errors.password ? 'border-red-500' : 'border-[var(--card-border)]'
                      } rounded-2xl py-4 pl-12 pr-4 text-[var(--foreground)] font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[var(--foreground)] opacity-70 ml-1">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground)] opacity-40 group-focus-within:text-primary-500 group-focus-within:opacity-100 transition-all" />
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      className={`w-full bg-[var(--background)] border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-[var(--card-border)]'
                      } rounded-2xl py-4 pl-12 pr-4 text-[var(--foreground)] font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-[var(--foreground)] opacity-70 ml-1">Role Configuration</label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.label 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                    selectedRole === 'USER' 
                      ? 'bg-primary-500/10 border-primary-500 ring-2 ring-primary-500/20' 
                      : 'bg-[var(--background)] border-[var(--card-border)] opacity-60 hover:opacity-100'
                  }`}
                  >
                    <input type="radio" value="USER" {...register('role')} className="hidden" />
                    <UserIcon className={`w-6 h-6 mb-2 ${selectedRole === 'USER' ? 'text-primary-500' : 'text-[var(--foreground)]'}`} />
                    <span className={`text-xs font-black uppercase tracking-widest ${selectedRole === 'USER' ? 'text-primary-500' : 'text-[var(--foreground)]'}`}>Standard</span>
                    {selectedRole === 'USER' && (
                      <motion.div layoutId="role-indicator" className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </motion.label>
                  <motion.label 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                    selectedRole === 'ADMIN' 
                      ? 'bg-primary-500/10 border-primary-500 ring-2 ring-primary-500/20' 
                      : 'bg-[var(--background)] border-[var(--card-border)] opacity-60 hover:opacity-100'
                  }`}
                  >
                    <input type="radio" value="ADMIN" {...register('role')} className="hidden" />
                    <Shield className={`w-6 h-6 mb-2 ${selectedRole === 'ADMIN' ? 'text-primary-500' : 'text-[var(--foreground)]'}`} />
                    <span className={`text-xs font-black uppercase tracking-widest ${selectedRole === 'ADMIN' ? 'text-primary-500' : 'text-[var(--foreground)]'}`}>Admin</span>
                    {selectedRole === 'ADMIN' && (
                      <motion.div layoutId="role-indicator" className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full" />
                    )}
                  </motion.label>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 mt-6 active:scale-95 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Account</span>
                    <UserPlus className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[var(--foreground)] opacity-50 font-medium">
                Established account?{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-400 font-extrabold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Register;
