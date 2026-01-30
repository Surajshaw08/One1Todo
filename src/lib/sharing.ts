import { Task } from "@/types/todo";

export function encodeTasks(tasks: Task[]): string {
    try {
        const json = JSON.stringify(tasks);
        return btoa(json);
    } catch (e) {
        console.error("Failed to encode tasks", e);
        return "";
    }
}

export function decodeTasks(encoded: string): Task[] {
    try {
        const json = atob(encoded);
        return JSON.parse(json);
    } catch (e) {
        console.error("Failed to decode tasks", e);
        return [];
    }
}
