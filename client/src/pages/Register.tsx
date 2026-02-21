import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import AnimatedPage from '../components/AnimatedPage';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  role: z.enum(['user', 'admin']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
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

        <div className="w-full max-w-lg relative z-10 py-8">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 md:p-10">
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-600/20">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Join TaskFlow</h1>
              <p className="text-slate-500 mt-1 text-center font-medium text-sm">Start managing your tasks with style</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                  <input
                    {...registerField('name')}
                    id="name"
                    type="text"
                    className={`w-full bg-slate-50 border ${
                      errors.name ? 'border-red-500' : 'border-slate-200'
                    } rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all`}
                    placeholder="E.g. John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                  <input
                    {...registerField('email')}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-bold text-slate-700 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                    <input
                      {...registerField('password')}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full bg-slate-50 border ${
                        errors.password ? 'border-red-500' : 'border-slate-200'
                      } rounded-2xl py-4 pl-12 pr-12 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 ml-1">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-all" />
                    <input
                      {...registerField('confirmPassword')}
                      type={showPassword ? "text" : "password"}
                      className={`w-full bg-slate-50 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-slate-200'
                      } rounded-2xl py-4 pl-12 pr-12 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                   {errors.confirmPassword && (
                    <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 ml-1">Role Configuration</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center transition-all ${
                    selectedRole === 'user' 
                      ? 'bg-blue-50 border-blue-500 ring-4 ring-blue-500/5' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}>
                    <input type="radio" value="user" {...registerField('role')} className="hidden" />
                    <UserIcon className={`w-5 h-5 mb-1.5 ${selectedRole === 'user' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'user' ? 'text-blue-600' : 'text-slate-500'}`}>User</span>
                  </label>
                  <label className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center transition-all ${
                    selectedRole === 'admin' 
                      ? 'bg-amber-50 border-amber-500 ring-4 ring-amber-500/5' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                  }`}>
                    <input type="radio" value="admin" {...registerField('role')} className="hidden" />
                    <Shield className={`w-5 h-5 mb-1.5 ${selectedRole === 'admin' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'admin' ? 'text-amber-600' : 'text-slate-500'}`}>Administrator</span>
                  </label>
                </div>
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
                    <span>Create Account</span>
                    <UserPlus className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                Established account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-extrabold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

    </AnimatedPage>
  );
};

export default Register;
