import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Loader2, CheckCircle2, Clock, PlusCircle, Edit3 } from 'lucide-react';
import type { Task } from '../types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500),
  status: z.enum(['pending', 'completed']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Task | null;
  isLoading?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
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
      status: 'pending',
    },
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
      });
    } else {
      reset({ title: '', description: '', status: 'pending' });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-[var(--card-border)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500 shadow-inner">
              {initialData ? <Edit3 className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
            </div>
            <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">
              {initialData ? 'Refine Objective' : 'New Objective'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] opacity-50 hover:opacity-100 transition-all hover:rotate-90">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          <div className="space-y-2">
            <label htmlFor="task-title" className="block text-sm font-bold text-[var(--foreground)] opacity-60 ml-1 uppercase tracking-widest">Title</label>
            <input
              {...register('title')}
              id="task-title"
              className={`w-full bg-[var(--background)] border ${
                errors.title ? 'border-red-500' : 'border-[var(--card-border)]'
              } rounded-2xl py-4 px-5 text-[var(--foreground)] font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-lg`}
              placeholder="What's the goal?"
            />
            {errors.title && (
              <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="task-desc" className="block text-sm font-bold text-[var(--foreground)] opacity-60 ml-1 uppercase tracking-widest">Documentation</label>
            <textarea
              {...register('description')}
              id="task-desc"
              rows={4}
              className="w-full bg-[var(--background)] border border-[var(--card-border)] rounded-2xl py-4 px-5 text-[var(--foreground)] font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none leading-relaxed"
              placeholder="Provide strategic details..."
            />
            {errors.description && (
              <p className="mt-2 text-xs text-red-500 font-bold ml-1">{errors.description.message}</p>
            )}
          </div>

          {initialData && (
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[var(--foreground)] opacity-60 ml-1 uppercase tracking-widest">Current Status</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('status', 'pending')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${
                    selectedStatus === 'pending' 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-inner' 
                      : 'bg-[var(--background)] border-[var(--card-border)] text-[var(--foreground)] opacity-40'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Pending</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('status', 'completed')}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${
                    selectedStatus === 'completed' 
                      ? 'bg-green-500/10 border-green-500 text-green-500 shadow-inner' 
                      : 'bg-[var(--background)] border-[var(--card-border)] text-[var(--foreground)] opacity-40'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4.5 px-6 rounded-2xl border border-[var(--card-border)] text-[var(--foreground)] opacity-60 font-black text-sm uppercase tracking-widest hover:opacity-100 hover:bg-[var(--background)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] bg-primary-600 hover:bg-primary-500 disabled:opacity-70 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 text-lg active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <span>{initialData ? 'Update Goal' : 'Deploy Task'}</span>
                  {initialData ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
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
