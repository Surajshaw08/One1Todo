export type TaskStatus = 'pending' | 'completed';
export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    date: string; // ISO date string (YYYY-MM-DD)
    priority: 'low' | 'medium' | 'high';
    category?: string;
}

export type TasksByDate = Record<string, Task[]>;
