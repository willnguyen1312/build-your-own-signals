import { test, vi } from "vitest";

import { signal, computed, effect } from "./signals";

test("signals work 🚀", ({ expect }) => {
  const mockFunc = vi.fn();
  const [getValue, setValue] = signal(0);

  const computedValue = computed(() => getValue() + 1);

  effect(() => {
    mockFunc(getValue());
  });

  expect(getValue()).toBe(0);
  expect(computedValue()).toBe(1);
  expect(mockFunc).toHaveBeenCalledWith(0);
  expect(mockFunc).toHaveBeenCalledTimes(1);

  setValue(1);

  expect(getValue()).toBe(1);
  expect(computedValue()).toBe(2);
  expect(mockFunc).toHaveBeenCalledWith(1);
  expect(mockFunc).toHaveBeenCalledTimes(2);

  const calls = mockFunc.mock.calls;
  expect(calls[0][0]).toBe(0);
  expect(calls[1][0]).toBe(1);
});
