import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";
import { useState } from "react";
import {
  Plus,
  Search,
  Wifi,
  WifiOff,
  Battery,
  Thermometer,
  Droplets,
  Zap,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/devices")({
  component: RouteComponent,
});

interface IoTDevice {
  id: string;
  name: string;
  type: "sensor" | "actuator" | "gateway" | "camera" | "thermostat";
  status: "online" | "offline" | "maintenance";
  location: string;
  lastSeen: Date;
  batteryLevel?: number;
  temperature?: number;
  humidity?: number;
  powerConsumption?: number;
  firmware: string;
}

const initialDevices: IoTDevice[] = [
  {
    id: "dev-001",
    name: "Temperature Sensor A1",
    type: "sensor",
    status: "online",
    location: "Building A - Floor 1",
    lastSeen: new Date(Date.now() - 5 * 60 * 1000),
    batteryLevel: 85,
    temperature: 22.5,
    humidity: 45,
    firmware: "v2.1.3",
  },
  {
    id: "dev-002",
    name: "Smart Thermostat B2",
    type: "thermostat",
    status: "online",
    location: "Building B - Floor 2",
    lastSeen: new Date(Date.now() - 2 * 60 * 1000),
    temperature: 24.0,
    powerConsumption: 15.2,
    firmware: "v1.8.1",
  },
  {
    id: "dev-003",
    name: "Security Camera C1",
    type: "camera",
    status: "offline",
    location: "Building C - Entrance",
    lastSeen: new Date(Date.now() - 45 * 60 * 1000),
    powerConsumption: 8.7,
    firmware: "v3.2.0",
  },
  {
    id: "dev-004",
    name: "IoT Gateway Main",
    type: "gateway",
    status: "online",
    location: "Data Center",
    lastSeen: new Date(Date.now() - 1 * 60 * 1000),
    powerConsumption: 25.8,
    firmware: "v4.1.2",
  },
  {
    id: "dev-005",
    name: "Humidity Sensor D3",
    type: "sensor",
    status: "maintenance",
    location: "Building D - Floor 3",
    lastSeen: new Date(Date.now() - 120 * 60 * 1000),
    batteryLevel: 12,
    humidity: 38,
    firmware: "v2.0.8",
  },
];

