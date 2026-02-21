import React, { useState } from 'react';
import UserTaskCard from './UserTaskCard';
import UserTaskDetailsModal from './UserTaskDetailsModal';
import type { Task } from '../../types';
import { ListTodo, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserDashboardProps {
  tasks: Task[];
  onStatusToggle: (task: Task) => Promise<void>;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ tasks, onStatusToggle }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-12">
      <UserTaskDetailsModal 
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card rounded-[2rem] p-8 flex lg:flex-row flex-col items-center gap-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
        >
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary-500/5" />
              <motion.circle
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364.4}
                initial={{ strokeDashoffset: 364.4 }} animate={{ strokeDashoffset: 364.4 - (364.4 * completionRate) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-primary-500" strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-primary-600">{completionRate}%</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Done</span>
            </div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-black mb-2 font-['Outfit']">Your Progress</h3>
            <p className="text-slate-500 text-sm font-medium">Keep going! You have completed {completedCount} tasks so far.</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[2rem] p-8 flex flex-col justify-center text-center group hover:shadow-2xl transition-all">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto"><ListTodo className="w-6 h-6" /></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">To Do</p>
          <h3 className="text-4xl font-black text-slate-900 font-['Outfit']">{tasks.length - completedCount}</h3>
        </motion.div>
      </section>

      <section className="relative z-10">
        <div className="mb-12">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">My Assigned Tasks</h2>
          <p className="text-slate-500 text-sm font-medium">Manage and track your private workspace.</p>
        </div>

        {tasks.length === 0 ? (
          <div className="glass-card border-2 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center opacity-60">
            <CheckCircle className="w-16 h-16 text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-400">All caught up! No tasks assigned yet.</h3>
          </div>
        ) : (
          <div className="space-y-6 max-w-5xl mx-auto">
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <motion.div 
                  key={task.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.05 }} 
                  layout
                >
                  <UserTaskCard 
                    task={task} 
                    onStatusToggle={onStatusToggle} 
                    onViewDetails={setSelectedTask} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;
