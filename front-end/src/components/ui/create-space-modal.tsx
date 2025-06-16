import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Space {
  name: string;
  type: "smart-home" | "factory" | "warehouse";
  location: string;
  devices: any[];
  status: "active" | "inactive" | "maintenance";
}

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSpace: (space: Space) => void;
}

export function CreateSpaceModal({
  isOpen,
  onClose,
  onCreateSpace,
}: CreateSpaceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "" as "smart-home" | "factory" | "warehouse" | "",
    location: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.location) return;

    const newSpace: Space = {
      name: formData.name,
      type: formData.type as "smart-home" | "factory" | "warehouse",
      location: formData.location,
      devices: [],
      status: "active",
    };

    onCreateSpace(newSpace);
    setFormData({ name: "", type: "", location: "", description: "" });
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: "", type: "", location: "", description: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Add a new space to your management system. You can add devices
            later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Space Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Main Production Floor"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Space Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as any })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select space type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smart-home">Smart Home</SelectItem>
                  <SelectItem value="factory">Factory</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Building A, Floor 2"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the space..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Space</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
