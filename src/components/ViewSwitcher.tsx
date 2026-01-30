import { ViewType } from '@/types/todo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ViewSwitcherProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const views: { id: ViewType; label: string }[] = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
];

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
    return (
        <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-full max-w-sm mx-auto">
            {views.map((view) => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={cn(
                        "relative flex-1 py-2 text-sm font-medium transition-colors duration-300",
                        currentView === view.id ? "text-white" : "text-white/40 hover:text-white/70"
                    )}
                >
                    {currentView === view.id && (
                        <motion.div
                            layoutId="active-view"
                            className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                            transition={{ type: "spring", duration: 0.5 }}
                        />
                    )}
                    <span className="relative z-10">{view.label}</span>
                </button>
            ))}
        </div>
    );
}
