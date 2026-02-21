import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TaskModal from '../components/TaskModal';
import type { Task } from '../types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle } from 'lucide-react';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import UserDashboard from '../components/dashboards/UserDashboard';

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

  const handleUpdateTask = async (data: any, taskId?: number) => {
    const id = taskId || editingTask?.id;
    if (!id) return;
    
    setModalLoading(true);
    try {
      await api.put(`/tasks/${id}`, data);
      await fetchData();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to update task');
    } finally {
      setModalLoading(false);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-[var(--fg-secondary)] font-bold uppercase tracking-widest text-xs">Loading Tasks...</p>
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
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-5%] right-[-10%] w-[35%] h-[35%] bg-blue-400/5 rounded-full blur-[100px]" 
            />
            <motion.div 
              animate={{ 
                x: [0, -30, 0],
                y: [0, 20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[5%] left-[-15%] w-[45%] h-[45%] bg-indigo-400/5 rounded-full blur-[120px]" 
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
                    <p className="text-sm text-red-600 dark:text-red-400 font-bold uppercase tracking-wider">Synchronization Error</p>
                    <p className="text-xs text-red-600 dark:text-red-400 opacity-80 font-medium">{error}</p>
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

          {isAdmin ? (
            <AdminDashboard 
              user={user!}
              fetchData={fetchData}
              tasks={tasks}
              allUsers={allUsers}
              setTasks={setTasks}
              setAllUsers={setAllUsers}
              openEditModal={openEditModal}
              openCreateModal={() => { setEditingTask(null); setIsModalOpen(true); }}
              isLoading={isLoading}
            />
          ) : (
            <UserDashboard 
              tasks={tasks}
              onStatusToggle={handleUpdateTask}
            />
          )}
        </div>
      </AnimatedPage>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        allUsers={allUsers}
        initialData={editingTask}
        isLoading={modalLoading}
      />
    </Layout>
  );
};

export default Dashboard;
