type Subscription = () => void;
let activeSubscription: Subscription | null = null;

export function signal(initialValue: any = undefined) {
  let value = initialValue;
  const subscriptionSet: Set<Subscription> = new Set();

  const getter = () => {
    if (activeSubscription) {
      subscriptionSet.add(activeSubscription);
    }
    return value;
  };

  const setter = (nextValue: any) => {
    value = nextValue;

    for (const subscription of [...subscriptionSet]) {
      subscription();
    }
  };

  return [getter, setter] as const;
}

export function effect(func: () => any) {
  const run: Subscription = () => {
    activeSubscription = run;
    func();
    activeSubscription = null;
  };

  run();
}

export function computed(func: () => any) {
  const [getter, setter] = signal();
  effect(() => setter(func()));
  return getter;
}
