// import { Link , useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { mockSprints } from '@/data/mockData';
// import { SprintStatus } from '@/types';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Plus, Calendar, Ticket } from 'lucide-react';

// const statusStyles: Record<SprintStatus, string> = {
//   PLANNING: 'bg-chart-2/10 text-chart-2',
//   ACTIVE: 'bg-chart-5/10 text-chart-5',
//   COMPLETED: 'bg-muted text-muted-foreground',
// };

// export default function SprintsPage() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold mb-1">Sprints</h1>
//           <p className="text-muted-foreground">Manage and track your sprint cycles</p>
//         </div>
//         {user?.role === 'MANAGER' && (
//           <Button  onClick={() => navigate('/sprints/create')} className="gap-2">
//             <Plus className="h-4 w-4" />
//             Create Sprint
//           </Button>
//         )}
//       </div>

//       <div className="grid gap-4">
//         {mockSprints.map(sprint => (
//           <Link key={sprint.id} to={`/sprints/${sprint.id}`}>
//             <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <CardTitle className="text-lg">{sprint.name}</CardTitle>
//                       <Badge variant="secondary" className={statusStyles[sprint.status]}>
//                         {sprint.status}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-4">{sprint.description}</p>
//                     <div className="flex items-center gap-6 text-sm text-muted-foreground">
//                       <span className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                         {sprint.startDate} → {sprint.endDate}
//                       </span>
//                       <span className="flex items-center gap-2">
//                         <Ticket className="h-4 w-4" />
//                         {sprint.ticketCount} tickets
//                       </span>
//                     </div>
//                   </div>
//                   <Button variant="outline" size="sm">
//                     View Board
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getSprints, Sprint } from "@/services/sprint.service";
import { SprintStatus } from "@/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Ticket } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<SprintStatus, string> = {
  PLANNING: "bg-chart-2/10 text-chart-2",
  ACTIVE: "bg-chart-5/10 text-chart-5",
  COMPLETED: "bg-muted text-muted-foreground",
};

export default function SprintsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const data = await getSprints();
        setSprints(data);
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

    fetchSprints();
  }, []);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Sprints</h1>
          <p className="text-muted-foreground">
            Manage and track your sprint cycles
          </p>
        </div>

        {user?.role === "MANAGER" && (
          <Button onClick={() => navigate("/sprints/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Sprint
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading sprints...</p>
      ) : (
        <div className="grid gap-4">
          {sprints.map((sprint) => (
            <Link key={sprint.id} to={`/sprints/${sprint.id}`}>
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">
                          {sprint.name}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className={statusStyles[sprint.status]}
                        >
                          {sprint.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        {sprint.goal || "No sprint goal defined"}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(sprint.startDate)} →{" "}
                          {formatDate(sprint.endDate)}
                        </span>

                        {/* Placeholder – replace when ticket API is ready */}
                        <span className="flex items-center gap-2">
                          <Ticket className="h-4 w-4" />
                          0 tickets
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm">
                      View Board
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
