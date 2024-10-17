import { test, vi } from "vitest";
import { computed, effect, signal, startSubscription } from "./signalsProxy";

test("signalsProxy independently 🚀", ({ expect }) => {
  const mockFunc = vi.fn();
  const signalResult = signal(1);

  const computedDouble = computed(() => signalResult.value * 2);

  const disposeEffect = effect(() => mockFunc(signalResult.value));

  expect(signalResult.value).toBe(1);
  expect(computedDouble.value).toBe(2);
  expect(mockFunc).toHaveBeenCalledWith(1);
  expect(mockFunc).toHaveBeenCalledTimes(1);

  signalResult.value = 2;

  expect(signalResult.value).toBe(2);
  expect(computedDouble.value).toBe(4);
  expect(mockFunc).toHaveBeenCalledWith(2);
  expect(mockFunc).toHaveBeenCalledTimes(2);

  const calls = mockFunc.mock.calls;
  expect(calls[0][0]).toBe(1);
  expect(calls[1][0]).toBe(2);

  disposeEffect();
  signalResult.value = 3;
  expect(computedDouble.value).toBe(6);

  // Since the effect is disposed, the mock function should not be called again
  expect(mockFunc).toHaveBeenCalledTimes(2);
});

test("nested effects 🪺", ({ expect }) => {
  const mockFunc1 = vi.fn();
  const mockFunc2 = vi.fn();
  const signalResult = signal(1);

  effect(() => {
    mockFunc1(signalResult.value);

    effect(() => {
      mockFunc2(signalResult.value * 2);
    });

    mockFunc1(signalResult.value);
  });

  expect(mockFunc1).toHaveBeenCalledWith(1);
  expect(mockFunc2).toHaveBeenCalledWith(2);

  signalResult.value = 2;

  expect(mockFunc1).toHaveBeenCalledWith(2);
  expect(mockFunc2).toHaveBeenCalledWith(4);
});

test("pending subscriptions 🚦", ({ expect }) => {
  const signalResult = signal(1);

  const mockFunc = vi.fn();

  const endEffect = startSubscription(() => {
    mockFunc(signalResult.value);
  });

  signalResult.value;

  const disposeEffect = endEffect();

  signalResult.value = 2;

  expect(mockFunc).toHaveBeenCalledWith(2);

  disposeEffect();

  signalResult.value = 3;

  expect(mockFunc).toHaveBeenCalledTimes(1);
});
