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
import { Sparkles, LayoutDashboard, CheckCircle, Share2, Plus, Copy, Check } from 'lucide-react';
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
  const { tasks, isLoaded, addTask, toggleTask, deleteTask, filterTasksByView } = useTodoStore();

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
      alert("No tasks to share for today!");
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
    <main className="min-h-dvh bg-ai-navy relative overflow-hidden pb-20">
      {/* Background Blobs - Fixed for smoother performance */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[40%] bg-ai-purple/20 blur-[120px] rounded-full animate-ai-float pointer-events-none" />
      <div className="fixed bottom-[10%] right-[-10%] w-[50%] h-[30%] bg-ai-cyan/10 blur-[100px] rounded-full animate-ai-float pointer-events-none" style={{ animationDelay: '-2s' }} />

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12 relative z-10">
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-8 mb-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-ai-purple/30 group">
              <Image
                src="/logo.png"
                alt="One1 Todo Logo"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white via-white to-white/40">
                One1 Todo
              </h1>
            </div>
          </div>
          <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
        </header>

        {/* Shared Tasks Notification */}
        <AnimatePresence>
          {sharedTasks && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8"
            >
              <GlassCard className="border-ai-cyan/30 bg-ai-cyan/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-ai-cyan">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold">Suraj shared tasks with you!</span>
                  </div>
                  <button
                    onClick={clearShareUrl}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="grid gap-2">
                  {sharedTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <CheckCircle className="w-4 h-4 text-ai-cyan/50" />
                      <span className="text-sm font-medium">{task.text}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    sharedTasks.forEach(t => addTask(t.text, t.priority));
                    clearShareUrl();
                  }}
                  className="mt-4 w-full py-2 bg-ai-cyan text-ai-navy font-bold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Import these tasks to my list
                </button>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8">
          {/* New Task Section */}
          <GlassCard glow className="border-ai-purple/20">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-ai-purple">
              <Plus className="w-5 h-5" />
              Quick Action
            </h2>
            <TaskInput onAdd={addTask} />
          </GlassCard>

          {/* Task List Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-ai-cyan" />
                Active Tasks
                <span className="text-white/20 ml-2 font-normal text-sm bg-white/5 px-2 py-0.5 rounded-md">
                  {activeTasks.length}
                </span>
              </h2>

              <button
                onClick={handleShare}
                disabled={activeTasks.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                {isCopying ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 group-hover:text-ai-cyan transition-colors" />}
                {isCopying ? "Link Copied!" : "Share Today"}
              </button>
            </div>

            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {activeTasks.length > 0 ? (
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
                    className="p-12 text-center rounded-2xl border border-dashed border-white/10"
                  >
                    <p className="text-white/30 tracking-wide">No active tasks for this {currentView}.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/30 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
              </h3>
              <div className="grid gap-3">
                <AnimatePresence>
                  {completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ai-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ai-purple border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TodoAppContent />
    </Suspense>
  );
}
