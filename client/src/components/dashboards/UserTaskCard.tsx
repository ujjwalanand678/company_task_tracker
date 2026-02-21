import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types';
import { Clock, CheckCircle2, User as UserIcon } from 'lucide-react';

interface UserTaskCardProps {
  task: Task;
  onStatusToggle: (data: any, taskId: number) => void;
  onViewDetails: (task: Task) => void;
}

const UserTaskCard: React.FC<UserTaskCardProps> = ({ task, onStatusToggle, onViewDetails }) => {
  const isCompleted = task.status === 'completed';

  return (
    <motion.div 
      whileHover={{ x: 8 }}
      className={`
        group glass-card rounded-[1.25rem] p-4 px-5 transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-center gap-6
        ${isCompleted ? 'opacity-80' : 'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]'}
      `}
    >
      <div className="absolute top-4 left-4 z-10">
        <span className={`
          px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0
          ${isCompleted 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border border-amber-100'}
        `}>
          {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {isCompleted ? 'Complete' : 'Pending'}
        </span>
      </div>

      <div className="flex-1 min-w-0 pt-4">
        <div className="flex items-center gap-3 mb-1">
          <h3 className={`text-lg font-black leading-tight tracking-tight transition-all font-['Outfit'] truncate ${isCompleted ? 'text-[var(--foreground)] opacity-40 line-through' : 'text-[var(--foreground)]'}`}>
            {task.title}
          </h3>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            Created {new Date(task.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-slate-200" />
          <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">
            ID #{task.id}
          </span>
        </div>

        {/* <p className={`text-[13px] line-clamp-2 leading-relaxed font-medium transition-all max-w-2xl ${isCompleted ? 'text-[var(--fg-muted)] line-through opacity-60' : 'text-slate-600'}`}>
          {task.description || 'No additional context provided for this workspace assignment.'}
        </p> */}
      </div>

      <div className="flex items-center gap-8 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-500 border border-primary-500/10 shadow-inner">
            <UserIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">Assigned By</span>
            <span className="text-sm font-black text-slate-900 uppercase leading-none truncate max-w-[160px]">
              {task.creator?.name || 'Administrator'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(task);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-[10px] uppercase tracking-wider hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
          >
            <span>Details</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onStatusToggle({ status: isCompleted ? 'pending' : 'completed' }, task.id);
            }}
            className={`
              px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2
              ${isCompleted 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20' 
                : 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20'}
            `}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Task Finished</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Click to Finish</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserTaskCard;
