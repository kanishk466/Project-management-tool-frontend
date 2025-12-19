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



import { Link } from "react-router-dom";
import { Ticket, TicketPriority, TicketStatus } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Paperclip } from "lucide-react";

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

  return (
    <Link to={`/tickets/${ticket.id}`}>
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
        </CardContent>
      </Card>
    </Link>
  );
}
