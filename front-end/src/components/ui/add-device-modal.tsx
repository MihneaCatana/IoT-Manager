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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface Device {
  name: string;
  type: string;
  status: "online" | "offline" | "maintenance";
  location: string;
}

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (device: Device) => void;
  spaceType: "smart-home" | "factory" | "warehouse";
  spaceId: string;
}

const deviceTypesBySpace = {
  "smart-home": [
    "Smart Thermostat",
    "Security Camera",
    "Smart Lock",
    "Motion Sensor",
    "Smart Lights",
    "Smoke Detector",
    "Smart Speaker",
    "Door Sensor",
    "Window Sensor",
    "Smart Switch",
  ],
  factory: [
    "Conveyor Belt",
    "Temperature Sensor",
    "Pressure Sensor",
    "Safety Camera",
    "Emergency Stop",
    "Production Monitor",
    "Quality Scanner",
    "Robotic Arm",
    "Ventilation System",
    "Power Monitor",
  ],
  warehouse: [
    "Inventory Scanner",
    "Climate Control",
    "Loading Dock Sensor",
    "Security Camera",
    "Motion Detector",
    "RFID Reader",
    "Forklift Tracker",
    "Temperature Monitor",
    "Humidity Sensor",
    "Access Control",
  ],
};

export function AddDeviceModal({
  isOpen,
  onClose,
  onAddDevice,
  spaceType,
  spaceId,
}: AddDeviceModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "online" as "online" | "offline" | "maintenance",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("id");

    if (!formData.name || !formData.type || !formData.location) return;
    console.log(formData);

    axios
      .post(`http://localhost:8080/api/space/addDevice/${spaceId}`, {
        ...formData,
        userId,
      })
      .then((res) => {
        console.log(res.data);
        onAddDevice(formData);
        setFormData({ name: "", type: "", status: "online", location: "" });
        onClose();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Device couldn't be added!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleClose = () => {
    setFormData({ name: "", type: "", status: "online", location: "" });
    onClose();
  };

  const availableDeviceTypes = deviceTypesBySpace[spaceType] || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Add a new device to this space. Configure its type, location, and
            initial status.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input
                id="device-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Main Entrance Camera"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="device-type">Device Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  {availableDeviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="device-location">Location</Label>
              <Input
                id="device-location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Section A, Aisle 1"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="device-status">Initial Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Device</Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <ToastContainer />
    </Dialog>
  );
}
