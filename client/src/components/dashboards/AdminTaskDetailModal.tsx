import React from 'react';
import { motion } from 'framer-motion';
import { X, Users as UsersIcon, CheckCircle2, Clock, Calendar } from 'lucide-react';
import type { Task } from '../../types';

interface AdminTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const AdminTaskDetailModal: React.FC<AdminTaskDetailModalProps> = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;

  const totalAssignments = task.assignments?.length || 0;
  const completedAssignments = task.assignments?.filter(a => a.status === 'completed').length || 0;
  const progressPercent = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
              <UsersIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight font-['Outfit'] mb-1">
                {task.title}
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(task.created_at).toLocaleDateString()}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span>Task ID: #{task.id}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-2xl transition-all shadow-sm">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-8 space-y-10 customized-scrollbar flex-1">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description</h3>
            <p className="text-lg text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-3xl border border-slate-100">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Assignment Progress</h3>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                {completedAssignments}/{totalAssignments} Completed
              </span>
            </div>

            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={`h-full rounded-full ${progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'} shadow-lg`}
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {task.assignments?.map((assignment) => (
                <div 
                  key={assignment.id}
                  className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-blue-500/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${
                      assignment.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {(assignment.user?.name || assignment.user?.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-none mb-1">{assignment.user?.name || assignment.user?.email}</h4>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Member</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                      assignment.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {assignment.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {assignment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="p-8 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20"
          >
            Close Details
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AdminTaskDetailModal;