function RouteComponent() {
  const [devices, setDevices] = useState<IoTDevice[]>(initialDevices);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IoTDevice | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const [newDevice, setNewDevice] = useState<Partial<IoTDevice>>({
    name: "",
    type: "sensor",
    status: "offline",
    location: "",
    firmware: "v1.0.0",
  });

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || device.status === filterStatus;
    const matchesType = filterType === "all" || device.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.location) {
      const device: IoTDevice = {
        id: `dev-${Date.now().toString().slice(-3)}`,
        name: newDevice.name,
        type: newDevice.type as IoTDevice["type"],
        status: newDevice.status as IoTDevice["status"],
        location: newDevice.location,
        lastSeen: new Date(),
        firmware: newDevice.firmware || "v1.0.0",
        ...(newDevice.type === "sensor" && { batteryLevel: 100 }),
        ...(newDevice.type === "sensor" && { temperature: 20, humidity: 50 }),
        ...(newDevice.type !== "sensor" && { powerConsumption: 10 }),
      };
      setDevices([...devices, device]);
      setNewDevice({
        name: "",
        type: "sensor",
        status: "offline",
        location: "",
        firmware: "v1.0.0",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditDevice = (device: IoTDevice) => {
    setEditingDevice(device);
  };

  const handleUpdateDevice = () => {
    if (editingDevice) {
      setDevices(
        devices.map((d) => (d.id === editingDevice.id ? editingDevice : d))
      );
      setEditingDevice(null);
    }
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(devices.filter((d) => d.id !== deviceId));
    setDeviceToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sensor":
        return <Thermometer className="h-4 w-4" />;
      case "thermostat":
        return <Thermometer className="h-4 w-4" />;
      case "camera":
        return <Zap className="h-4 w-4" />;
      case "gateway":
        return <Wifi className="h-4 w-4" />;
      case "actuator":
        return <Zap className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              IoT Device Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage your IoT devices across all locations
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Devices
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {devices.length}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Online</p>
                    <p className="text-2xl font-bold text-green-600">
                      {devices.filter((d) => d.status === "online").length}
                    </p>
                  </div>
                  <Wifi className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Offline</p>
                    <p className="text-2xl font-bold text-red-600">
                      {devices.filter((d) => d.status === "offline").length}
                    </p>
                  </div>
                  <WifiOff className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Maintenance
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {devices.filter((d) => d.status === "maintenance").length}
                    </p>
                  </div>
                  <Battery className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sensor">Sensor</SelectItem>
                <SelectItem value="actuator">Actuator</SelectItem>
                <SelectItem value="gateway">Gateway</SelectItem>
                <SelectItem value="camera">Camera</SelectItem>
                <SelectItem value="thermostat">Thermostat</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New IoT Device</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Device Name</Label>
                    <Input
                      id="name"
                      value={newDevice.name}
                      onChange={(e) =>
                        setNewDevice({ ...newDevice, name: e.target.value })
                      }
                      placeholder="Enter device name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Device Type</Label>
                    <Select
                      value={newDevice.type}
                      onValueChange={(value) =>
                        setNewDevice({
                          ...newDevice,
                          type: value as IoTDevice["type"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sensor">Sensor</SelectItem>
                        <SelectItem value="actuator">Actuator</SelectItem>
                        <SelectItem value="gateway">Gateway</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="thermostat">Thermostat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newDevice.location}
                      onChange={(e) =>
                        setNewDevice({ ...newDevice, location: e.target.value })
                      }
                      placeholder="Enter device location"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="firmware">Firmware Version</Label>
                    <Input
                      id="firmware"
                      value={newDevice.firmware}
                      onChange={(e) =>
                        setNewDevice({ ...newDevice, firmware: e.target.value })
                      }
                      placeholder="e.g., v1.0.0"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddDevice}>Add Device</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Device Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevices.map((device) => (
              <Card
                key={device.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(device.type)}
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditDevice(device)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeviceToDelete(device.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {device.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`}
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {device.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{device.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Seen</p>
                      <p className="font-medium">
                        {formatLastSeen(device.lastSeen)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {device.batteryLevel !== undefined && (
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Battery className="h-3 w-3" />
                            Battery
                          </p>
                          <p className="font-medium">{device.batteryLevel}%</p>
                        </div>
                      )}
                      {device.temperature !== undefined && (
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Thermometer className="h-3 w-3" />
                            Temp
                          </p>
                          <p className="font-medium">{device.temperature}°C</p>
                        </div>
                      )}
                      {device.humidity !== undefined && (
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Droplets className="h-3 w-3" />
                            Humidity
                          </p>
                          <p className="font-medium">{device.humidity}%</p>
                        </div>
                      )}
                      {device.powerConsumption !== undefined && (
                        <div>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Power
                          </p>
                          <p className="font-medium">
                            {device.powerConsumption}W
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Firmware</p>
                      <p className="font-medium text-sm">{device.firmware}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No devices found matching your criteria
              </p>
            </div>
          )}

          {/* Edit Device Dialog */}
          <Dialog
            open={!!editingDevice}
            onOpenChange={() => setEditingDevice(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Device</DialogTitle>
              </DialogHeader>
              {editingDevice && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Device Name</Label>
                    <Input
                      id="edit-name"
                      value={editingDevice.name}
                      onChange={(e) =>
                        setEditingDevice({
                          ...editingDevice,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingDevice.status}
                      onValueChange={(value) =>
                        setEditingDevice({
                          ...editingDevice,
                          status: value as IoTDevice["status"],
                        })
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
                  <div className="grid gap-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={editingDevice.location}
                      onChange={(e) =>
                        setEditingDevice({
                          ...editingDevice,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  {editingDevice.batteryLevel !== undefined && (
                    <div className="grid gap-2">
                      <Label htmlFor="edit-battery">Battery Level (%)</Label>
                      <Input
                        id="edit-battery"
                        type="number"
                        min="0"
                        max="100"
                        value={editingDevice.batteryLevel}
                        onChange={(e) =>
                          setEditingDevice({
                            ...editingDevice,
                            batteryLevel: Number.parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}
                  {editingDevice.temperature !== undefined && (
                    <div className="grid gap-2">
                      <Label htmlFor="edit-temp">Temperature (°C)</Label>
                      <Input
                        id="edit-temp"
                        type="number"
                        step="0.1"
                        value={editingDevice.temperature}
                        onChange={(e) =>
                          setEditingDevice({
                            ...editingDevice,
                            temperature: Number.parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingDevice(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateDevice}>Update Device</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={!!deviceToDelete}
            onOpenChange={() => setDeviceToDelete(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  device and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deviceToDelete && handleDeleteDevice(deviceToDelete)
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Layout>
  );
}
