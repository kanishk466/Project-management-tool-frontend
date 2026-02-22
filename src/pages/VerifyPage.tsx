import { useState, useEffect } from 'react';
import { getAllTickets, updateTicketStatus } from '@/services/ticket.service';
import { TicketCard } from '@/components/tickets/TicketCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Ticket } from '@/types';

export default function VerifyPage() {
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResolvedTickets = async () => {
      try {
        setLoading(true);
        const response = await getAllTickets();
        const tickets = response.tickets.filter((ticket: Ticket) => ticket.status === 'RESOLVED');
        setResolvedTickets(tickets);
      } catch (err) {
        setError('Failed to fetch resolved tickets');
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedTickets();
  }, []);

  const handleVerify = async (ticketId: number) => {
    try {
      await updateTicketStatus(ticketId, 'CLOSED');
      setResolvedTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      toast({ title: 'Ticket Verified', description: `Ticket has been marked as closed.` });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to verify ticket', variant: 'destructive' });
      console.error('Error verifying ticket:', err);
    }
  };

  const handleReopen = async (ticketId: number) => {
    try {
      await updateTicketStatus(ticketId, 'REOPENED');
      setResolvedTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      toast({ title: 'Ticket Reopened', description: `Ticket has been reopened.` });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to reopen ticket', variant: 'destructive' });
      console.error('Error reopening ticket:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Verification Queue</h1>
          <p className="text-muted-foreground">Review and verify resolved tickets</p>
        </div>
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Loading tickets...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Verification Queue</h1>
          <p className="text-muted-foreground">Review and verify resolved tickets</p>
        </div>
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Verification Queue</h1>
        <p className="text-muted-foreground">Review and verify resolved tickets</p>
      </div>

      {resolvedTickets.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tickets pending verification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {resolvedTickets.map(ticket => (
            <Card key={ticket.id} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <TicketCard ticket={ticket} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleVerify(ticket.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Verify & Close
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleReopen(ticket.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reopen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
