import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "./Login";
import { login } from "../../services/api";

vi.mock("../../services/api", () => ({
  login: vi.fn(),
}));

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
  test("logs in and notifies the parent on successful submission", async () => {
    const onLogin = vi.fn();

    vi.mocked(login).mockResolvedValue({
      token: "test-token",
    });

    render(
      <MemoryRouter>
        <Login onLogin={onLogin} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledTimes(1);
    });

    expect(localStorage.getItem("dog-breeds-app-token")).toBe("test-token");
  });
});
