'use client';

import { useState, useEffect } from 'react';
import { Task, ViewType } from '@/types/todo';
import {
    format,
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
    isSameDay,
    isSameWeek,
    isSameMonth,
    isSameYear,
    parseISO
} from 'date-fns';

const STORAGE_KEY = 'perfect-todo-v1';

export function useTodoStore() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse tasks', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }, [tasks, isLoaded]);

    const addTask = (text: string, priority: Task['priority'] = 'medium', date: Date = new Date()) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now(),
            date: format(date, 'yyyy-MM-dd'),
            priority
        };
        setTasks(prev => [newTask, ...prev]);
    };

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const filterTasksByView = (view: ViewType, referenceDate: Date) => {
        return tasks.filter(task => {
            const taskDate = parseISO(task.date);
            switch (view) {
                case 'day':
                    return isSameDay(taskDate, referenceDate);
                case 'week':
                    return isSameWeek(taskDate, referenceDate, { weekStartsOn: 1 });
                case 'month':
                    return isSameMonth(taskDate, referenceDate);
                case 'year':
                    return isSameYear(taskDate, referenceDate);
                default:
                    return true;
            }
        });
    };

    return {
        tasks,
        isLoaded,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        filterTasksByView
    };
}
