import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import type { Task } from '../types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, ListTodo, Users as UsersIcon, AlertTriangle, PlusCircle } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tasksRes = await api.get('/tasks');
      setTasks(tasksRes.data);

      if (isAdmin) {
        const usersRes = await api.get('/admin/users');
        setAllUsers(usersRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const handleCreateTask = async (data: any) => {
    setModalLoading(true);
    try {
      await api.post('/tasks', data);
      await fetchData();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!editingTask) return;
    setModalLoading(true);
    try {
      await api.put(`/tasks/${editingTask.id}`, data);
      await fetchData();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update task');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete task');
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-[var(--foreground)] opacity-40 font-bold uppercase tracking-widest text-xs">Syncing Data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <Layout onCreateTask={() => { setEditingTask(null); setIsModalOpen(true); }}>
      <AnimatedPage>
        <div className="space-y-12 pb-20 relative">
          {/* Production Level Background Decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                x: [0, 50, 0],
                y: [0, -30, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -50, 0],
                y: [0, 30, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[10%] left-[-5%] w-[50%] h-[50%] bg-primary-600/5 rounded-full blur-[140px]" 
            />
          </div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="relative z-20 mb-8"
              >
                <div className="glass-card border-red-500/20 bg-red-500/5 rounded-3xl p-6 flex items-center gap-6 overflow-hidden">
                  <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-red-500 font-bold uppercase tracking-wider">Synchronization Error</p>
                    <p className="text-xs text-red-500 opacity-60 font-medium">{error}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchData} 
                    className="px-8 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                  >
                    Recalibrate
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header/Stats Section */}
          <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass-card rounded-[3rem] p-8 flex lg:flex-row flex-col items-center gap-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
              
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-primary-500/5"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 - (364.4 * completionRate) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="text-primary-500"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[var(--foreground)] font-['Outfit']">{completionRate}%</span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">Efficiency</span>
                </div>
              </div>
              <div className="flex-1 lg:text-left text-center">
                <h3 className="text-2xl font-black text-[var(--foreground)] tracking-tight mb-2 font-['Outfit']">Workspace Health</h3>
                <p className="text-[var(--foreground)] opacity-40 text-sm font-medium leading-relaxed max-w-sm">
                  Strategic objectives: <span className="text-primary-500 font-black">{completedCount}</span> finalized. Total missions deployed: <span className="text-[var(--foreground)] font-black opacity-100">{tasks.length}</span>.
                </p>
                <div className="mt-5 flex gap-2 lg:justify-start justify-center">
                  <span className="px-4 py-1.5 bg-primary-500/10 rounded-xl text-primary-500 text-[9px] font-black uppercase tracking-[0.15em] border border-primary-500/20">System Performance: Optimal</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[3rem] p-8 relative overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
                  <ListTodo className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10">Active Queue</span>
              </div>
              <p className="text-[var(--foreground)] opacity-30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pending Sync</p>
              <h3 className="text-4xl font-black text-[var(--foreground)] tracking-tight font-['Outfit']">{tasks.length - completedCount}</h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-[3rem] p-8 relative overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500 shadow-inner">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black text-primary-500 bg-primary-500/5 px-2.5 py-1 rounded-lg border border-primary-500/10">Access Hub</span>
              </div>
              <p className="text-[var(--foreground)] opacity-30 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Network Base</p>
              <h3 className="text-4xl font-black text-[var(--foreground)] tracking-tight font-['Outfit']">{isAdmin ? allUsers.length : 'Verified'}</h3>
            </motion.div>
          </section>

          {/* Tasks Section */}
          <section className="relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight font-['Outfit']">
                  {isAdmin ? 'System Modules' : 'Task Board'}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-[var(--foreground)] opacity-20 uppercase tracking-[0.4em]">Live Task Feed</span>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                className="glass-card text-[var(--foreground)] hover:border-primary-500 hover:text-primary-500 p-4.5 rounded-[1.5rem] transition-all shadow-xl active:scale-95"
              >
                <Plus className="w-6 h-6" />
              </motion.button>
            </div>

            {tasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card border-dashed border-2 border-[var(--card-border)] rounded-[4rem] p-24 md:p-32 flex flex-col items-center justify-center text-center transition-all hover:border-primary-500/20 backdrop-blur-md"
              >
                <div className="w-24 h-24 glass-card border rounded-full flex items-center justify-center mb-10 shadow-3xl relative overflow-hidden group">
                  <PlusCircle className="w-10 h-10 text-[var(--foreground)] opacity-10 group-hover:scale-110 transition-transform" />
                  <motion.div 
                    animate={{ scale: [1, 2, 1], opacity: [0.05, 0, 0.05] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-primary-500 rounded-full"
                  />
                </div>
                <h3 className="text-3xl font-black text-[var(--foreground)] mb-4 tracking-tight font-['Outfit']">Void Detected</h3>
                <p className="text-[var(--foreground)] opacity-30 max-w-sm mb-12 font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em]">Deploy your first priority module to begin synchronization.</p>
                <motion.button 
                  whileHover={{ scale: 1.02, translateY: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-14 py-6 rounded-[2.5rem] text-xs font-black flex items-center gap-4 transition-all shadow-2xl shadow-primary-600/40 uppercase tracking-[0.15em] group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  Initialize Deployment
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.06 
                      }}
                      layout
                    >
                      <TaskCard 
                        task={task} 
                        onEdit={openEditModal} 
                        onDelete={handleDeleteTask}
                        isAdminView={isAdmin}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </section>

          {/* User Directory for Admin */}
          {isAdmin && allUsers.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-24 border-t border-[var(--card-border)]/50"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight font-['Outfit'] flex items-center gap-5">
                    <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-primary-500">
                      <UsersIcon className="w-6 h-6" />
                    </div>
                    Personnel Registry
                  </h2>
                  <span className="text-[10px] font-black text-[var(--foreground)] opacity-20 uppercase tracking-[0.5em] ml-1">Classified / Elevated Clearances</span>
                </div>
              </div>
              
              <div className="glass-card rounded-[3.5rem] overflow-hidden shadow-2xl hover:border-primary-500/20 transition-all duration-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--foreground)]/[0.02] border-b border-[var(--card-border)]/50">
                        <th className="px-10 py-8 text-[10px] font-black text-[var(--foreground)] opacity-20 uppercase tracking-[0.4em]">Identity</th>
                        <th className="px-10 py-8 text-[10px] font-black text-[var(--foreground)] opacity-20 uppercase tracking-[0.4em]">Clearance</th>
                        <th className="px-10 py-8 text-[10px] font-black text-[var(--foreground)] opacity-20 uppercase tracking-[0.4em]">Establishment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--card-border)]/30">
                      {allUsers.map((u: any, idx: number) => (
                        <motion.tr 
                          key={u.id} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          viewport={{ once: true }}
                          className="hover:bg-primary-500/[0.02] transition-all group cursor-default"
                        >
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-6">
                              <div className="w-11 h-11 rounded-2xl glass-card flex items-center justify-center text-primary-500 font-black text-xs shadow-inner group-hover:scale-110 group-hover:bg-primary-500/10 transition-all duration-500">
                                {u.email.substring(0, 1).toUpperCase()}
                              </div>
                              <span className="text-base font-bold text-[var(--foreground)] opacity-70 group-hover:opacity-100 group-hover:text-primary-500 transition-all tracking-tight">{u.email}</span>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] ${
                              u.role === 'admin' 
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                                : 'bg-primary-500/10 text-primary-600 border border-primary-500/20'
                            }`}>
                              {u.role === 'admin' ? 'Commander' : 'Operator'}
                            </span>
                          </td>
                          <td className="px-10 py-8">
                            <span className="text-[10px] font-black text-[var(--foreground)] opacity-20 tracking-[0.2em] uppercase">
                              {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </AnimatedPage>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        initialData={editingTask}
        isLoading={modalLoading}
      />
    </Layout>
  );
};

export default Dashboard;
