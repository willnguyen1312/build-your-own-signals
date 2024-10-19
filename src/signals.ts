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
  let value = structuredClone(initialValue);
  const subscriptionSet: Set<Subscription> = new Set();

  const get = () => {
    if (pendingSubscriptions.size > 0) {
      const lastSubscription = Array.from(pendingSubscriptions)[pendingSubscriptions.size - 1];
      subscribe(lastSubscription, subscriptionSet);
    }

    return value;
  };

  const set = (nextValue: T) => {
    pendingSubscriptions.clear();
    value = structuredClone(nextValue);
    for (const sub of subscriptionSet) {
      sub.run();
    }
  };

  return [get, set] as const;
}

const cleanup = (subscription: Subscription) => {
  for (const dep of subscription.dependencies) {
    dep.delete(subscription);
  }
  subscription.dependencies.clear();
};

export function effect(func: Function) {
  const endEffect = startSubscription(func);
  func();
  return endEffect();
}

export const startSubscription = (callback: Function) => {
  const subscription: Subscription = {
    run() {
      callback();
    },
    dependencies: new Set(),
  };

  pendingSubscriptions.add(subscription);

  const endSubscription = () => {
    pendingSubscriptions.delete(subscription);

    return () => {
      cleanup(subscription);
    };
  };

  return endSubscription;
};

export function computed(fn: Function) {
  const [get, set] = signal(undefined);
  effect(() => set(fn()));
  return get;
}
