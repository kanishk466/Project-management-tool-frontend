// import { useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { getTicketById, mockUsers } from '@/data/mockData';
// import { TicketPriority, TicketStatus } from '@/types';
// import { TicketEditForm } from '@/components/tickets/TicketEditForm';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { ArrowLeft, Send, Paperclip, Trash2, User, Clock, Edit, Upload, X } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';

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

// export default function TicketDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const [newComment, setNewComment] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

//   const ticket = getTicketById(id || '');
//   const developers = mockUsers.filter(u => u.role === 'DEVELOPER');

//   if (!ticket) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <p className="text-muted-foreground mb-4">Ticket not found</p>
//         <Link to="/tickets">
//           <Button variant="outline">Back to Tickets</Button>
//         </Link>
//       </div>
//     );
//   }

//   const handleAddComment = () => {
//     if (!newComment.trim()) return;
//     toast({ title: 'Comment added', description: 'Your comment has been posted.' });
//     setNewComment('');
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setSelectedFiles(Array.from(e.target.files));
//     }
//   };

//   const handleUploadAttachment = () => {
//     if (selectedFiles.length === 0) return;
//     toast({ 
//       title: 'Files Uploaded', 
//       description: `${selectedFiles.length} file(s) have been attached.` 
//     });
//     setSelectedFiles([]);
//     setUploadDialogOpen(false);
//   };

//   const handleDeleteAttachment = (fileName: string) => {
//     toast({ title: 'Attachment Deleted', description: `${fileName} has been removed.` });
//   };

//   const handleStatusChange = (newStatus: string) => {
//     toast({ 
//       title: 'Status Updated', 
//       description: `Ticket status changed to ${newStatus.replace('_', ' ')}.` 
//     });
//   };

//   const handleAssigneeChange = (assigneeId: string) => {
//     const assignee = developers.find(d => d.id === assigneeId);
//     toast({ 
//       title: 'Assignee Updated', 
//       description: assignee ? `Assigned to ${assignee.name}.` : 'Ticket unassigned.' 
//     });
//   };

//   const canEdit = user?.role === 'TESTER' || user?.role === 'MANAGER';
//   const canAssign = user?.role === 'TESTER' || user?.role === 'MANAGER';
//   const canChangeStatus = user?.role === 'DEVELOPER' || user?.role === 'TESTER' || user?.role === 'MANAGER';

//   if (isEditing) {
//     return (
//       <div className="space-y-6 max-w-4xl">
//         <Link to="/tickets" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
//           <ArrowLeft className="h-4 w-4" />
//           Back to Tickets
//         </Link>

//         <div>
//           <h1 className="text-2xl font-bold mb-1">Edit Ticket</h1>
//           <p className="text-muted-foreground">{ticket.ticketNumber}</p>
//         </div>

//         <Card className="border-border">
//           <CardContent className="pt-6">
//             <TicketEditForm 
//               ticket={ticket} 
//               onSave={() => setIsEditing(false)} 
//               onCancel={() => setIsEditing(false)} 
//             />
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 max-w-4xl">
//       <Link to="/tickets" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
//         <ArrowLeft className="h-4 w-4" />
//         Back to Tickets
//       </Link>

//       {/* Header */}
//       <div className="space-y-3">
//         <div className="flex items-start justify-between">
//           <div>
//             <span className="text-sm font-mono text-muted-foreground">{ticket.ticketNumber}</span>
//             <h1 className="text-2xl font-bold mt-1">{ticket.title}</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             {canEdit && (
//               <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
//                 <Edit className="h-4 w-4 mr-2" />
//                 Edit
//               </Button>
//             )}
//             <Badge variant="outline" className={priorityStyles[ticket.priority]}>
//               {ticket.priority}
//             </Badge>
//             <Badge variant="secondary" className={statusStyles[ticket.status]}>
//               {ticket.status.replace('_', ' ')}
//             </Badge>
//           </div>
//         </div>
//         <p className="text-sm text-muted-foreground">
//           Sprint: <Link to={`/sprints/${ticket.sprintId}`} className="hover:underline">{ticket.sprintName}</Link>
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Description */}
//           <Card className="border-border">
//             <CardHeader>
//               <CardTitle className="text-base">Description</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-sm whitespace-pre-wrap">{ticket.description || 'No description provided.'}</p>
//             </CardContent>
//           </Card>

