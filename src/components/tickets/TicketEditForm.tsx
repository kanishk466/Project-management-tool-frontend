import { useState } from 'react';
import { Ticket, TicketPriority, TicketStatus , Sprint } from '@/types';
import { mockSprints, mockUsers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, Upload, X, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateTicket, UpdateTicketPayload, TicketDetail } from '@/services/ticket.service';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TicketEditFormProps {
  ticket: TicketDetail;
  onSave: () => void;
  onCancel: () => void;
}

export function TicketEditForm({ ticket, onSave, onCancel }: TicketEditFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachmentsToRemove, setAttachmentsToRemove] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: ticket.title,
    description: ticket.description || '',
    priority: ticket.priority,
    status: ticket.status,
    sprintId: ticket.sprintId,
    assigneeId: ticket.assignedTo?.id.toString() || '',
  });

  // Permission checks
  const userRole = user?.role;
  const isSprintCompleted = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
  const canEditTitle = userRole === 'TESTER' && !isSprintCompleted;
  const canEditDescription = userRole === 'TESTER' && !isSprintCompleted;
  const canEditPriority = userRole === 'MANAGER' && !isSprintCompleted;
  const canEditStatus = userRole === 'DEVELOPER' && !isSprintCompleted;
  const canAddAttachments = userRole === 'TESTER' && !isSprintCompleted;
  const canRemoveAnyAttachment = userRole === 'MANAGER' && !isSprintCompleted;
  const canRemoveOwnAttachment = userRole === 'TESTER' && !isSprintCompleted;

  const activeSprints = mockSprints.filter(s => s.status !== 'COMPLETED');
  const developers = mockUsers.filter(u => u.role === 'DEVELOPER');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveAttachment = (attachmentId: number) => {
    // For now, allow removal if user can add attachments (Tester) or is Manager
    // In a real app, you'd check ownership of attachments
    if (canRemoveAnyAttachment || canRemoveOwnAttachment) {
      setAttachmentsToRemove(prev => [...prev, attachmentId]);
    } else {
      toast({
        title: 'Permission Denied',
        description: 'You cannot remove attachments.',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if sprint is completed
    if (isSprintCompleted) {
      toast({
        title: 'Cannot Edit',
        description: 'Cannot edit tickets in completed sprints.',
        variant: 'destructive'
      });
      return;
    }

    // Check permissions
    if (!canEditTitle && !canEditDescription && !canEditPriority && !canEditStatus && !canAddAttachments) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to edit this ticket.',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📝 Starting ticket update process...');

      // Prepare update payload based on permissions
      const updatePayload: UpdateTicketPayload = {};

      if (canEditTitle) updatePayload.title = formData.title;
      if (canEditDescription) updatePayload.description = formData.description;
      if (canEditPriority) updatePayload.priority = formData.priority;
      if (canEditStatus) updatePayload.status = formData.status;

      // Handle attachments
      if (canAddAttachments && selectedFiles.length > 0) {
        console.log('☁️ Uploading new attachments...');
        const uploadedAttachments = await Promise.all(
          selectedFiles.map(async (file) => {
            console.log(`⏳ Uploading: ${file.name}`);
            const result = await uploadToCloudinary(file);
            return {
              fileName: result.fileName,
              fileUrl: result.fileUrl,
                fileType: result.fileType,
                fileSize: result.fileSize,
            };
          })
        );
        updatePayload.attachments = uploadedAttachments;
        console.log('✅ Attachments uploaded:', uploadedAttachments);
      }

      // Handle attachment removals
      if (attachmentsToRemove.length > 0) {
        updatePayload.removeAttachments = attachmentsToRemove;
        console.log('🗑️ Removing attachments:', attachmentsToRemove);
      }

      // Check if payload is empty
      if (Object.keys(updatePayload).length === 0) {
        toast({
          title: 'No Changes',
          description: 'No changes were made to the ticket.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }

      console.log('📦 Final update payload:', updatePayload);

      await updateTicket(ticket.id, updatePayload);

      toast({
        title: 'Ticket Updated',
        description: 'Changes have been saved successfully.'
      });

      onSave();
    } catch (error) {
      console.error('❌ Update failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ticket',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title">Title *</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          disabled={!canEditTitle}
          required
        />
        {!canEditTitle && <p className="text-xs text-muted-foreground">Only Testers can edit title</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="min-h-[100px]"
          disabled={!canEditDescription}
        />
        {!canEditDescription && <p className="text-xs text-muted-foreground">Only Testers can edit description</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sprint</Label>
          <Select
            value={formData.sprintId?.toString()}
            disabled
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {activeSprints.map(sprint => (
                <SelectItem key={sprint.id} value={sprint.id.toString()}>
                  {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Sprint cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange('priority', value as TicketPriority)}
            disabled={!canEditPriority}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          {!canEditPriority && <p className="text-xs text-muted-foreground">Only Managers can edit priority</p>}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value as TicketStatus)}
            disabled={!canEditStatus}
          >
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
          {!canEditStatus && <p className="text-xs text-muted-foreground">Only Developers can edit status</p>}
        </div>

        <div className="space-y-2">
          <Label>Assignee</Label>
          <Select
            value={formData.assigneeId}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="UNASSIGNED">Unassigned</SelectItem>
              {developers.map(dev => (
                <SelectItem key={dev.id} value={dev.id.toString()}>{dev.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Assignee cannot be changed here</p>
        </div>
      </div>

      {/* Attachments Section */}
      {canAddAttachments && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Attachments</Label>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Files
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
                    <Button onClick={() => setUploadDialogOpen(false)} disabled={selectedFiles.length === 0}>
                      Add {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Existing Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Attachments:</p>
              {ticket.attachments
                .filter(att => !attachmentsToRemove.includes(att.id))
                .map(att => (
                  <div key={att.id} className="flex items-center justify-between p-2 bg-muted/30 border border-border text-sm">
                    <span className="truncate">{att.fileName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAttachment(att.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )}

          {/* Files to be added */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Files to be added:</p>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 text-sm">
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

          {/* Files to be removed */}
          {attachmentsToRemove.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600">Files to be removed:</p>
              {attachmentsToRemove.map(id => {
                const att = ticket.attachments.find(a => a.id === id);
                return (
                  <div key={id} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 text-sm">
                    <span className="truncate">{att?.fileName}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAttachmentsToRemove(prev => prev.filter(attId => attId !== id))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isSprintCompleted && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">⚠️ This ticket belongs to a completed sprint and cannot be edited.</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting || isSprintCompleted}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
