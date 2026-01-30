import { ViewType } from '@/types/todo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ViewSwitcherProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const views: { id: ViewType; label: string }[] = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
];

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
    return (
        <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit min-w-[280px]">
            {views.map((view) => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id)}
                    className={cn(
                        "relative flex-1 py-2 px-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl",
                        currentView === view.id ? "text-black" : "text-white/40 hover:text-white"
                    )}
                >
                    {currentView === view.id && (
                        <motion.div
                            layoutId="active-view-bg"
                            className="absolute inset-0 bg-white rounded-xl"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{view.label}</span>
                </button>
            ))}
        </div>
    );
}
