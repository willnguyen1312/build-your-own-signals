type Subscription = {
  run: () => void;
  dependencies: Set<Set<Subscription>>;
};

const activeSubscriptions: Subscription[] = [];
const globalPendingSubscriptions: Set<Subscription> = new Set();

const subscribe = (subscription: Subscription, dependencies: Set<Subscription>) => {
  dependencies.add(subscription);
  subscription.dependencies.add(dependencies);
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
          const activeSubscription = activeSubscriptions[activeSubscriptions.length - 1];
          if (activeSubscription) {
            subscribe(activeSubscription, subscriptionSet);
          }

          if (globalPendingSubscriptions.size > 0) {
            for (const sub of globalPendingSubscriptions) {
              subscribe(sub, subscriptionSet);
            }
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
    }
  );
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
    }
  );
}
