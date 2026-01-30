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
import {
  Sparkles,
  LayoutDashboard,
  CheckCircle,
  Share2,
  Plus,
  Check
} from 'lucide-react';
import { encodeTasks, decodeTasks } from '@/lib/sharing';
import Image from 'next/image';

function TodoAppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('day');
  const [referenceDate] = useState(new Date());
  const [sharedTasks, setSharedTasks] = useState<Task[] | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const searchParams = useSearchParams();
  const router = {
    replace: (url: string) => window.history.replaceState({}, '', url)
  };

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
      if (decoded.length > 0) {
        setSharedTasks(decoded);
      }
    }
  }, [searchParams]);

  const clearShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('tasks');
    router.replace(url.pathname + url.search);
    setSharedTasks(null);
  };

  const filteredTasks = useMemo(() => {
    return filterTasksByView(currentView, referenceDate);
  }, [filterTasksByView, currentView, referenceDate, tasks]);

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const handleShare = () => {
    const todayTasks = filterTasksByView('day', new Date());
    if (todayTasks.length === 0) {
      alert('No tasks to share for today!');
      return;
    }

    const encoded = encodeTasks(todayTasks);
    const url = `${window.location.origin}${window.location.pathname}?tasks=${encoded}`;

    navigator.clipboard.writeText(url).then(() => {
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ai-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ai-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-dvh bg-ai-navy relative overflow-hidden pb-24">
      {/* Background Effects */}
      <div className="fixed -top-1/4 -left-1/4 w-[70%] h-[50%] bg-ai-purple/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 -right-1/4 w-[60%] h-[40%] bg-ai-cyan/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-lg shadow-ai-purple/30 shrink-0">
              <Image
                src="/logo.png"
                alt="One1 Todo Logo"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/40">
              One1 Todo
            </h1>
          </div>

          <div className="w-full sm:w-auto overflow-x-auto">
            <ViewSwitcher
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </header>

        {/* Shared Tasks */}
        <AnimatePresence>
          {sharedTasks && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <GlassCard className="border-ai-cyan/30 bg-ai-cyan/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 text-ai-cyan">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold">
                      Suraj shared tasks with you!
                    </span>
                  </div>
                  <button
                    onClick={clearShareUrl}
                    className="text-white/40 hover:text-white transition"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="grid gap-2">
                  {sharedTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                    >
                      <CheckCircle className="w-4 h-4 text-ai-cyan/60 mt-0.5" />
                      <span className="text-sm">{task.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    sharedTasks.forEach(t =>
                      addTask(t.text, t.priority)
                    );
                    clearShareUrl();
                  }}
                  className="mt-4 w-full py-3 bg-ai-cyan text-ai-navy font-bold rounded-xl"
                >
                  Import tasks
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Action */}
        <GlassCard glow className="border-ai-purple/20 mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2 text-ai-purple">
            <Plus className="w-5 h-5" />
            Quick Action
          </h2>
          <TaskInput onAdd={addTask} />
        </GlassCard>

        {/* Active Tasks */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-ai-cyan" />
              Active Tasks
              <span className="ml-2 text-xs bg-white/5 px-2 py-0.5 rounded-md text-white/40">
                {activeTasks.length}
              </span>
            </h2>

            <button
              onClick={handleShare}
              disabled={activeTasks.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-bold disabled:opacity-30"
            >
              {isCopying ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
              {isCopying ? 'Link Copied' : 'Share Today'}
            </button>
          </div>

          <div className="grid gap-3">
            <AnimatePresence>
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
                  className="p-10 text-center rounded-xl border border-dashed border-white/10"
                >
                  <p className="text-white/30">
                    No active tasks for this {currentView}.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Completed */}
        {completedTasks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="text-xs uppercase tracking-wider text-white/30 flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4" />
              Completed
            </h3>
            <div className="grid gap-3">
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-ai-navy flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-ai-purple border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TodoAppContent />
    </Suspense>
  );
}
