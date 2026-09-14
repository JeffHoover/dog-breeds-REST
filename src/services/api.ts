// src/api/api.ts
import { getToken } from "./auth";

export type Topic = {
  id: string;
  title: string;
};

export type Message = {
  id: string;
  topicId: string;
  text: string;
};

export type SignupResponse = {
  success: boolean;
};

export type LoginResponse = {
  token: string;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API error ${response.status}: ${errorText || response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
}

export async function fetchTopics(): Promise<Topic[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/topics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<Topic[]>(res);
}

export async function fetchMessages(topicId: string): Promise<Message[]> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/topics/${topicId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse<Message[]>(res);
}

export async function postMessage(
  topicId: string,
  text: string,
): Promise<Message> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/api/topics/${topicId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  return handleResponse<Message>(res);
}

export async function signup(
  email: string,
  password: string,
): Promise<SignupResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<SignupResponse>(res);
}

export function logout() {
  localStorage.removeItem("dog-breeds-app-token");
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export {}; // keep this to ensure the file is treated as a module
