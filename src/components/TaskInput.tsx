'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskInputProps {
    onAdd: (text: string, priority: 'low' | 'medium' | 'high') => void;
}

export function TaskInput({ onAdd }: TaskInputProps) {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onAdd(text.trim(), priority);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col gap-4">
                <div className="relative group">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a new task..."
                        className={cn(
                            "w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-12 lg:pr-32",
                            "text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-ai-purple/50 focus:border-ai-purple/50",
                            "transition-all duration-300 backdrop-blur-sm"
                        )}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="p-2 bg-ai-purple rounded-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        >
                            <Plus className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 justify-center lg:justify-start">
                    {(['low', 'medium', 'high'] as const).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                                priority === p
                                    ? "bg-white/20 text-white ring-1 ring-white/30"
                                    : "bg-transparent text-white/40 hover:text-white/60"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        </form>
    );
}