//           {/* Comments */}
//           <Card className="border-border">
//             <CardHeader>
//               <CardTitle className="text-base">Comments ({ticket.comments.length})</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {ticket.comments.map(comment => (
//                 <div key={comment.id} className="flex gap-3">
//                   <Avatar className="h-8 w-8">
//                     <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
//                       {comment?.userName.split(' ').map(n => n[0]).join('')}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-sm font-medium">{comment.userName}</span>
//                       <span className="text-xs text-muted-foreground">
//                         {new Date(comment.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <p className="text-sm text-muted-foreground">{comment.content}</p>
//                   </div>
//                 </div>
//               ))}

//               {ticket.comments.length === 0 && (
//                 <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
//               )}

//               <Separator />

//               <div className="space-y-3">
//                 <Textarea
//                   placeholder="Add a comment..."
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   className="min-h-[80px]"
//                 />
//                 <Button onClick={handleAddComment} className="gap-2" disabled={!newComment.trim()}>
//                   <Send className="h-4 w-4" />
//                   Post Comment
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Attachments */}
//           <Card className="border-border">
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle className="text-base">Attachments ({ticket.attachments.length})</CardTitle>
//               <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline" size="sm">
//                     <Upload className="h-4 w-4 mr-2" />
//                     Upload
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="bg-card border-border">
//                   <DialogHeader>
//                     <DialogTitle>Upload Attachments</DialogTitle>
//                   </DialogHeader>
//                   <div className="space-y-4">
//                     <div className="border-2 border-dashed border-border p-6 text-center">
//                       <input
//                         type="file"
//                         id="upload-files"
//                         multiple
//                         onChange={handleFileSelect}
//                         className="hidden"
//                       />
//                       <label htmlFor="upload-files" className="cursor-pointer flex flex-col items-center gap-2">
//                         <Upload className="h-8 w-8 text-muted-foreground" />
//                         <span className="text-sm text-muted-foreground">Click to select files</span>
//                       </label>
//                     </div>

//                     {selectedFiles.length > 0 && (
//                       <div className="space-y-2">
//                         {selectedFiles.map((file, index) => (
//                           <div key={index} className="flex items-center justify-between p-2 bg-muted/30 border border-border text-sm">
//                             <span className="truncate">{file.name}</span>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     <div className="flex justify-end gap-2">
//                       <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
//                       <Button onClick={handleUploadAttachment} disabled={selectedFiles.length === 0}>
//                         Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
//                       </Button>
//                     </div>
//                   </div>
//                 </DialogContent>
//               </Dialog>
//             </CardHeader>
//             <CardContent>
//               {ticket.attachments.length > 0 ? (
//                 <div className="space-y-2">
//                   {ticket.attachments.map(att => (
//                     <div key={att.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border">
//                       <div className="flex items-center gap-2">
//                         <Paperclip className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm">{att.fileName}</span>
//                       </div>
//                       <Button 
//                         variant="ghost" 
//                         size="sm"
//                         onClick={() => handleDeleteAttachment(att.fileName)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-muted-foreground text-center py-4">No attachments</p>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-4">
//           {/* Assignment */}
//           <Card className="border-border">
//             <CardHeader>
//               <CardTitle className="text-base">Assignment</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm text-muted-foreground mb-2 block">Assigned To</label>
//                 {canAssign ? (
//                   <Select 
//                     defaultValue={ticket.assigneeId || ''} 
//                     onValueChange={handleAssigneeChange}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Unassigned" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-card border-border">
//                       <SelectItem value="">Unassigned</SelectItem>
//                       {developers.map(dev => (
//                         <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 ) : (
//                   <div className="flex items-center gap-2 p-2 bg-muted/30 border border-border">
//                     <User className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm">{ticket.assigneeName || 'Unassigned'}</span>
//                   </div>
//                 )}
//               </div>

