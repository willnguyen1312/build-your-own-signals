import { useEffect, useReducer, useRef } from "react";
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
  const rerender = useReducer((x) => x + 1, 0)[1];
  const effectRef = useRef<Function>();

  if (!effectRef.current) {
    effectRef.current = startEffect(rerender);
  }

  useEffect(() => {
    return effectRef.current!();
  }, []);
};
