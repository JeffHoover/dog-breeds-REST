import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("application entry component", () => {
  test("renders App without crashing", () => {
    expect(() =>
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </MemoryRouter>,
      ),
    ).not.toThrow();
  });
});
