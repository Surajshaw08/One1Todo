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
            <div className="flex flex-col gap-6">
                <div className="relative group">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What needs to be done?"
                        className={cn(
                            "w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pr-14",
                            "text-white text-lg placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30",
                            "transition-all duration-300"
                        )}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="p-2.5 bg-white text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:scale-100 transition-all font-bold"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 px-2">
                    <span className="text-xs font-black uppercase tracking-widest text-white/30">Priority:</span>
                    <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all",
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
            </div>
        </form>
    );
}