//               {canChangeStatus && (
//                 <div>
//                   <label className="text-sm text-muted-foreground mb-2 block">Status</label>
//                   <Select defaultValue={ticket.status} onValueChange={handleStatusChange}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent className="bg-card border-border">
//                       <SelectItem value="OPEN">Open</SelectItem>
//                       <SelectItem value="ASSIGNED">Assigned</SelectItem>
//                       <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
//                       <SelectItem value="RESOLVED">Resolved</SelectItem>
//                       <SelectItem value="CLOSED">Closed</SelectItem>
//                       <SelectItem value="REOPENED">Reopened</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           {/* Details */}
//           <Card className="border-border">
//             <CardHeader>
//               <CardTitle className="text-base">Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Reporter</span>
//                 <span>{ticket.reporterName}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Created</span>
//                 <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Updated</span>
//                 <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
//               </div>
//             </CardContent>
//           </Card>

//           {/* History */}
//           <Card className="border-border">
//             <CardHeader>
//               <CardTitle className="text-base">History</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-2 text-sm">
//                   <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
//                   <div>
//                     <p>Ticket created</p>
//                     <p className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleString()}</p>
//                   </div>
//                 </div>
//                 {ticket.assigneeName && (
//                   <div className="flex items-start gap-2 text-sm">
//                     <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
//                     <div>
//                       <p>Assigned to {ticket.assigneeName}</p>
//                       <p className="text-xs text-muted-foreground">{new Date(ticket.updatedAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }





import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { getTicketById, assignTicket  , updateTicketStatus} from '@/services/ticket.service';

import { useEffect, useState } from "react";
import { getDevelopers } from "@/services/user.service";


// import { getTicketById, mockUsers } from '@/data/mockData';
import { TicketPriority, TicketStatus } from '@/types';
import { TicketEditForm } from '@/components/tickets/TicketEditForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Send, Paperclip, Trash2, User, Clock, Edit, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const priorityStyles: Record<TicketPriority, string> = {
  HIGH: 'bg-destructive/10 text-destructive border-destructive/20',
  MEDIUM: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  LOW: 'bg-muted text-muted-foreground border-border',
};

