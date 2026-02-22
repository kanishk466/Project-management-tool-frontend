import { useAuth } from '@/contexts/AuthContext';
import { getDeveloperTickets } from '@/data/mockData';
import { TicketCard } from '@/components/tickets/TicketCard';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function MyTicketsPage() {
  const { user } = useAuth();
  
  // For demo, use mock developer IDs
  const userId = user?.role === 'developer' ? (user.id === '3' ? '3' : '4') : user?.id || '';
  const myTickets = getDeveloperTickets(userId);

  const inProgressTickets = myTickets.filter(t => t.status === 'IN_PROGRESS');
  const assignedTickets = myTickets.filter(t => t.status === 'ASSIGNED');
  const resolvedTickets = myTickets.filter(t => t.status === 'RESOLVED');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">My Tickets</h1>
        <p className="text-muted-foreground">Tickets assigned to you</p>
      </div>

      {myTickets.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tickets assigned to you</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {inProgressTickets.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                In Progress
                <span className="text-sm font-normal bg-chart-5/10 text-chart-5 px-2 py-0.5">
                  {inProgressTickets.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          )}

          {assignedTickets.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Assigned
                <span className="text-sm font-normal bg-chart-2/10 text-chart-2 px-2 py-0.5">
                  {assignedTickets.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          )}

          {resolvedTickets.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Resolved
                <span className="text-sm font-normal bg-chart-4/10 text-chart-4 px-2 py-0.5">
                  {resolvedTickets.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resolvedTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
