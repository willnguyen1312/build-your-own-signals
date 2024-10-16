import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "vitest-dom/extend-expect";
import App from "./App";

test("React app with signals 🚥", async ({ expect }) => {
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText("Value: 0")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 0")).toBeInTheDocument();

  const incrementButton = screen.getByRole("button", { name: "Increment" });
  await user.click(incrementButton);

  expect(screen.getByText("Value: 1")).toBeInTheDocument();
  expect(screen.getByText("Double Value: 2")).toBeInTheDocument();
});
