type Subscription = {
  run: () => void;
  dependencies: Set<Set<Subscription>>;
};

const activeSubscriptions: Subscription[] = [];
const globalPendingSubscriptions: Set<Subscription> = new Set();

const subscribe = (subscription: Subscription, subscriptionSet: Set<Subscription>) => {
  subscriptionSet.add(subscription);
  subscription.dependencies.add(subscriptionSet);
};

export function signal<T>(initialValue: T) {
  let value = structuredClone(initialValue);
  const subscriptionSet: Set<Subscription> = new Set();

  const get = () => {
    const activeSubscription = activeSubscriptions[activeSubscriptions.length - 1];
    if (activeSubscription) {
      subscribe(activeSubscription, subscriptionSet);
    }

    if (globalPendingSubscriptions.size > 0) {
      for (const sub of globalPendingSubscriptions) {
        subscribe(sub, subscriptionSet);
      }
    }

    return value;
  };

  const set = (nextValue: T) => {
    value = nextValue;
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
  const subscription: Subscription = {
    run() {
      activeSubscriptions.push(subscription);
      func();
      activeSubscriptions.pop();
    },
    dependencies: new Set(),
  };

  subscription.run();

  return () => {
    cleanup(subscription);
  };
}

export const startEffect = (callback: Function) => {
  const subscription: Subscription = {
    run() {
      callback();
    },
    dependencies: new Set(),
  };

  globalPendingSubscriptions.add(subscription);

  const endEffect = () => {
    globalPendingSubscriptions.delete(subscription);

    return () => {
      cleanup(subscription);
    };
  };

  return endEffect;
};

export function computed(fn: Function) {
  const [get, set] = signal(undefined);
  effect(() => set(fn()));
  return get;
}
