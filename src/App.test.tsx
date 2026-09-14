import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import App from "./App";
beforeAll(() => {
  vi.spyOn(console, "warn").mockImplementation((msg) => {
    if (
      typeof msg === "string" &&
      msg.includes("React Router Future Flag Warning")
    ) {
      return;
    }
    console.warn(msg);
  });
});
describe("App routing", () => {
  beforeEach(() => {
    localStorage.setItem("dog-breeds-app-token", "dummy-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("redirects from / to /home when authenticated", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    // TODO - probably wrong assertion, so code is probably not working
    expect(await screen.findByText(/2025 Dog Breeds App/i)).toBeInTheDocument();
  });
});
