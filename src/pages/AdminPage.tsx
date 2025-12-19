// import { mockSprints, mockTickets, mockUsers } from '@/data/mockData';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Users, Rocket, Ticket, Settings, Play, Square } from 'lucide-react';
// import { SprintStatus } from '@/types';
// import { toast } from '@/hooks/use-toast';

// const statusStyles: Record<SprintStatus, string> = {
//   PLANNING: 'bg-chart-2/10 text-chart-2',
//   ACTIVE: 'bg-chart-5/10 text-chart-5',
//   COMPLETED: 'bg-muted text-muted-foreground',
// };

// export default function AdminPage() {
//   const handleActivateSprint = (sprintName: string) => {
//     toast({ title: 'Sprint Activated', description: `${sprintName} is now active.` });
//   };

//   const handleCompleteSprint = (sprintName: string) => {
//     toast({ title: 'Sprint Completed', description: `${sprintName} has been marked as complete.` });
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
//         <p className="text-muted-foreground">Manage sprints and team settings</p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <Card className="border-border">
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="p-3 bg-primary/10">
//               <Users className="h-6 w-6 text-primary" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold">{mockUsers.length}</p>
//               <p className="text-sm text-muted-foreground">Team Members</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="border-border">
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="p-3 bg-primary/10">
//               <Rocket className="h-6 w-6 text-primary" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold">{mockSprints.length}</p>
//               <p className="text-sm text-muted-foreground">Total Sprints</p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="border-border">
//           <CardContent className="p-4 flex items-center gap-4">
//             <div className="p-3 bg-primary/10">
//               <Ticket className="h-6 w-6 text-primary" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold">{mockTickets.length}</p>
//               <p className="text-sm text-muted-foreground">Total Tickets</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Sprint Control */}
//       <Card className="border-border">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5" />
//             Sprint Control
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {mockSprints.map(sprint => (
//               <div key={sprint.id} className="flex items-center justify-between p-4 bg-muted/30 border border-border">
//                 <div className="flex items-center gap-4">
//                   <div>
//                     <p className="font-medium">{sprint.name}</p>
//                     <p className="text-sm text-muted-foreground">{sprint.startDate} → {sprint.endDate}</p>
//                   </div>
//                   <Badge variant="secondary" className={statusStyles[sprint.status]}>
//                     {sprint.status}
//                   </Badge>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {sprint.status === 'PLANNING' && (
//                     <Button 
//                       size="sm" 
//                       className="gap-2"
//                       onClick={() => handleActivateSprint(sprint.name)}
//                     >
//                       <Play className="h-4 w-4" />
//                       Activate
//                     </Button>
//                   )}
//                   {sprint.status === 'ACTIVE' && (
//                     <Button 
//                       variant="outline" 
//                       size="sm" 
//                       className="gap-2"
//                       onClick={() => handleCompleteSprint(sprint.name)}
//                     >
//                       <Square className="h-4 w-4" />
//                       Complete
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Team Members */}
//       <Card className="border-border">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="h-5 w-5" />
//             Team Members
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             {mockUsers.map(member => (
//               <div key={member.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border">
//                 <div>
//                   <p className="font-medium">{member.name}</p>
//                   <p className="text-sm text-muted-foreground">{member.email}</p>
//                 </div>
//                 <Badge variant="outline" className="capitalize">{member.role}</Badge>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Rocket, Ticket, Settings, Play, Square } from "lucide-react";
import { SprintStatus } from "@/types";
import { toast } from "@/hooks/use-toast";
import {
  getSprints,
  activateSprint,
  completeSprint,
  SprintAdmin,
} from "@/services/sprint.service";

const statusStyles: Record<SprintStatus, string> = {
  PLANNED: "bg-chart-2/10 text-chart-2",
  ACTIVE: "bg-chart-5/10 text-chart-5",
  COMPLETED: "bg-muted text-muted-foreground",
};

export default function AdminPage() {
  const [sprints, setSprints] = useState<SprintAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSprints = async () => {
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

  useEffect(() => {
    loadSprints();
  }, []);

  const handleActivateSprint = async (sprint: SprintAdmin) => {
    try {
      await activateSprint(sprint.id);
      toast({
        title: "Sprint Activated",
        description: `${sprint.name} is now active`,
      });
      loadSprints();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteSprint = async (sprint: SprintAdmin) => {
    try {
      await completeSprint(sprint.id);
      toast({
        title: "Sprint Completed",
        description: `${sprint.name} marked as complete`,
      });
      loadSprints();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage sprints and team settings
        </p>
      </div>

      {/* Stats (API later) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">—</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sprints.length}</p>
              <p className="text-sm text-muted-foreground">Total Sprints</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">—</p>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sprint Control */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sprint Control
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading sprints...</p>
          ) : (
            <div className="space-y-4">
              {sprints.map((sprint) => (
                <div
                  key={sprint.id}
                  className="flex items-center justify-between p-4 bg-muted/30 border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{sprint.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(sprint.startDate).toLocaleDateString()} →{" "}
                        {new Date(sprint.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <Badge
                      variant="secondary"
                      className={statusStyles[sprint.status]}
                    >
                      {sprint.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    {sprint.status === "PLANNED" && (
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleActivateSprint(sprint)}
                      >
                        <Play className="h-4 w-4" />
                        Activate
                      </Button>
                    )}

                    {sprint.status === "ACTIVE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleCompleteSprint(sprint)}
                      >
                        <Square className="h-4 w-4" />
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}