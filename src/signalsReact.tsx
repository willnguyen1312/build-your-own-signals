import { useEffect, useMemo, useReducer, useRef } from "react";
import { computed, effect, signal, startSubscription } from "./signals";

export { computed, effect, signal };

export const useSignals = () => {
  const rerender = useReducer((x) => x + 1, 0)[1];
  const endSubscriptionRef = useRef<ReturnType<typeof startSubscription>>();

  if (!endSubscriptionRef.current) {
    endSubscriptionRef.current = startSubscription(rerender);
  }

  useEffect(() => endSubscriptionRef.current!(), []);
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
