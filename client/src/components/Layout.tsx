import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, CheckCircle, Search, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onCreateTask?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onCreateTask }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">TaskFlow</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className={`
        fixed inset-0 z-40 md:relative md:flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">TaskFlow</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${location.pathname === item.path 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          
          {user?.role === 'admin' && (
            <button
              onClick={onCreateTask}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-blue-600 hover:bg-blue-50 transition-all mt-4 border border-blue-100"
            >
              <PlusCircle className="w-5 h-5" />
              New Task
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar (Desktop) */}
        <div className="hidden md:flex items-center justify-between p-4 px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-11 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={onCreateTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Create Task
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
