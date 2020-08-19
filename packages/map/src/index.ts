import { useState, useMemo, useCallback } from 'react';

export interface StaticActions<T extends object> {
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  setAll: (newMap: T) => void;
  remove: <K extends keyof T>(key: K) => void;
  reset: () => void;
}

export interface Actions<T extends object> extends StaticActions<T> {
  get: <K extends keyof T>(key: K) => T[K];
}

export default function useMap<T extends object = any>(initialMap: T = {} as T): [T, Actions<T>] {
  const [map, set] = useState<T>(initialMap);

  const staticActions = useMemo<StaticActions<T>>(
    () => ({
      set: (key, entry) => {
        set(prevMap => ({
          ...prevMap,
          [key]: entry,
        }));
      },
      setAll: (newMap: T) => {
        set(newMap);
      },
      remove: key => {
        set(prevMap => {
          const { [key]: omit, ...rest } = prevMap;
          return rest as T;
        });
      },
      reset: () => set(initialMap),
    }),
    [set]
  );

  const utils: Actions<T> = {
    get: useCallback(key => map[key], [map]),
    ...staticActions,
  };

  return [map, utils];
};