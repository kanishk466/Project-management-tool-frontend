// import { Link } from 'react-router-dom';
// import { Ticket, TicketPriority, TicketStatus } from '@/types';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { MessageSquare, Paperclip } from 'lucide-react';

// interface TicketCardProps {
//   ticket: Ticket;
//   compact?: boolean;
// }

// const priorityStyles: Record<TicketPriority, string> = {
//   HIGH: 'bg-destructive/10 text-destructive border-destructive/20',
//   MEDIUM: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
//   LOW: 'bg-muted text-muted-foreground border-border',
// };

// const statusStyles: Record<TicketStatus, string> = {
//   OPEN: 'bg-chart-1/10 text-chart-1',
//   ASSIGNED: 'bg-chart-2/10 text-chart-2',
//   IN_PROGRESS: 'bg-chart-5/10 text-chart-5',
//   RESOLVED: 'bg-chart-4/10 text-chart-4',
//   CLOSED: 'bg-muted text-muted-foreground',
//   REOPENED: 'bg-destructive/10 text-destructive',
// };

// export function TicketCard({ ticket, compact = false }: TicketCardProps) {
//   return (
//     <Link to={`/tickets/${ticket.id}`}>
//       <Card className="hover:shadow-md transition-shadow cursor-pointer border-border">
//         <CardContent className={compact ? 'p-3' : 'p-4'}>
//           <div className="flex items-start justify-between gap-2 mb-2">
//             <span className="text-xs font-mono text-muted-foreground">{ticket.ticketNumber}</span>
//             <Badge variant="outline" className={priorityStyles[ticket.priority]}>
//               {ticket.priority}
//             </Badge>
//           </div>
          
//           <h4 className={`font-medium mb-2 line-clamp-2 ${compact ? 'text-sm' : ''}`}>
//             {ticket.title}
//           </h4>
          
//           {!compact && (
//             <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
//               {ticket.description}
//             </p>
//           )}
          
//           <div className="flex items-center justify-between">
//             <Badge variant="secondary" className={statusStyles[ticket.status]}>
//               {ticket.status.replace('_', ' ')}
//             </Badge>
            
//             <div className="flex items-center gap-3">
//               {ticket.comments.length > 0 && (
//                 <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                   <MessageSquare className="h-3 w-3" />
//                   {ticket.comments.length}
//                 </span>
//               )}
//               {ticket.attachments.length > 0 && (
//                 <span className="flex items-center gap-1 text-xs text-muted-foreground">
//                   <Paperclip className="h-3 w-3" />
//                   {ticket.attachments.length}
//                 </span>
//               )}
//               {ticket.assigneeName && (
//                 <Avatar className="h-6 w-6">
//                   <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
//                     {ticket.assigneeName.split(' ').map(n => n[0]).join('')}
//                   </AvatarFallback>
//                 </Avatar>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { Ticket, TicketPriority, TicketStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Paperclip, Wand2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/hooks/use-toast";

interface TicketCardProps {
  ticket: Ticket;
  compact?: boolean;
}

const priorityStyles: Record<TicketPriority, string> = {
  HIGH: "bg-destructive/10 text-destructive border-destructive/20",
  MEDIUM: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  LOW: "bg-muted text-muted-foreground border-border",
};

const statusStyles: Record<TicketStatus, string> = {
  OPEN: "bg-chart-1/10 text-chart-1",
  ASSIGNED: "bg-chart-2/10 text-chart-2",
  IN_PROGRESS: "bg-chart-5/10 text-chart-5",
  RESOLVED: "bg-chart-4/10 text-chart-4",
  CLOSED: "bg-muted text-muted-foreground",
  REOPENED: "bg-destructive/10 text-destructive",
};

export function TicketCard({ ticket, compact = false }: TicketCardProps) {
  const commentCount = ticket.comments?.length ?? 0;
  const attachmentCount = ticket.attachments?.length ?? 0;
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTestCases, setHasTestCases] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("Rendering TicketCard for ticket:", ticket);
  
  const handleGenerateTestCases = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsGenerating(true);
    try {
      const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/tickets/${ticket.id}/generate-testcases`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate test cases");
      }

      toast({
        title: "Success",
        description: "Test cases generated successfully!",
      });
      setHasTestCases(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate test cases",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewTestCases = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/tickets/${ticket.id}/testcases`);
  };

  return (
    <Link to={`/tickets/${ticket.id}`} onClick={(e) => ticket.status === 'RESOLVED' ? null : null}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-border">
        <CardContent className={compact ? "p-3" : "p-4"}>
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">
              {ticket.ticketNumber}
            </span>

            <Badge variant="outline" className={priorityStyles[ticket.priority]}>
              {ticket.priority}
            </Badge>
          </div>

          {/* Title */}
          <h4
            className={`font-medium mb-2 line-clamp-2 ${
              compact ? "text-sm" : ""
            }`}
          >
            {ticket.title}
          </h4>

          {/* Description */}
          {!compact && ticket.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {ticket.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className={statusStyles[ticket.status]}
            >
              {ticket.status.replace("_", " ")}
            </Badge>

            <div className="flex items-center gap-2">
              {ticket.status === "RESOLVED" && (
                <div className="flex items-center gap-1">
                  {!ticket?.aiTestGenerated && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerateTestCases}
                      disabled={isGenerating}
                      className="h-7 px-2"
                    >
                      <Wand2 className="h-3.5 w-3.5 mr-1" />
                      {isGenerating ? "Generating..." : "AI Generate"}
                    </Button>
                  )}
                  {ticket?.aiTestGenerated === true && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleViewTestCases}
                      className="h-7 px-2 border-green-200 bg-green-50 hover:bg-green-100"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />
                      View Test Cases
                    </Button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3">
                {commentCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {commentCount}
                  </span>
                )}

                {attachmentCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Paperclip className="h-3 w-3" />
                    {attachmentCount}
                  </span>
                )}

                {ticket.assigneeName && (
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                      {ticket.assigneeName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
