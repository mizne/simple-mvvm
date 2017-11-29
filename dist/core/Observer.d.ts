import Watcher from './Watcher';
export declare class Observer {
    private data;
    constructor(data: any);
    observer(data: any, path?: string[]): void;
    defineReactive(data: any, key: string, value: any, path: string[]): void;
}
export declare class Dep {
    id: number;
    private watchers;
    static target: Watcher | null;
    constructor();
    addWatcher(watcher: Watcher): void;
    removeWatcher(watcher: Watcher): void;
    notify(): void;
}
