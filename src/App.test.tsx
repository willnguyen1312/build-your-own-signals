import { test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "vitest-dom/extend-expect";

import { signal, computed, effect } from "./signals";
// import { signal, computed, effect } from "@preact/signals-core";

import App from "./App";

test("signal", ({ expect }) => {
  const countSignal = signal(0);
  expect(countSignal.value).toBe(0);

  countSignal.value = 1;
  expect(countSignal.value).toBe(1);
});

test("signal and effect", ({ expect }) => {
  const mockCallback = vi.fn();
  const countSignal = signal(0);
  effect(() => mockCallback(countSignal.value));

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenNthCalledWith(1, 0);
  countSignal.value = 1;

  expect(mockCallback).toHaveBeenCalledTimes(2);
  expect(mockCallback).toHaveBeenNthCalledWith(2, 1);
});

test("signal and computed", ({ expect }) => {
  const countSignal = signal(1);
  const doubleCount = computed(() => countSignal.value * 2);
  expect(doubleCount.value).toBe(2);

  countSignal.value = 2;
  expect(doubleCount.value).toBe(4);
});

test("signal, computed and effect together", ({ expect }) => {
  const countSignal = signal(1);
  const doubleCount = computed(() => countSignal.value * 2);
  const mockCallback = vi.fn();

  effect(() => mockCallback(doubleCount.value));

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenNthCalledWith(1, 2);

  countSignal.value = 2;
  expect(mockCallback).toHaveBeenCalledTimes(2);
  expect(mockCallback).toHaveBeenNthCalledWith(2, 4);
});

test("React with signals", async ({ expect }) => {
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText("Value: 0")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 0")).toBeInTheDocument();

  const incrementButton = screen.getByRole("button", { name: "Increment" });
  await user.click(incrementButton);

  expect(screen.getByText("Value: 1")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 2")).toBeInTheDocument();
});
