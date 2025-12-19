// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { getSprintById, getTicketsBySprintId } from '@/data/mockData';
// import { SprintStatus } from '@/types';
// import { KanbanBoard } from '@/components/tickets/KanbanBoard';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { ArrowLeft, Plus, Calendar, Play, CheckCircle } from 'lucide-react';

// const statusStyles: Record<SprintStatus, string> = {
//   PLANNING: 'bg-chart-2/10 text-chart-2',
//   ACTIVE: 'bg-chart-5/10 text-chart-5',
//   COMPLETED: 'bg-muted text-muted-foreground',
// };

// export default function SprintDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const sprint = getSprintById(id || '');
//   const tickets = getTicketsBySprintId(id || '');

//   if (!sprint) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <p className="text-muted-foreground mb-4">Sprint not found</p>
//         <Link to="/sprints">
//           <Button variant="outline">Back to Sprints</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-start justify-between">
//         <div>
//           <Link to="/sprints" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2">
//             <ArrowLeft className="h-4 w-4" />
//             Back to Sprints
//           </Link>
//           <div className="flex items-center gap-3">
//             <h1 className="text-2xl font-bold">{sprint.name}</h1>
//             <Badge variant="secondary" className={statusStyles[sprint.status]}>
//               {sprint.status}
//             </Badge>
//           </div>
//           <p className="text-muted-foreground mt-1">{sprint.description}</p>
//         </div>

//         <div className="flex items-center gap-2">
//           {(user?.role === 'TESTER' || user?.role === 'MANAGER') && (
//             <Button className="gap-2" onClick={() => navigate(`/tickets/create?sprint=${id}`)}>
//               <Plus className="h-4 w-4" />
//               Create Ticket
//             </Button>
//           )}
//           {user?.role === 'MANAGER' && sprint.status === 'PLANNING' && (
//             <Button variant="outline" className="gap-2">
//               <Play className="h-4 w-4" />
//               Activate Sprint
//             </Button>
//           )}
//           {user?.role === 'MANAGER' && sprint.status === 'ACTIVE' && (
//             <Button variant="outline" className="gap-2">
//               <CheckCircle className="h-4 w-4" />
//               Complete Sprint
//             </Button>
//           )}
//         </div>
//       </div>

//       <Card className="border-border">
//         <CardContent className="p-4">
//           <div className="flex items-center gap-6 text-sm">
//             <span className="flex items-center gap-2 text-muted-foreground">
//               <Calendar className="h-4 w-4" />
//               {sprint.startDate} → {sprint.endDate}
//             </span>
//             <span className="text-muted-foreground">
//               {tickets.length} tickets in sprint
//             </span>
//           </div>
//         </CardContent>
//       </Card>

//       <div>
//         <h2 className="text-lg font-semibold mb-4">Sprint Board</h2>
//         <KanbanBoard tickets={tickets} />
//       </div>
//     </div>
//   );
// }



import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getSprintById, SprintDetail } from "@/services/sprint.service";
import { SprintStatus } from "@/types";
import { KanbanBoard } from "@/components/tickets/KanbanBoard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Calendar, Play, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<SprintStatus, string> = {
  PLANNED: "bg-chart-2/10 text-chart-2",
  ACTIVE: "bg-chart-5/10 text-chart-5",
  COMPLETED: "bg-muted text-muted-foreground",
};

export default function SprintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sprint, setSprint] = useState<SprintDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSprint = async () => {
      try {
        const data = await getSprintById(id);
        setSprint(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSprint();
  }, [id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return <p className="text-muted-foreground">Loading sprint...</p>;
  }

  if (!sprint) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Sprint not found</p>
        <Link to="/sprints">
          <Button variant="outline">Back to Sprints</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/sprints"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sprints
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{sprint.name}</h1>
            <Badge
              variant="secondary"
              className={statusStyles[sprint.status]}
            >
              {sprint.status}
            </Badge>
          </div>

          <p className="text-muted-foreground mt-1">
            {sprint.goal || "No sprint goal defined"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {(user?.role === "TESTER" || user?.role === "MANAGER") && (
            <Button
              className="gap-2"
              onClick={() => navigate(`/tickets/create?sprint=${id}`)}
            >
              <Plus className="h-4 w-4" />
              Create Ticket
            </Button>
          )}

          {user?.role === "MANAGER" && sprint.status === "PLANNED" && (
            <Button variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Activate Sprint
            </Button>
          )}

          {user?.role === "MANAGER" && sprint.status === "ACTIVE" && (
            <Button variant="outline" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Complete Sprint
            </Button>
          )}
        </div>
      </div>

      {/* Meta */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(sprint.startDate)} →{" "}
              {formatDate(sprint.endDate)}
            </span>
            <span className="text-muted-foreground">
              {sprint.tickets.length} tickets in sprint
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Board */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Sprint Board</h2>
        <KanbanBoard tickets={sprint.tickets} />
      </div>
    </div>
  );
}
