'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
            <div className="flex flex-col gap-5">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Describe your next achievement..."
                    className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6",
                        "text-white text-lg placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30",
                        "transition-all duration-300"
                    )}
                />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-3 px-2 shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Priority:</span>
                        <div className="flex gap-1.5">
                            {(['low', 'medium', 'high'] as const).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all",
                                        priority === p
                                            ? "bg-white text-black"
                                            : "bg-white/5 text-white/40 hover:bg-white/10"
                                    )}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!text.trim()}
                        className="w-full py-4 bg-white text-black text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-20 shadow-xl shadow-white/5"
                    >
                        Add Task
                    </button>
                </div>
            </div>
        </form>
    );
}
