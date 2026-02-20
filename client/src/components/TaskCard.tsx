import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../types';
import { Clock, CheckCircle2, Trash2, Edit3, User as UserIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isAdminView?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isAdminView = false }) => {
  const isCompleted = task.status === 'completed';

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group glass-card rounded-[2.5rem] p-8 transition-all duration-500 relative overflow-hidden
        ${isCompleted ? 'opacity-80' : 'shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]'}
      `}
    >
      {/* Decorative background element */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-[60px] transition-colors duration-1000 ${isCompleted ? 'bg-green-500/20' : 'bg-primary-500/20'}`} 
      />

      <div className="flex items-start justify-between mb-5 relative z-10">
        <span className={`
          px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2
          ${isCompleted 
            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
            : 'bg-primary-500/10 text-primary-500 border border-primary-500/20'}
        `}>
          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          {task.status}
        </span>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="p-3 bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] opacity-70 hover:opacity-100 hover:text-primary-500 hover:border-primary-500/50 rounded-xl transition-all shadow-lg backdrop-blur-md"
            title="Refine mission"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task.id)}
            className="p-3 bg-[var(--background)] border border-[var(--card-border)] text-red-500 opacity-70 hover:opacity-100 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl transition-all shadow-lg backdrop-blur-md"
            title="Terminate link"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      <h3 className={`text-xl font-black mb-3 leading-tight tracking-tight transition-all font-['Outfit'] ${isCompleted ? 'text-[var(--foreground)] opacity-40 line-through' : 'text-[var(--foreground)]'}`}>
        {task.title}
      </h3>
      
      <p className={`text-sm mb-8 line-clamp-3 leading-relaxed font-medium transition-all ${isCompleted ? 'text-[var(--foreground)] opacity-30' : 'text-[var(--foreground)] opacity-50'}`}>
        {task.description}
      </p>

      {(isAdminView || task.userId) && (
        <div className="pt-6 border-t border-[var(--card-border)] flex items-center justify-between relative z-10 transition-all group-hover:border-primary-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 border border-primary-500/10">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[var(--foreground)] opacity-20 uppercase tracking-[0.1em]">Assigned To</span>
              <span className="text-xs font-black text-[var(--foreground)] opacity-60 uppercase tracking-tighter">
                {isAdminView ? `Asset_${task.userId.toString().substring(0, 4)}` : 'Initiator'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[var(--foreground)] opacity-30 font-black tracking-widest uppercase">
              {new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
