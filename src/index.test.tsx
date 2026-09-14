import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("application entry component", () => {
  test("renders App without crashing", () => {
    expect(() =>
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>,
      ),
    ).not.toThrow();
  });
});
