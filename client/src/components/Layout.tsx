import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, CheckCircle, Search, Menu, X, User as UserIcon, Shield, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  onCreateTask?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onCreateTask }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-[var(--card-bg)] border-b border-[var(--card-border)] p-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-xl bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] transition-all active:scale-95">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[var(--foreground)] opacity-70">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className={`
        fixed inset-0 z-40 md:relative md:flex flex-col w-64 bg-[var(--card-bg)] border-r border-[var(--card-border)] transition-transform duration-300 md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">TaskFlow</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                ${location.pathname === item.path 
                  ? 'bg-primary-600/10 text-primary-500 font-bold' 
                  : 'text-[var(--foreground)] opacity-60 hover:opacity-100 hover:bg-[var(--background)]'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          
          <button
            onClick={onCreateTask}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-primary-400 hover:bg-primary-600/10 transition-all mt-4 border border-primary-500/20"
          >
            <PlusCircle className="w-5 h-5" />
            New Task
          </button>
        </nav>

        <div className="p-4 border-t border-[var(--card-border)]">
          <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full flex items-center justify-center text-[var(--foreground)] opacity-80">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">{user?.email}</p>
                <p className="text-xs text-[var(--foreground)] opacity-50 capitalize flex items-center gap-1">
                  {user?.role === 'admin' && <Shield className="w-3 h-3 text-amber-500" />}
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-sm font-bold transition-all"
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
        <div className="hidden md:flex items-center justify-between p-6 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="relative w-96 font-medium">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)] opacity-40" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl py-2.5 pl-11 pr-4 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--background)] transition-all shadow-sm active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={onCreateTask}
              className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-600/30 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
