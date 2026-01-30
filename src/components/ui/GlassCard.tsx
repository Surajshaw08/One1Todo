import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    glow?: boolean;
}

export function GlassCard({ children, className, glow = false }: GlassCardProps) {
    return (
        <div className={cn(
            "glass rounded-2xl p-4 md:p-6 transition-all duration-300",
            glow && "glow-border",
            className
        )}>
            {children}
        </div>
    );
}
