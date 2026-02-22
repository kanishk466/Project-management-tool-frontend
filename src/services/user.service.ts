import { authFetch } from "@/lib/authFetch";

export interface Developer {
  id: number;
  name: string;
}

export const getDevelopers = async (): Promise<Developer[]> => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/users?role=DEVELOPER`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to load developers");
  }

  const data = await res.json();
  return data.users;
};
