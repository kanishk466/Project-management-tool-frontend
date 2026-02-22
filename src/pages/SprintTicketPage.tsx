// import { useSearchParams, Link } from 'react-router-dom';
// import { TicketForm } from '@/components/tickets/TicketForm';
// import { ArrowLeft } from 'lucide-react';
// export default function SprintTicketPage() {
//   const [searchParams] = useSearchParams();
//   const sprintId = searchParams.get('sprint') || undefined;

//   return (
//     <div className="space-y-6 max-w-3xl">
//       <div>
//         <Link
//           to={sprintId ? `/sprints/${sprintId}` : '/sprints'}
//           className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back
//         </Link>
//         <h1 className="text-2xl font-bold mb-1">Create New Ticket</h1>
//         <p className="text-muted-foreground">Report a bug or request a feature</p>
//       </div>

//       <TicketForm sprintId={sprintId} />
//     </div>
//   );
// }

import { useState   } from "react";
import { useNavigate ,  useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { createSprint } from "@/services/sprint.service";
import { Loader2 , ArrowLeft } from "lucide-react";


export default function SprintTicketPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

    const [searchParams] = useSearchParams();
  const sprintId = searchParams.get('sprint') || undefined;

  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Validation error",
        description: "Name, start date and end date are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createSprint(formData);

      toast({
        title: "Sprint created",
        description: "Sprint has been created successfully",
      });

      navigate("/sprints");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          to={sprintId ? `/sprints/${sprintId}` : "/sprints"}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-bold mb-1">Create New Ticket</h1>
        <p className="text-muted-foreground">
          Report a bug or request a feature
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Sprint</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sprint Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Sprint 1 - RPM Core Fixes"
              />
            </div>

            <div className="space-y-2">
              <Label>Goal</Label>
              <Textarea
                value={formData.goal}
                onChange={(e) => handleChange("goal", e.target.value)}
                placeholder="Fix critical RPM bugs"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Sprint
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
