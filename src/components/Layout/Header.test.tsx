import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Header from "./Header";

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

describe("Header Component", () => {
  test("renders the app title", () => {
    render(
      <MemoryRouter>
        <Header
          isAuthenticated={true}
          onLogout={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText(/dog breeds app/i)).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(
      <MemoryRouter>
        <Header
          isAuthenticated={false}
          onLogout={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /signup/i })).toBeInTheDocument();
  });
});
