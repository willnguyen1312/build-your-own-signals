import { useEffect, useReducer, useRef } from "react";
import { startSubscription } from "./signals";

export const useSignals = () => {
  const rerender = useReducer((x) => x + 1, 0)[1];
  const endSubscriptionRef = useRef<ReturnType<typeof startSubscription>>();

  if (!endSubscriptionRef.current) {
    endSubscriptionRef.current = startSubscription(rerender);
  }

  useEffect(() => endSubscriptionRef.current!(), []);
};
