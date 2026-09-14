import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import SignupPage from "./SignupPage";
import { signup } from "../services/api";

vi.mock("../services/api", () => ({
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
        <SignupPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
  test("submits credentials and displays an error when signup fails", async () => {
    vi.mocked(signup).mockResolvedValue({ success: false });

    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(signup).toHaveBeenCalledWith("test@example.com", "abc123");
    expect(await screen.findByText(/signup failed/i)).toBeInTheDocument();
  });
});
