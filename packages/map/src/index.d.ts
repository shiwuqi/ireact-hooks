export interface StaticActions<T extends object> {
    set: <K extends keyof T>(key: K, value: T[K]) => void;
    setAll: (newMap: T) => void;
    remove: <K extends keyof T>(key: K) => void;
    reset: () => void;
}
  
export interface Actions<T extends object> extends StaticActions<T> {
    get: <K extends keyof T>(key: K) => T[K];
}

export declare function useMap<T extends object = any>(initialMap: T): [T, Actions<T>]; 