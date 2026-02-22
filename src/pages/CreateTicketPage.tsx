import { useSearchParams, Link } from 'react-router-dom';
import { TicketForm } from '@/components/tickets/TicketForm';
import { ArrowLeft } from 'lucide-react';

export default function CreateTicketPage() {
const [searchParams] = useSearchParams();
const sprintId = searchParams.get('sprint') || undefined;

return (
  <div className="space-y-6 max-w-3xl">
    <div>
      <Link 
        to={sprintId ? `/sprints/${sprintId}` : '/tickets'} 
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <h1 className="text-2xl font-bold mb-1">Create New Ticket</h1>
      <p className="text-muted-foreground">Report a bug or request a feature</p>
    </div>

    <TicketForm sprintId={sprintId} />
  </div>
);
}