const statusStyles: Record<TicketStatus, string> = {
  OPEN: 'bg-chart-1/10 text-chart-1',
  ASSIGNED: 'bg-chart-2/10 text-chart-2',
  IN_PROGRESS: 'bg-chart-5/10 text-chart-5',
  RESOLVED: 'bg-chart-4/10 text-chart-4',
  CLOSED: 'bg-muted text-muted-foreground',
  REOPENED: 'bg-destructive/10 text-destructive',
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // const ticket = getTicketById(id || '');
  // const developers = mockUsers.filter(u => u.role === 'DEVELOPER');

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [developers, setDevelopers] = useState<{ id: number; name: string }[]>([]);

  const canAssign = user?.role === 'TESTER' || user?.role === 'MANAGER';

  useEffect(() => {
    if (!id) return;

    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        setTicket(data);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to load ticket',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);



  useEffect(() => {
    if (!canAssign) return;

    const loadDevelopers = async () => {
      try {
        const data = await getDevelopers();
        setDevelopers(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load developers",
          variant: "destructive",
        });
      }
    };

    loadDevelopers();
  }, [canAssign]);


  if (loading) {
    return <p className="text-muted-foreground">Loading ticket...</p>;
  }


  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground mb-4">Ticket not found</p>
        <Link to="/tickets">
          <Button variant="outline">Back to Tickets</Button>
        </Link>
      </div>
    );
  }




  const handleAddComment = () => {
    if (!newComment.trim()) return;
    toast({ title: 'Comment added', description: 'Your comment has been posted.' });
    setNewComment('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadAttachment = () => {
    if (selectedFiles.length === 0) return;
    toast({
      title: 'Files Uploaded',
      description: `${selectedFiles.length} file(s) have been attached.`
    });
    setSelectedFiles([]);
    setUploadDialogOpen(false);
  };

  const handleDeleteAttachment = (fileName: string) => {
    toast({ title: 'Attachment Deleted', description: `${fileName} has been removed.` });
  };

  // const handleStatusChange = (newStatus: string) => {
  //   toast({
  //     title: 'Status Updated',
  //     description: `Ticket status changed to ${newStatus.replace('_', ' ')}.`
  //   });
  // };


  const handleStatusChange = async (newStatus: string) => {
  try {
    await updateTicketStatus(ticket.id, newStatus as TicketStatus);

    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus.replace("_", " ")}`,
    });

    // Update local UI state (no refetch needed)
    setTicket((prev: any) =>
      prev ? { ...prev, status: newStatus } : prev
    );
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  }
};







  const handleAssigneeChange = async (value: string) => {
    const assignedToId = value === "UNASSIGNED" ? null : value;

    try {
      await assignTicket(ticket.id, assignedToId);

      toast({
        title: "Assignee Updated",
        description: assignedToId
          ? "Ticket assigned successfully"
          : "Ticket unassigned",
      });

      setTicket((prev: any) =>
        prev
          ? {
            ...prev,
            assignedTo: assignedToId
              ? { id: Number(assignedToId), name: "Assigned User" }
              : null,
          }
          : prev
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };



  const canEdit = user?.role === 'TESTER' || user?.role === 'MANAGER';

  const canChangeStatus = user?.role === 'DEVELOPER' || user?.role === 'TESTER' || user?.role === 'MANAGER';

  if (isEditing) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Link to="/tickets" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Link>

        <div>
          <h1 className="text-2xl font-bold mb-1">Edit Ticket</h1>
          <p className="text-muted-foreground">{ticket.ticketNumber}</p>
        </div>

        <Card className="border-border">
          <CardContent className="pt-6">
            <TicketEditForm
              ticket={ticket}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/tickets" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Tickets
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-sm font-mono text-muted-foreground">{ticket.ticketNumber}</span>
            <h1 className="text-2xl font-bold mt-1">{ticket.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            <Badge variant="outline" className={priorityStyles[ticket.priority]}>
              {ticket.priority}
            </Badge>
            <Badge variant="secondary" className={statusStyles[ticket.status]}>
              {ticket.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        {/* <p className="text-sm text-muted-foreground">
          Sprint: <Link to={`/sprints/${ticket.sprintId}`} className="hover:underline">{ticket.sprintName}</Link>
        </p> */}

        <Link to={`/sprints/${ticket.sprintId}`} className="hover:underline">
          Sprint #{ticket.sprintId}
        </Link>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{ticket.description || 'No description provided.'}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Comments ({ticket.comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                      {comment?.userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}

              {ticket.comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
              )}

              <Separator />

              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button onClick={handleAddComment} className="gap-2" disabled={!newComment.trim()}>
                  <Send className="h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Attachments ({ticket.attachments.length})</CardTitle>
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Upload Attachments</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border p-6 text-center">
                      <input
                        type="file"
                        id="upload-files"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label htmlFor="upload-files" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to select files</span>
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/30 border border-border text-sm">
                            <span className="truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleUploadAttachment} disabled={selectedFiles.length === 0}>
                        Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {ticket.attachments.length > 0 ? (
                <div className="space-y-2">
                  {ticket.attachments.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{att.fileName}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAttachment(att.fileName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No attachments</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Assignment */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">


              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Assigned To
                </label>

                {canAssign ? (

                  <Select
                    value={ticket.assignedTo?.id?.toString() || "UNASSIGNED"}
                    onValueChange={handleAssigneeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>

                    <SelectContent className="bg-card border-border">
                      <SelectItem value="UNASSIGNED">Unassigned</SelectItem>

                      {developers.map((dev) => (
                        <SelectItem key={dev.id} value={dev.id.toString()}>
                          {dev.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted/30 border border-border">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {ticket.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>
                )}
              </div>


              {canChangeStatus && (
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                  <Select defaultValue={ticket.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="ASSIGNED">Assigned</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="RESOLVED">Resolved</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="REOPENED">Reopened</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reporter</span>
                <span>{ticket.reporterName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>Ticket created</p>
                    <p className="text-xs text-muted-foreground">{new Date(ticket.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {ticket.assigneeName && (
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>Assigned to {ticket.assigneeName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ticket.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}






