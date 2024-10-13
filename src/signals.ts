type Subscription = {
  execute: () => void;
  dependencies: Set<Set<Subscription>>;
};

let activeSubscription: Subscription | null = null;

export function signal(initialValue: any = undefined) {
  let value = initialValue;
  const subscriptionSet: Set<Subscription> = new Set();

  const getter = () => {
    if (activeSubscription) {
      subscriptionSet.add(activeSubscription);
      activeSubscription.dependencies.add(subscriptionSet);
    }
    return value;
  };

  const setter = (nextValue: any) => {
    value = nextValue;
    for (const sub of [...subscriptionSet]) {
      sub.execute();
    }
  };

  return [getter, setter] as const;
}

export function effect(func: Function) {
  const subscription: Subscription = {
    execute() {
      activeSubscription = subscription;
      func();
      activeSubscription = null;
    },
    dependencies: new Set(),
  };

  subscription.execute();

  const cleanup = () => {
    for (const dep of subscription.dependencies) {
      dep.delete(subscription);
    }
    subscription.dependencies.clear();
  };

  return cleanup;
}

export function computed(fn: Function) {
  const [getter, setter] = signal();
  effect(() => setter(fn()));
  return getter;
}
