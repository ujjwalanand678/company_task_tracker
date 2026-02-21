import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2, CheckCircle2, Clock, PlusCircle, Edit3, Users as UsersIcon } from 'lucide-react';
import type { Task, User } from '../types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  assignedUserIds: z.array(z.number()).min(1, 'At least one user must be assigned'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  allUsers: User[];
  initialData?: Task | null;
  isLoading?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, allUsers, initialData, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedUserIds: [],
    },
  });

  const selectedUserIds = watch('assignedUserIds') || [];

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        assignedUserIds: initialData.assignments?.map(a => a.userId) || [],
      });
    } else {
      reset({ title: '', description: '', assignedUserIds: [] });
    }
  }, [initialData, reset, isOpen]);

  const toggleUser = (userId: number) => {
    const current = [...selectedUserIds];
    const index = current.indexOf(userId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(userId);
    }
    setValue('assignedUserIds', current, { shouldValidate: true });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
              {initialData ? <Edit3 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {initialData ? 'Edit Task' : 'New Task'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="task-title" className="block text-sm font-bold text-slate-700 ml-1">Title</label>
            <input
              {...register('title')}
              id="task-title"
              className={`w-full bg-slate-50 border ${
                errors.title ? 'border-red-500' : 'border-slate-200'
              } rounded-xl py-3 px-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all`}
              placeholder="Task name"
            />
            {errors.title && (
              <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="task-desc" className="block text-sm font-bold text-slate-700 ml-1">Description</label>
            <textarea
              {...register('description')}
              id="task-desc"
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none"
              placeholder="Task description"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-slate-400" />
                Assign Users
              </label>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
                {selectedUserIds.length} Selected
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1 customized-scrollbar">
              {allUsers.filter(u => u.role === 'user').map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggleUser(user.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedUserIds.includes(user.id)
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${selectedUserIds.includes(user.id) ? 'bg-blue-600 animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-sm font-bold">{user.email}</span>
                  </div>
                  {selectedUserIds.includes(user.id) && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
            {errors.assignedUserIds && (
              <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.assignedUserIds.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-2 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{initialData ? 'Update' : 'Create'}</span>
                  {initialData ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
