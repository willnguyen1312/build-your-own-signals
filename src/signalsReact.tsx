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
  const versionRef = useRef(0);

  if (!effectRef.current) {
    effectRef.current = (onStoreChange: () => void) => {
      return startEffect(() => {
        onStoreChange();
        versionRef.current++;
      });
    };
  }

  useSyncExternalStore(
    effectRef.current,
    () => versionRef.current,
    () => versionRef.current,
  );
};
