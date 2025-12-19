import { authFetch } from "@/lib/authFetch";

import { TicketPriority, TicketStatus ,Ticket } from "@/types";

export interface CreateTicketPayload {
  title: string;
  description?: string;
  priority: TicketPriority;
}

export const createTicket = async (
  sprintId: number,
  payload: CreateTicketPayload
) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/sprints/${sprintId}/tickets`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create ticket");
  }

  return res.json();
};









export interface TicketDetail {
  id: number;
  ticketNumber: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  sprintId: number;

  createdAt: string;
  updatedAt: string;

  createdBy: {
    id: number;
    name: string;
    role: string;
  };

  assignedTo: {
    id: number;
    name: string;
  } | null;

  comments: {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      name: string;
    };
  }[];

  attachments: {
    id: number;
    fileName: string;
    url?: string;
  }[];
}

export const getTicketById = async (ticketId: string): Promise<TicketDetail> => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/tickets/${ticketId}`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch ticket");
  }

  const data = await res.json();
  return data.ticket;
};



export const getAllTickets = async () => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/tickets`,
    { method: "GET" }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch tickets");
  }

  return res.json(); // { tickets, pagination }
};



export const assignTicket = async (
  ticketId: number,
  assignedToId: string | null
) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/tickets/${ticketId}/assign`,
    {
      method: "PATCH",
      body: JSON.stringify({ assignedToId }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to assign ticket");
  }

  return res.json();
};


export const updateTicketStatus = async (
  ticketId: number,
  status: TicketStatus
) => {
  const res = await authFetch(
    `${import.meta.env.VITE_API_BASE_URL}/tickets/${ticketId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update ticket status");
  }

  return res.json();
};