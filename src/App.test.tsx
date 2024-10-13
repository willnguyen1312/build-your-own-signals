import { test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "vitest-dom/extend-expect";
import App from "./App";

test("app works correctly in React", async ({ expect }) => {
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText("Value: 0")).toBeInTheDocument();

  await user.click(screen.getByText("Increment"));
  expect(screen.getByText("Value: 1")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 2")).toBeInTheDocument();
  expect(consoleLogSpy).toHaveBeenCalledWith("Count value in React: ", 1);
});
