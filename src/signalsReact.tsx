import { useEffect, useRef, useSyncExternalStore } from "react";
import { effect, computed, signal, startEffect } from "./signals";

export { signal, effect, computed };

export function useSignalEffect(callback: Function) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    return effect(() => callbackRef.current());
  }, []);
}

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
