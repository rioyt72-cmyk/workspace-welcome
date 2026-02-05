import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, IndianRupee, Check } from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  description: string | null;
  location: string;
  address: string | null;
  facilities: string[];
  amount_per_month: number;
  capacity: number;
  image_url: string | null;
  workspace_type: string;
}

interface WorkspaceDetailsModalProps {
  workspace: Workspace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (workspace: Workspace) => void;
}

export const WorkspaceDetailsModal = ({ workspace, open, onOpenChange, onBook }: WorkspaceDetailsModalProps) => {
  if (!workspace) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl">{workspace.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {workspace.image_url && (
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={workspace.image_url}
                alt={workspace.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 left-3 capitalize">
                {workspace.workspace_type.replace('_', ' ')}
              </Badge>
            </div>
          )}

          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{workspace.location}</p>
                {workspace.address && <p className="text-sm">{workspace.address}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-5 h-5 text-primary" />
              <span>Capacity: {workspace.capacity} people</span>
            </div>

            <div className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {workspace.amount_per_month.toLocaleString()}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>

          {workspace.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{workspace.description}</p>
            </div>
          )}

          {workspace.facilities.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Facilities</h4>
              <div className="grid grid-cols-2 gap-2">
                {workspace.facilities.map((facility, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold" 
            size="lg" 
            onClick={() => onBook(workspace)}
          >
            Book This Workspace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
