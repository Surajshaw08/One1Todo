import { Task } from '@/types/todo';
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const priorityColors = {
        low: 'text-white/30',
        medium: 'text-white/60',
        high: 'text-white font-black'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="group"
        >
            <div className={cn(
                "flex items-center gap-5 p-5 rounded-2xl transition-all duration-500",
                "bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.07]",
                task.completed && "opacity-40 grayscale"
            )}>
                <button
                    onClick={() => onToggle(task.id)}
                    className="shrink-0 transition-transform active:scale-90"
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-7 h-7 text-white" />
                    ) : (
                        <Circle className="w-7 h-7 text-white/20 hover:text-white/40" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-lg font-bold tracking-tight truncate",
                        task.completed && "line-through"
                    )}>
                        {task.text}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5">
                        <span className={cn("text-[10px] uppercase tracking-widest", priorityColors[task.priority])}>
                            {task.priority}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-white/10" />
                        <span className="text-white/20 text-[10px] font-medium flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {task.date}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-white/10 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
