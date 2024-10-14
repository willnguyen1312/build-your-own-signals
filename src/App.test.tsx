import { test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "vitest-dom/extend-expect";
import App from "./App";

test("React works well with signal 🚥", async ({ expect }) => {
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText("Value: 0")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 0")).toBeInTheDocument();

  await user.click(screen.getByText("Increment"));
  expect(screen.getByText("Value: 1")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 2")).toBeInTheDocument();

  await user.click(screen.getByText("Increment"));
  expect(screen.getByText("Value: 2")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 4")).toBeInTheDocument();

  expect(consoleLogSpy).toHaveBeenCalledWith("Count value: ", 0);
  expect(consoleLogSpy).toHaveBeenCalledWith("Count value: ", 1);
  expect(consoleLogSpy).toHaveBeenCalledWith("Count value: ", 2);
  expect(consoleLogSpy).toHaveBeenCalledTimes(3);
});
