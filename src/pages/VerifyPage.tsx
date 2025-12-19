import { getResolvedTickets } from '@/data/mockData';
import { TicketCard } from '@/components/tickets/TicketCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, CheckCircle, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function VerifyPage() {
  const resolvedTickets = getResolvedTickets();

  const handleVerify = (ticketNumber: string) => {
    toast({ title: 'Ticket Verified', description: `${ticketNumber} has been marked as closed.` });
  };

  const handleReopen = (ticketNumber: string) => {
    toast({ title: 'Ticket Reopened', description: `${ticketNumber} has been reopened.` });
  };

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
                      onClick={() => handleVerify(ticket.ticketNumber)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Verify & Close
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleReopen(ticket.ticketNumber)}
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
