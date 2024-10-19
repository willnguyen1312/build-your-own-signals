type Subscription = Function;
let pendingSubscription: Subscription | null = null;

export function signal<T>(initialValue: T) {
  const subscriptions: Subscription[] = [];
  let internalValue = structuredClone(initialValue);

  return {
    get value() {
      if (pendingSubscription) {
        subscriptions.push(pendingSubscription);
      }
      return internalValue;
    },
    set value(newValue: T) {
      internalValue = structuredClone(newValue);
      for (const subscription of subscriptions) {
        subscription();
      }
    },
  };
}

export function effect(fn: Function) {
  const endEffect = startSubscription(fn);
  fn();
  return endEffect();
}

export const startSubscription = (fn: Function) => {
  pendingSubscription = fn;
  return function endSubscription() {
    pendingSubscription = null;
  };
};

export function computed<T>(fn: () => T) {
  const signalResult = signal(undefined) as { value: T };
  effect(() => (signalResult.value = fn()));
  return signalResult;
}
