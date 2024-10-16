import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { effect, computed, signal, startEffect } from "./signalsObject";

export { signal, effect, computed };

export const useSignals = () => {
  const effectRef = useRef<(onStoreChange: () => void) => () => void>();
  const endEffectRef = useRef<Function>();
  const onStoreChangeRef = useRef<Function>();
  const versionRef = useRef(0);

  const updateEndEffect = () => {
    endEffectRef.current = startEffect(() => {
      versionRef.current++;
      onStoreChangeRef.current?.();
    });
  };

  if (!effectRef.current) {
    effectRef.current = (onStoreChange: () => void) => {
      onStoreChangeRef.current = onStoreChange;
      updateEndEffect();

      return endEffectRef.current?.();
    };

    updateEndEffect();
  }

  useSyncExternalStore(effectRef.current, () => versionRef.current);
};

export function useSignal<T>(initialValue: T) {
  return useMemo(() => signal(initialValue), []);
}

export function useComputed<T>(callback: () => T) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useMemo(() => computed(() => callbackRef.current()), []);
}

export function useSignalEffect(callback: Function) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return effect(() => callbackRef.current());
  }, []);
}
