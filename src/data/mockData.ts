import { User, Sprint, Ticket, Comment, Attachment } from '@/types';

export const mockUsers: User[] = [
  { id: '1', name: 'John Manager', email: 'john@rpm.dev', role: 'manager' },
  { id: '2', name: 'Sarah Tester', email: 'sarah@rpm.dev', role: 'tester' },
  { id: '3', name: 'Mike Developer', email: 'mike@rpm.dev', role: 'developer' },
  { id: '4', name: 'Anna Developer', email: 'anna@rpm.dev', role: 'developer' },
];

export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 12 - Core Fixes',
    description: 'Critical bug fixes for the core module',
    status: 'ACTIVE',
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    ticketCount: 8,
  },
  {
    id: 'sprint-2',
    name: 'Sprint 11 - UI Improvements',
    description: 'User interface enhancements',
    status: 'COMPLETED',
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    ticketCount: 12,
  },
  {
    id: 'sprint-3',
    name: 'Sprint 13 - API Integration',
    description: 'Third-party API integrations',
    status: 'PLANNING',
    startDate: '2024-01-30',
    endDate: '2024-02-12',
    ticketCount: 5,
  },
];

export const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    ticketNumber: 'TKT-101',
    title: 'BP Graph not loading on dashboard',
    description: 'The blood pressure graph component fails to render when there are more than 100 data points. Need to implement pagination or virtualization.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    sprintId: 'sprint-1',
    sprintName: 'Sprint 12 - Core Fixes',
    assigneeId: '3',
    assigneeName: 'Mike Developer',
    reporterId: '2',
    reporterName: 'Sarah Tester',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z',
    attachments: [
      { id: 'att-1', ticketId: 'ticket-1', fileName: 'error-screenshot.png', fileUrl: '#', uploadedAt: '2024-01-16T10:00:00Z' }
    ],
    comments: [
      { id: 'com-1', ticketId: 'ticket-1', userId: '3', userName: 'Mike Developer', content: 'Working on implementing virtualized list', createdAt: '2024-01-17T09:00:00Z' },
      { id: 'com-2', ticketId: 'ticket-1', userId: '2', userName: 'Sarah Tester', content: 'Please check the console logs, there might be memory leak', createdAt: '2024-01-17T11:00:00Z' },
    ],
  },
  {
    id: 'ticket-2',
    ticketNumber: 'TKT-102',
    title: 'Data sync fails intermittently',
    description: 'Users report that data synchronization between devices fails randomly. Need to investigate the sync mechanism.',
    status: 'OPEN',
    priority: 'HIGH',
    sprintId: 'sprint-1',
    sprintName: 'Sprint 12 - Core Fixes',
    reporterId: '2',
    reporterName: 'Sarah Tester',
    createdAt: '2024-01-17T08:00:00Z',
    updatedAt: '2024-01-17T08:00:00Z',
    attachments: [],
    comments: [],
  },
  {
    id: 'ticket-3',
    ticketNumber: 'TKT-103',
    title: 'Login session expires too quickly',
    description: 'Users are being logged out after 5 minutes of inactivity. Should be 30 minutes.',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    sprintId: 'sprint-1',
    sprintName: 'Sprint 12 - Core Fixes',
    assigneeId: '4',
    assigneeName: 'Anna Developer',
    reporterId: '1',
    reporterName: 'John Manager',
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    attachments: [],
    comments: [],
  },
  {
    id: 'ticket-4',
    ticketNumber: 'TKT-104',
    title: 'Export PDF button not working',
    description: 'The PDF export feature throws an error when clicked.',
    status: 'RESOLVED',
    priority: 'LOW',
    sprintId: 'sprint-1',
    sprintName: 'Sprint 12 - Core Fixes',
    assigneeId: '3',
    assigneeName: 'Mike Developer',
    reporterId: '2',
    reporterName: 'Sarah Tester',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    attachments: [],
    comments: [
      { id: 'com-3', ticketId: 'ticket-4', userId: '3', userName: 'Mike Developer', content: 'Fixed the PDF library version mismatch', createdAt: '2024-01-18T16:00:00Z' },
    ],
  },
  {
    id: 'ticket-5',
    ticketNumber: 'TKT-105',
    title: 'Mobile responsive issues',
    description: 'Several components break on mobile viewport sizes.',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    sprintId: 'sprint-1',
    sprintName: 'Sprint 12 - Core Fixes',
    assigneeId: '4',
    assigneeName: 'Anna Developer',
    reporterId: '2',
    reporterName: 'Sarah Tester',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-18T15:00:00Z',
    attachments: [],
    comments: [],
  },
  {
    id: 'ticket-6',
    ticketNumber: 'TKT-106',
    title: 'Add dark mode support',
    description: 'Implement system-wide dark mode toggle.',
    status: 'OPEN',
    priority: 'LOW',
    sprintId: 'sprint-1',
    sprintName: 'Sprint 12 - Core Fixes',
    reporterId: '1',
    reporterName: 'John Manager',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
    attachments: [],
    comments: [],
  },
];

export const getDeveloperTickets = (userId: string) => 
  mockTickets.filter(t => t.assigneeId === userId);

export const getResolvedTickets = () => 
  mockTickets.filter(t => t.status === 'RESOLVED');

export const getTicketsBySprintId = (sprintId: string) =>
  mockTickets.filter(t => t.sprintId === sprintId);

export const getTicketById = (ticketId: string) =>
  mockTickets.find(t => t.id === ticketId);

export const getSprintById = (sprintId: string) =>
  mockSprints.find(s => s.id === sprintId);
