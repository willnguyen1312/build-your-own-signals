import { useEffect, useMemo, useRef, useReducer } from "react";
import { effect, computed, signal, startEffect } from "./signals";

export { signal, effect, computed };

export const useSignals = () => {
  const rerender = useReducer((x) => x + 1, 0)[1];
  const endEffectRef = useRef(startEffect(rerender));

  useEffect(() => {
    endEffectRef.current();
  }, []);
};

export function useSignal<T>(initialValue: T): [() => T, (nextValue: T) => void] {
  return useMemo(() => signal(initialValue), []) as [() => T, (nextValue: T) => void];
}

export function useComputed<T>(callback: () => T) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useMemo(() => computed(() => callbackRef.current()), []) as () => T;
}

export function useSignalEffect(callback: Function) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return effect(() => callbackRef.current());
  }, []);
}
