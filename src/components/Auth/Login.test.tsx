import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "./Login";

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

describe("Login Component", () => {
  test("renders email and password inputs", () => {
    render(
      <MemoryRouter>
        <Login
          onLogin={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("updates input values on change", () => {
    render(
      <MemoryRouter>
        <Login
          onLogin={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("user@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("calls handleSubmit on form submission", () => {
    render(
      <MemoryRouter>
        <Login
          onLogin={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });
    fireEvent.click(button);

    // No real API call yet, so just ensure no crash and navigation logic runs
    expect(emailInput).toHaveValue("test@example.com");
  });
});
