import  {authFetch}  from "@/lib/authFetch";
import { SprintStatus } from "@/types";
export interface CreateSprintPayload {
  name: string;
  goal?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}




export interface Sprint {
  id: number;
  name: string;
  goal?: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  startDate: string;
  endDate: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
}


export interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  description?: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdById: number;
  assignedToId: number | null;
  sprintId: number;
  createdAt: string;
  updatedAt: string;
  // attachments: Attachment[];
  // comments: Comment[];
}

export interface SprintDetail {
  id: number;
  name: string;
  goal?: string;
  status: "PLANNED" | "ACTIVE" | "COMPLETED";
  startDate: string;
  endDate: string;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  tickets: Ticket[];
}


export interface SprintAdmin {
  id: number;
  name: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
}


export const createSprint = async (payload: CreateSprintPayload) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/sprints`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create sprint");
  }

  return res.json();
};





export const getSprints = async (): Promise<Sprint[]> => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/sprints`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch sprints");
  }

  const data = await res.json();
  return data.sprints;
};


export const getSprintById = async (id: string): Promise<SprintDetail> => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/sprints/${id}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch sprint");
  }

  const data = await res.json();
  return data.sprint;
};











export const activateSprint = async (sprintId: number) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/sprints/${sprintId}/activate`,
    { method: "POST" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to activate sprint");
  }

  return res.json();
};

export const completeSprint = async (sprintId: number) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/sprints/${sprintId}/complete`,
    { method: "POST" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to complete sprint");
  }

  return res.json();
};
