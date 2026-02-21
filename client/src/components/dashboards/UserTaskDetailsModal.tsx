import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User as UserIcon, FileText } from 'lucide-react';
import type { Task } from '../../types';

interface UserTaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const UserTaskDetailsModal: React.FC<UserTaskDetailsModalProps> = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
                    Task Brief
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read-Only View</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto customized-scrollbar flex-1">
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">{task.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {new Date(task.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                      Assigned by {task.creator?.name || 'Admin'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Detailed Description</h4>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[120px]">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                      {task.description || 'No additional details provided.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* <div className="p-8 border-t border-slate-100 shrink-0">
              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl transition-all shadow-lg hover:bg-slate-800 active:scale-[0.98] uppercase tracking-widest text-xs"
              >
                Close Briefing
              </button>
            </div> */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserTaskDetailsModal;
