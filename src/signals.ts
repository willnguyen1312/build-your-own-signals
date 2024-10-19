export function signal<T>(initialValue: T) {}

export function effect(fn: Function) {}

export const startSubscription = (fn: Function) => {};

export function computed<T>(fn: () => T) {}
