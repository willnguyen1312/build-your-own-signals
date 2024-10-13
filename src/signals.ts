type Subscription = {
  run: () => void;
  dependencies: Set<Set<Subscription>>;
};

let activeSubscription: Subscription | null = null;

export function signal(initialValue: any = undefined) {
  let value = initialValue;
  const subscriptionSet: Set<Subscription> = new Set();

  const get = () => {
    if (activeSubscription) {
      subscriptionSet.add(activeSubscription);
      activeSubscription.dependencies.add(subscriptionSet);
    }
    return value;
  };

  const set = (nextValue: any) => {
    value = nextValue;
    for (const sub of [...subscriptionSet]) {
      sub.run();
    }
  };

  return [get, set] as const;
}

export function effect(func: Function) {
  const subscription: Subscription = {
    run() {
      activeSubscription = subscription;
      func();
      activeSubscription = null;
    },
    dependencies: new Set(),
  };

  const cleanup = () => {
    for (const dep of subscription.dependencies) {
      dep.delete(subscription);
    }
    subscription.dependencies.clear();
  };

  subscription.run();

  return cleanup;
}

export function computed(fn: Function) {
  const [get, set] = signal();
  effect(() => set(fn()));
  return get;
}
