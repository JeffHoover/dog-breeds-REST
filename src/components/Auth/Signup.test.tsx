import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Signup from "./Signup";

vi.mock("../../services/api", () => ({
  signup: vi.fn(),
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

describe("Signup Component", () => {
  test("renders signup form fields and button", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm Password:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  test("updates form fields on change", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^Password:/i);
    const confirmPasswordInput = screen.getByLabelText(/^Confirm Password:/i);

    fireEvent.change(emailInput, { target: { value: "newuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "mysecret" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "mysecret" } });

    expect(emailInput).toHaveValue("newuser@example.com");
    expect(passwordInput).toHaveValue("mysecret");
    expect(confirmPasswordInput).toHaveValue("mysecret");
  });

  test("calls handleSubmit when form is submitted", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^Password:/i);
    const confirmPasswordInput = screen.getByLabelText(/^Confirm Password:/i);

    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "pass123" } });

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(logSpy).toHaveBeenCalledWith("Signing up:", {
      email: "user@example.com",
      password: "pass123",
    });

    logSpy.mockRestore();
  });
});
