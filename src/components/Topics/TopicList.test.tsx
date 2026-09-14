import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import TopicList from "./TopicList";
import { fetchTopics } from "../../services/api";

vi.mock("../../services/api", () => ({
  fetchTopics: vi.fn(),
}));

describe("TopicList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
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
  test("renders loading state initially", () => {
    vi.mocked(fetchTopics).mockReturnValue(new Promise(() => {})); // never resolves

    render(
      <MemoryRouter>
        <TopicList />
      </MemoryRouter>,
    );

    expect(screen.getByText(/loading topics/i)).toBeInTheDocument();
  });

  test("renders list of topic titles", async () => {
    const mockTopics = [
      { id: "1", title: "Labrador Retrievers" },
      { id: "2", title: "German Shepherds" },
      { id: "3", title: "Golden Retrievers" },
    ];

    vi.mocked(fetchTopics).mockResolvedValue(mockTopics);

    render(
      <MemoryRouter>
        <TopicList />
      </MemoryRouter>,
    );

    for (const topic of mockTopics) {
      expect(await screen.findByText(topic.title)).toBeInTheDocument();
    }
  });

  test("renders message when no topics exist", async () => {
    vi.mocked(fetchTopics).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <TopicList />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/no topics available/i)).toBeInTheDocument();
  });

  test("renders error message on fetch failure", async () => {
    vi.mocked(fetchTopics).mockRejectedValue(new Error("API error"));

    render(
      <MemoryRouter>
        <TopicList />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/failed to load topics/i),
    ).toBeInTheDocument();
  });
});
