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
        low: 'text-blue-400',
        medium: 'text-purple-400',
        high: 'text-rose-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ scale: 1.01 }}
            className="group relative"
        >
            <div className={cn(
                "flex items-center gap-4 p-4 rounded-xl transition-all duration-300",
                "bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20",
                task.completed && "opacity-60"
            )}>
                <button
                    onClick={() => onToggle(task.id)}
                    className="text-ai-cyan hover:scale-110 transition-transform"
                >
                    {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 fill-ai-cyan/20" />
                    ) : (
                        <Circle className="w-6 h-6" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-lg font-medium truncate transition-all",
                        task.completed && "line-through text-white/40"
                    )}>
                        {task.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className={cn("text-xs font-bold uppercase tracking-wider", priorityColors[task.priority])}>
                            {task.priority}
                        </span>
                        <span className="text-white/30 text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {task.date}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}
