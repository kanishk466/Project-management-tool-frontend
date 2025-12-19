export type UserRole = 'MANAGER' | 'TESTER' | 'DEVELOPER';

export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REOPENED';

export type TicketPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Sprint {
  id: string;
  name: string;
  description: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  ticketCount: number;
}

// export interface Ticket {
//   id: string;
//   ticketNumber: string;
//   title: string;
//   description: string;
//   status: TicketStatus;
//   priority: TicketPriority;
//   sprintId: string;
//   sprintName: string;
//   assigneeId?: string;
//   assigneeName?: string;
//   reporterId: string;
//   reporterName: string;
//   createdAt: string;
//   updatedAt: string;
//   attachments: Attachment[];
//   comments: Comment[];
// }


export interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  description?: string;

  status: TicketStatus;
  priority: TicketPriority;

  createdById: number;
  assignedToId: number | null;

  // Optional (future-ready)
  assigneeName?: string;
  comments?: { id: number }[];
  attachments?: { id: number }[];
}


export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  action: string;
  fromStatus?: TicketStatus;
  toStatus?: TicketStatus;
  userId: string;
  userName: string;
  createdAt: string;
}
