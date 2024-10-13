import { test } from "vitest";
import { getByText } from "@testing-library/dom";
import "vitest-dom/extend-expect";
import { createApp } from "./mainVanilla";
import userEvent from "@testing-library/user-event";

test("app works correctly in vanilla", async ({ expect }) => {
  const user = userEvent.setup();
  const container = createApp();

  expect(getByText(container, "Value: 0")).toBeInTheDocument();

  await user.click(getByText(container, "Increment"));
  expect(getByText(container, "Value: 1")).toBeInTheDocument();
});
