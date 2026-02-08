import { useSignals } from "./signalsReactObject";

type Subscription = {
  run: () => void;
  dependencies: Set<Set<Subscription>>;
};

const pendingSubscriptions: Set<Subscription> = new Set();

const subscribe = (subscription: Subscription, subscriptionSet: Set<Subscription>) => {
  subscriptionSet.add(subscription);
  subscription.dependencies.add(subscriptionSet);
};

const SignalValue = function ({ data }: { data: any }) {
  useSignals();
  return data.value;
};

declare class Signal<T = unknown> {
  get value(): T;
  set value(value: T);
  _value: T;
  _subscriptionSet: Set<Subscription>;
  constructor(initialValue: T);
}

function Signal<T = unknown>(this: Signal, initialValue: T) {
  this._value = initialValue;
  this._subscriptionSet = new Set<Subscription>();
}

export function signal<T = unknown>(initialValue?: T) {
  return new Signal(initialValue);
}

Object.defineProperty(Signal.prototype, "value", {
  get(this: Signal) {
    if (pendingSubscriptions.size > 0) {
      const lastSubscription = Array.from(pendingSubscriptions)[pendingSubscriptions.size - 1];
      subscribe(lastSubscription, this._subscriptionSet);
    }
    return this._value;
  },
  set(this: Signal, newValue) {
    this._value = newValue;
    for (const sub of this._subscriptionSet) {
      sub.run();
    }
  },
});

// Decorate Signals so React renders them as <SignalValue> components.
Object.defineProperties(Signal.prototype, {
  $$typeof: { configurable: true, value: Symbol.for("react.element") },
  type: { configurable: true, value: SignalValue },
  props: {
    configurable: true,
    get() {
      return { data: this };
    },
  },
  ref: { configurable: true, value: null },
});

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

export function computed<T = unknown>(fn: () => T): any {
  const signalResult = signal();
  effect(() => (signalResult.value = fn()));

  return {
    get value() {
      return signalResult.value;
    },
  };
}
