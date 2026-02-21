import React, { useState } from 'react';
import AdminTaskCard from './AdminTaskCard';
import AdminTaskDetailModal from './AdminTaskDetailModal';
import type { Task, User } from '../../types';
import api from '../../services/api';
import { Users as UsersIcon, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  user: User;
  fetchData: () => Promise<void>;
  tasks: Task[];
  allUsers: User[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setAllUsers: React.Dispatch<React.SetStateAction<any[]>>;
  openEditModal: (task: Task) => void;
  openCreateModal: () => void;
  isLoading: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  fetchData, tasks, allUsers, setTasks, setAllUsers, openEditModal, openCreateModal, isLoading 
}) => {
  const [selectedDetailTask, setSelectedDetailTask] = useState<Task | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card h-24 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also remove all their tasks.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setAllUsers(allUsers.filter(u => u.id !== id));
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete user');
    }
  };

  // Calculate global completion rate
  const totalTasks = tasks.length;
  const fullyCompletedTasks = tasks.filter(t => 
    t.assignments?.length > 0 && t.assignments.every(a => a.status === 'completed')
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((fullyCompletedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-12">
      <AdminTaskDetailModal 
        isOpen={!!selectedDetailTask}
        onClose={() => setSelectedDetailTask(null)}
        task={selectedDetailTask}
      />

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card rounded-[2rem] p-6 flex lg:flex-row flex-col items-center gap-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
        >
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary-500/5" />
              <motion.circle
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4}
                initial={{ strokeDashoffset: 364.4 }} animate={{ strokeDashoffset: 364.4 - (364.4 * completionRate) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="text-primary-500" strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-[var(--foreground)] font-['Outfit']">{completionRate}%</span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--fg-muted)]">Completion</span>
            </div>
          </div>
          <div className="flex-1 lg:text-left text-center">
            <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight mb-2 font-['Outfit']">Global Progress</h3>
            <p className="text-[var(--fg-secondary)] text-sm font-medium leading-relaxed max-w-sm">
              <span className="text-primary-600 font-black">{fullyCompletedTasks}</span>/{totalTasks} tasks fully completed.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[2rem] p-6 group hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner"><PlusCircle className="w-6 h-6" /></div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100">Tasks</span>
          </div>
          <h3 className="text-4xl font-black text-[var(--foreground)] tracking-tight font-['Outfit']">{tasks.length}</h3>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[2rem] p-6 group hover:shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500 shadow-inner"><UsersIcon className="w-6 h-6" /></div>
            <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">Users</span>
          </div>
          <h3 className="text-4xl font-black text-[var(--foreground)] tracking-tight font-['Outfit']">{allUsers.length}</h3>
        </motion.div>
      </section>

      <section className="relative z-10">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">System Tasks</h2>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={openCreateModal} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </motion.button>
        </div>

        {tasks.length === 0 ? (
          <div className="glass-card border-dashed border-2 rounded-[2.5rem] p-16 flex flex-col items-center justify-center transition-all hover:border-primary-500/20 bg-slate-50/50">
            <PlusCircle className="w-10 h-10 text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-400">No tasks in system</h3>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} layout>
                  <AdminTaskCard 
                    task={task} 
                    onEdit={openEditModal} 
                    onDelete={handleDeleteTask} 
                    onViewDetails={(t) => setSelectedDetailTask(t)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Admin Directory Section */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="pt-24 border-t border-[var(--card-border)]/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight font-['Outfit'] flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
              <UsersIcon className="w-6 h-6" />
            </div>
            Admin Directory
          </h2>
          <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100">
            {allUsers.filter(u => u.role === 'admin').length} Admins
          </span>
        </div>
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                <th className="px-8 py-6 uppercase tracking-[0.4em]">Administrator</th>
                <th className="px-8 py-6 uppercase tracking-[0.4em]">Email Status</th>
                <th className="px-8 py-6 uppercase tracking-[0.4em]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.filter(u => u.role === 'admin').map((u) => (
                <tr key={u.id} className="hover:bg-amber-500/[0.02] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{u.name || 'Admin'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[8px] font-black uppercase tracking-widest">Master Admin</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* User Directory Section */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="pt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight font-['Outfit'] flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
              <UsersIcon className="w-6 h-6" />
            </div>
            User Directory
          </h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
            {allUsers.filter(u => u.role === 'user').length} Workforce
          </span>
        </div>
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                <th className="px-8 py-6 uppercase tracking-[0.4em]">User</th>
                <th className="px-8 py-6 uppercase tracking-[0.4em]">Role</th>
                <th className="px-8 py-6 uppercase tracking-[0.4em]">Joined</th>
                <th className="px-8 py-6 text-right uppercase tracking-[0.4em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.filter(u => u.role === 'user').map((u) => (
                <tr key={u.id} className="hover:bg-primary-500/[0.02] transition-all">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{u.name || 'No Name'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6"><span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest">{u.role}</span></td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => handleDeleteUser(u.id)} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
};

export default AdminDashboard;
