import { useEffect, useMemo, useReducer, useRef, useSyncExternalStore } from "react";
import { computed, effect, signal, startSubscription } from "./signalObjectOptimized";

export { computed, effect, signal };

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

export const useSignalsWithSyncExternalStore = () => {
  const endSubscriptionRef = useRef<ReturnType<typeof startSubscription>>();
  const versionRef = useRef(0);
  const onStoreChangeRef = useRef<Function>();
  const subscribeRef = useRef((onStoreChange: Function) => {
    onStoreChangeRef.current = onStoreChange;
    const cleanup = endSubscriptionRef.current?.();
    return () => cleanup?.();
  });

  if (!endSubscriptionRef.current) {
    endSubscriptionRef.current = startSubscription(() => {
      versionRef.current++;
      onStoreChangeRef.current?.();
    });
  }

  useSyncExternalStore(subscribeRef.current, () => versionRef.current);
};

export const useSignalsWithReducer = () => {
  const rerender = useReducer((x) => x + 1, 0)[1];
  const endSubscriptionRef = useRef<ReturnType<typeof startSubscription>>();

  if (!endSubscriptionRef.current) {
    endSubscriptionRef.current = startSubscription(rerender);
  }

  useEffect(() => endSubscriptionRef.current!(), []);
};

// export const useSignals = useSignalsWithReducer;
export const useSignals = useSignalsWithSyncExternalStore;
