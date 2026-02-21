import React from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types';
import { Trash2, Edit3, ChevronRight } from 'lucide-react';

interface AdminTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onViewDetails: (task: Task) => void;
}

const AdminTaskCard: React.FC<AdminTaskCardProps> = ({ task, onEdit, onDelete, onViewDetails }) => {
  const totalAssignments = task.assignments?.length || 0;
  const completedAssignments = task.assignments?.filter(a => a.status === 'completed').length || 0;
  const progressPercent = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group glass-card rounded-2xl p-4 px-5 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition-all duration-300 border border-slate-100"
    >
      <div className="absolute top-4 left-4 z-10">
        <span className={`px-2.5 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
          progressPercent === 100 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-100'
        }`}>
          {progressPercent === 100 ? 'Done' : 'In Progress'}
        </span>
      </div>

      <div className="flex-1 min-w-0 w-full pt-4">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-black text-slate-900 truncate font-['Outfit']">
            {task.title}
          </h3>
        </div>
        {/* <p className="text-sm text-slate-500 line-clamp-1 font-medium">
          {task.description || 'No description provided.'}
        </p> */}
      </div>

      <div className="flex items-center gap-8 w-full md:w-auto flex-shrink-0">
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200" />
              <motion.circle
                cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={113.1}
                initial={{ strokeDashoffset: 113.1 }} animate={{ strokeDashoffset: 113.1 - (113.1 * progressPercent) / 100 }}
                className="text-blue-500" strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-black text-slate-700">{progressPercent}%</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
            <span className="text-xs font-black text-slate-700">
              {completedAssignments}/{totalAssignments} Users
            </span>
          </div>
        </div>

        <button 
          onClick={() => onViewDetails(task)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold text-xs hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm group/btn"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
          <button 
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminTaskCard;
