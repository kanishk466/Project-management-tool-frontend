import { Ticket, TicketStatus } from '@/types';
import { TicketCard } from './TicketCard';

interface KanbanBoardProps {
  tickets: Ticket[];
}

const columns: { status: TicketStatus; label: string }[] = [
  { status: 'OPEN', label: 'Open' },
  { status: 'ASSIGNED', label: 'Assigned' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'RESOLVED', label: 'Resolved' },
];

export function KanbanBoard({ tickets }: KanbanBoardProps) {
  const getTicketsByStatus = (status: TicketStatus) =>
    tickets.filter(t => t.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(column => (
        <div key={column.status} className="flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
            <h3 className="font-semibold text-sm">{column.label}</h3>
            <span className="text-xs bg-muted px-2 py-0.5 text-muted-foreground">
              {getTicketsByStatus(column.status).length}
            </span>
          </div>
          <div className="flex flex-col gap-3 min-h-[200px]">
            {getTicketsByStatus(column.status).map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} compact />
            ))}
            {getTicketsByStatus(column.status).length === 0 && (
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border p-4">
                No tickets
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
