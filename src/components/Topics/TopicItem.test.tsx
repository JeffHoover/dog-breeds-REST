import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TopicItem from "./TopicItem";

describe("TopicItem Component", () => {
  const topic = { id: "1", title: "Beagles" };

  test("renders topic title", () => {
    render(<TopicItem topic={topic} />);
    expect(screen.getByText(topic.title)).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<TopicItem topic={topic} onClick={onClick} />);

    fireEvent.click(screen.getByText(topic.title));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
