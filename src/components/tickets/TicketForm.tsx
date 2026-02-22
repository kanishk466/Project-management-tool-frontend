
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TicketPriority } from "@/types";
import { getSprints as getActiveSprints } from "@/services/sprint.service";
import { createTicket } from "@/services/ticket.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {uploadToCloudinary} from "@/utils/cloudinaryUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

interface TicketFormProps {
  sprintId?: string;
  onSuccess?: () => void;
}

interface SprintOption {
  id: number;
  name: string;
}

export function TicketForm({ sprintId, onSuccess }: TicketFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sprints, setSprints] = useState<SprintOption[]>([]);
  const [attachments, setAttachments] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TicketPriority,
    sprintId: sprintId || "",
  });

  // Load active sprints
  useEffect(() => {
    const loadSprints = async () => {
      try {
        const data = await getActiveSprints();
        setSprints(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load sprints",
          variant: "destructive",
        });
      }
    };

    loadSprints();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.title.trim()) {
  //     toast({
  //       title: "Error",
  //       description: "Title is required",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (!formData.sprintId) {
  //     toast({
  //       title: "Error",
  //       description: "Please select a sprint",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {



  //     await createTicket(Number(formData.sprintId), {
  //       title: formData.title,
  //       description: formData.description,
  //       priority: formData.priority,
  //     });


  //     toast({
  //       title: "Ticket Created",
  //       description: `Ticket "${formData.title}" created successfully.`,
  //     });

  //     if (onSuccess) {
  //       onSuccess();
  //     } else {
  //       navigate(`/sprints/${formData.sprintId}`);
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };




const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.title.trim()) {
    toast({
      title: "Error",
      description: "Title is required",
      variant: "destructive",
    });
    return;
  }

  if (!formData.sprintId) {
    toast({
      title: "Error",
      description: "Please select a sprint",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    // ✅ upload all files to cloudinary
    let uploadedAttachments = [];

    if (attachments.length > 0) {
      uploadedAttachments = await Promise.all(
        attachments.map((file) => uploadToCloudinary(file))
      );
    }

    // ✅ send metadata to backend
    await createTicket(Number(formData.sprintId), {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      attachments: uploadedAttachments,
    });

    toast({
      title: "Ticket Created",
      description: `Ticket "${formData.title}" created successfully.`,
    });

        if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/sprints/${formData.sprintId}`);
      }
  } catch (error) {
    toast({
      title: "Error",
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Ticket Details */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sprint *</Label>
              <Select
                value={formData.sprintId}
                onValueChange={(v) => handleChange("sprintId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sprint" />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) =>
                  handleChange("priority", v as TicketPriority)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments (UI only for now) */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Attachments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="attachments"
          />
          <label htmlFor="attachments" className="cursor-pointer block text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              Click to upload (handled later)
            </p>
          </label>

          {attachments.map((file, i) => (
            <div key={i} className="flex justify-between text-sm">
              {file.name}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeAttachment(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Create Ticket
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
