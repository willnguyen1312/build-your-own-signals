import { useEffect, useMemo, useReducer, useRef } from "react";
import { effect, computed, signal, startEffect } from "./signalsProxy";

export { signal, effect, computed };

export const useSignals = () => {
  const rerender = useReducer((x) => x + 1, 0)[1];
  const endEffectRef = useRef<ReturnType<typeof startEffect>>();

  if (!endEffectRef.current) {
    endEffectRef.current = startEffect(rerender);
  }

  useEffect(() => {
    endEffectRef.current?.();
  }, []);
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
