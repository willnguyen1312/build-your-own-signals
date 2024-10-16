type Subscription = {
  run: () => void;
  dependencies: Set<Set<Subscription>>;
};

const pendingSubscriptions: Set<Subscription> = new Set();

const subscribe = (subscription: Subscription, subscriptionSet: Set<Subscription>) => {
  subscriptionSet.add(subscription);
  subscription.dependencies.add(subscriptionSet);
};

export function signal<T>(initialValue: T) {
  const subscriptionSet: Set<Subscription> = new Set();
  let value = structuredClone(initialValue);

  return {
    get value() {
      if (pendingSubscriptions.size > 0) {
        for (const sub of pendingSubscriptions) {
          subscribe(sub, subscriptionSet);
        }
      }
      return value;
    },
    set value(newValue) {
      pendingSubscriptions.clear();
      value = newValue;
      for (const sub of subscriptionSet) {
        sub.run();
      }
    },
  };
}

const cleanup = (subscription: Subscription) => {
  for (const dep of subscription.dependencies) {
    dep.delete(subscription);
  }
  subscription.dependencies.clear();
};

export function effect(func: Function) {
  const endEffect = startEffect(func);
  func();
  return endEffect();
}

export const startEffect = (callback: Function) => {
  const subscription: Subscription = {
    run() {
      callback();
    },
    dependencies: new Set(),
  };

  pendingSubscriptions.add(subscription);

  const endEffect = () => {
    pendingSubscriptions.delete(subscription);

    return () => {
      cleanup(subscription);
    };
  };

  return endEffect;
};

export function computed<T>(fn: () => T) {
  const signalResult = signal(undefined) as { value: T };
  effect(() => (signalResult.value = fn()));

  return {
    get value() {
      return signalResult.value;
    },
  };
}
