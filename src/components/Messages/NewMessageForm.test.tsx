import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import NewMessageForm from "./NewMessageForm"; // **no curly braces**

describe("NewMessageForm Component", () => {
  test("renders input and submit button", () => {
    render(<NewMessageForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  test("calls onSubmit with input value when submitted", () => {
    const mockSubmit = vi.fn();
    render(<NewMessageForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/message/i);
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello world" } });
    fireEvent.click(button);

    expect(mockSubmit).toHaveBeenCalledWith("Hello world");
  });

  test("clears input after submit", () => {
    const mockSubmit = vi.fn();
    render(<NewMessageForm onSubmit={mockSubmit} />);

    const input = screen.getByLabelText(/message/i);
    const button = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Clear me" } });
    fireEvent.click(button);

    expect(input).toHaveValue("");
  });
});
