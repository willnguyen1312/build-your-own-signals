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

  return new Proxy(
    {
      value: structuredClone(initialValue),
    },
    {
      get: (target, prop) => {
        if (prop === "value") {
          if (pendingSubscriptions.size > 0) {
            const lastSubscription =
              Array.from(pendingSubscriptions)[pendingSubscriptions.size - 1];
            subscribe(lastSubscription, subscriptionSet);
          }

          return Reflect.get(target, prop);
        }
      },
      set: (target, prop, value) => {
        if (prop === "value") {
          Reflect.set(target, prop, value);
          for (const sub of subscriptionSet) {
            sub.run();
          }

          return true;
        }

        return false;
      },
    },
  );
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

export function computed<T>(fn: () => T) {
  const signalResult = signal(undefined) as { value: T };
  effect(() => {
    signalResult.value = fn();
  });

  return new Proxy(
    {
      value: signalResult.value,
    },
    {
      get: (_, prop) => {
        if (prop === "value") {
          return signalResult.value;
        }
      },
    },
  );
}
