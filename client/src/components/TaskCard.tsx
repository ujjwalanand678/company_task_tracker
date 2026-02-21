import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../types';
import { Clock, CheckCircle2, Trash2, Edit3, User as UserIcon } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isAdminView?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, isAdminView = false }) => {
  const isCompleted = task.status === 'completed';

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        group glass-card rounded-[1.5rem] p-6 transition-all duration-500 relative overflow-hidden
        ${isCompleted ? 'opacity-80' : 'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]'}
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
          px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5
          ${isCompleted 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-blue-50 text-blue-600 border border-blue-100'}
        `}>
          {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {task.status}
        </span>
        
        <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
          {isAdminView ? (
            <>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-500/50 rounded-xl transition-all shadow-sm"
                title="Edit Task"
              >
                <Edit3 className="w-3 h-3" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(task.id)}
                className="p-2.5 bg-[var(--background)] border border-[var(--card-border)] text-red-500 opacity-70 hover:opacity-100 hover:bg-red-500/10 hover:border-red-500/50 rounded-lg transition-all shadow-lg backdrop-blur-md"
                title="Delete Task"
              >
                <Trash2 className="w-3 h-3" />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit({ ...task, status: isCompleted ? 'pending' : 'completed' })}
              className={`
                px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm
                ${isCompleted 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'}
              `}
            >
              {isCompleted ? 'Mark Pending' : 'Mark Complete'}
            </motion.button>
          )}
        </div>
      </div>

      <h3 className={`text-lg font-black mb-2 leading-tight tracking-tight transition-all font-['Outfit'] ${isCompleted ? 'text-[var(--foreground)] opacity-40 line-through' : 'text-[var(--foreground)]'}`}>
        {task.title}
      </h3>
      
      <p className={`text-[13px] mb-6 line-clamp-3 leading-relaxed font-medium transition-all ${isCompleted ? 'text-[var(--fg-muted)] line-through opacity-60' : 'text-[var(--fg-secondary)]'}`}>
        {task.description}
      </p>

      {(isAdminView || task.userId) && (
        <div className="pt-6 border-t border-[var(--card-border)] flex items-center justify-between relative z-10 transition-all group-hover:border-primary-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 border border-primary-500/10">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assignee</span>
              <span className="text-xs font-bold text-slate-600 uppercase">
                {isAdminView ? (task.user?.email || `User_${task.userId.toString().substring(0, 4)}`) : 'Assigned to Me'}
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
