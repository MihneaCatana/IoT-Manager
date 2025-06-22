import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Home, Factory, Warehouse } from "lucide-react";
import { AddDeviceModal } from "@/components/ui/add-device-modal";
import { Device } from "@/interfaces/device";
import { Space } from "@/interfaces/space";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

interface SpaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space;
  onUpdateSpace: (space: Space) => void;
}

export function SpaceDetailsModal({
  isOpen,
  onClose,
  space,
  onUpdateSpace,
}: SpaceDetailsModalProps) {
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState(false);
  const [spaceData, setSpaceData] = useState(space);

  const getSpaceIcon = (type: string) => {
    switch (type) {
      case "smart-home":
        return <Home className="h-5 w-5" />;
      case "factory":
        return <Factory className="h-5 w-5" />;
      case "warehouse":
        return <Warehouse className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddDevice = (device: Omit<Device, "id">) => {
    const newDevice: Device = {
      ...device,
      id: Date.now().toString(),
    };
    const updatedSpace = {
      ...spaceData,
      devices: [...spaceData.devices, newDevice],
    };
    setSpaceData(updatedSpace);
    onUpdateSpace(updatedSpace);
  };

  const handleRemoveDevice = (deviceId: string) => {
    const updatedSpace = {
      ...spaceData,
      devices: spaceData.devices.filter((device) => device.id !== deviceId),
    };
    setSpaceData(updatedSpace);
    onUpdateSpace(updatedSpace);
  };

  const handleUpdateSpaceInfo = () => {
    
    axios.put(`http://localhost:8080/api/space/${spaceData._id}`,spaceData).then(()=>{
    onUpdateSpace(spaceData);
    setEditingSpace(false);
    }).catch((err)=>{
      console.log(err)
              toast.error("Space couldn't be updated!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
              });
    })
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              {getSpaceIcon(spaceData.type)}
              <DialogTitle className="text-xl">{spaceData.name}</DialogTitle>
              <Badge className={getStatusColor(spaceData.status)}>
                {spaceData.status}
              </Badge>
            </div>
            <DialogDescription>{spaceData.location}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Total Devices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {spaceData.devices.length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Online Devices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {
                        spaceData.devices.filter((d) => d.status === "online")
                          .length
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Space Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">
                      {spaceData.type.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{spaceData.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{spaceData.createdAt!.split('T')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className={getStatusColor(spaceData.status)}>
                      {spaceData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Devices ({spaceData.devices.length})
                </h3>
                <Button onClick={() => setIsAddDeviceModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>

              <div className="grid gap-4">
                {spaceData.devices.map((device) => (
                  <Card key={device.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="font-medium">{device.name}</h4>
                          <p className="text-sm text-gray-600">{device.type}</p>
                          <p className="text-sm text-gray-500">
                            {device.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(device.status)}>
                            {device.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveDevice(device.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {spaceData.devices.length === 0 && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-gray-500 mb-4">No devices added yet</p>
                      <Button onClick={() => setIsAddDeviceModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Device
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Space Settings</CardTitle>
                  <CardDescription>
                    Update space information and status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editingSpace ? (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-name">Space Name</Label>
                        <Input
                          id="edit-name"
                          value={spaceData.name}
                          onChange={(e) =>
                            setSpaceData({ ...spaceData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-location">Location</Label>
                        <Input
                          id="edit-location"
                          value={spaceData.location}
                          onChange={(e) =>
                            setSpaceData({
                              ...spaceData,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select
                          value={spaceData.status}
                          onValueChange={(value: any) =>
                            setSpaceData({ ...spaceData, status: value as any })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="maintenance">
                              Maintenance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleUpdateSpaceInfo}>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingSpace(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button onClick={() => setEditingSpace(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Space Information
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      <ToastContainer />

      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onAddDevice={handleAddDevice}
        spaceType={spaceData.type}
      />
    </>
  );
}
