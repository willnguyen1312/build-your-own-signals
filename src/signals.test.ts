import { test, vi } from "vitest";

import { signal, computed, effect } from "./signals";

test("signals work 🚀", ({ expect }) => {
  const mockFunc = vi.fn();
  const [getValue, setValue] = signal(1);

  const computedValue = computed(() => getValue() * 2);

  const disposeEffect = effect(() => mockFunc(getValue()));

  expect(getValue()).toBe(1);
  expect(computedValue()).toBe(2);
  expect(mockFunc).toHaveBeenCalledWith(1);
  expect(mockFunc).toHaveBeenCalledTimes(1);

  setValue(2);

  expect(getValue()).toBe(2);
  expect(computedValue()).toBe(4);
  expect(mockFunc).toHaveBeenCalledWith(2);
  expect(mockFunc).toHaveBeenCalledTimes(2);

  const calls = mockFunc.mock.calls;
  expect(calls[0][0]).toBe(1);
  expect(calls[1][0]).toBe(2);

  disposeEffect();
  setValue(3);
  expect(computedValue()).toBe(6);

  //   Since the effect is disposed, the mock function should not be called again
  expect(mockFunc).toHaveBeenCalledTimes(2);
});
