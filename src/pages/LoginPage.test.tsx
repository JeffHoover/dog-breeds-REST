import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "./LoginPage";

describe("LoginPage Component", () => {
  test("renders login form fields and button", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("calls handleSubmit when form is submitted", () => {
    const mockSubmit = vi.fn();
    render(<LoginPage onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });
});
