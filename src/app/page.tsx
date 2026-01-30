'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTodoStore } from '@/hooks/useTodoStore';
import { ViewType, Task } from '@/types/todo';
import { ViewSwitcher } from '@/components/ViewSwitcher';
import { TaskInput } from '@/components/TaskInput';
import { TaskItem } from '@/components/TaskItem';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CheckCircle, Share2, Check, Sparkles } from 'lucide-react';
import { encodeTasks, decodeTasks } from '@/lib/sharing';
import Image from 'next/image';

function TodoAppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('day');
  const [referenceDate] = useState(new Date());
  const [sharedTasks, setSharedTasks] = useState<Task[] | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const searchParams = useSearchParams();

  const {
    tasks,
    isLoaded,
    addTask,
    toggleTask,
    deleteTask,
    filterTasksByView
  } = useTodoStore();

  useEffect(() => {
    const encoded = searchParams.get('tasks');
    if (encoded) {
      const decoded = decodeTasks(encoded);
      if (decoded.length) setSharedTasks(decoded);
    }
  }, [searchParams]);

  const clearShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('tasks');
    window.history.replaceState({}, '', url.pathname + url.search);
    setSharedTasks(null);
  };

  const filteredTasks = useMemo(
    () => filterTasksByView(currentView, referenceDate),
    [filterTasksByView, currentView, referenceDate, tasks]
  );

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const handleShare = () => {
    const todayTasks = filterTasksByView('day', new Date());
    if (!todayTasks.length) return alert('No tasks to share today');

    const encoded = encodeTasks(todayTasks);
    const url = `${window.location.origin}${window.location.pathname}?tasks=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-black pb-24 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl shadow-white/5">
              <Image src="/logo.png" alt="logo" fill className="object-cover" priority />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase whitespace-nowrap">
              One1 Todo
            </h1>
          </div>

          <div className="overflow-x-auto pb-2 sm:pb-0">
            <ViewSwitcher
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </header>

        {/* SHARED TASKS POPUP */}
        <AnimatePresence>
          {sharedTasks && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              className="mb-10"
            >
              <GlassCard className="border-white/20 bg-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg">Suraj shared tasks with you!</span>
                  </div>
                  <button
                    onClick={clearShareUrl}
                    className="text-white/40 hover:text-white transition-colors p-2"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="grid gap-3 mb-6">
                  {sharedTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                      <CheckCircle className="w-5 h-5 text-white/30" />
                      <span className="font-medium">{task.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    sharedTasks.forEach(t => addTask(t.text, t.priority));
                    clearShareUrl();
                  }}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all"
                >
                  Import Shared Tasks
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ADD TASK */}
        <div className="mb-12">
          <GlassCard className="border-white/10 p-5">
            <TaskInput onAdd={addTask} />
          </GlassCard>
        </div>

        {/* ACTIVE TASKS */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6" />
              Active Tasks
              <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full text-white/60">
                {activeTasks.length}
              </span>
            </h2>

            <button
              onClick={handleShare}
              disabled={!activeTasks.length}
              className="flex items-center justify-center gap-3 px-6 py-4 sm:py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 active:scale-95 disabled:opacity-20 transition-all uppercase tracking-wider"
            >
              {isCopying ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5 text-white/60" />}
              {isCopying ? 'Link Copied' : 'Share My Day'}
            </button>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {activeTasks.length ? (
                activeTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl"
                >
                  <p className="text-lg font-medium">No active tasks for this {currentView}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* COMPLETED */}
        {completedTasks.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/5">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-3 mb-8">
              <CheckCircle className="w-5 h-5" />
              Completed History
            </h3>

            <div className="grid gap-4 opacity-60 hover:opacity-100 transition-opacity">
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <TodoAppContent />
    </Suspense>
  );
}
