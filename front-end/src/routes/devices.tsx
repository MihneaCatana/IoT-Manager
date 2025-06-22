import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";
import { useEffect, useState } from "react";
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
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Space } from "@/interfaces/space";

export const Route = createFileRoute("/devices")({
  component: RouteComponent,
});

interface IoTDevice {
  _id: string;
  name: string;
  type: "sensor" | "actuator" | "gateway" | "camera" | "thermostat";
  status: "online" | "offline" | "maintenance";
  space: string;
  lastSeen: Date;
  batteryLevel?: number;
  temperature?: number;
  humidity?: number;
  powerConsumption?: number;
  firmware: string;
}

const defaultValuesNewDevice: Partial<IoTDevice> = {
  name: "",
  type: "sensor",
  status: "offline",
  space: undefined,
  firmware: "v1.0.0",
};

function RouteComponent() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<IoTDevice | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const [newDevice, setNewDevice] = useState<Partial<IoTDevice>>(
    defaultValuesNewDevice
  );
  const [spaces, setSpaces] = useState<Space[]>([]);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || device.status === filterStatus;
    const matchesType = filterType === "all" || device.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddDevice = () => {
    if (newDevice.name && newDevice.space) {
      const userid = localStorage.getItem("id");
      axios
        .post("http://localhost:8080/api/device", {
          name: newDevice.name,
          type: newDevice.type,
          space: newDevice.space,
          userId: userid,
        })
        .then((res) => {
          setDevices([...devices, res.data.device]);
          setNewDevice(defaultValuesNewDevice);
          setIsAddDialogOpen(false);
        });
    }
  };

  const handleEditDevice = (device: IoTDevice) => {
    setEditingDevice(device);
  };

  const handleUpdateDevice = () => {
    if (editingDevice) {
      axios
        .put(
          `http://localhost:8080/api/device/${editingDevice._id}`,
          editingDevice
        )
        .then((res) => {
          console.log(res.data);
          setDevices(
            devices.map((d) =>
              d._id === editingDevice._id ? editingDevice : d
            )
          );
          setEditingDevice(null);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Device couldn't be updated!", {
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
    }
  };

  const handleDeleteDevice = (deviceId: string) => {
    axios
      .delete(`http://localhost:8080/api/device/${deviceId}`)
      .then(() => {
        setDevices(devices.filter((d) => d._id !== deviceId));
        setDeviceToDelete(null);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Device couldn't be deleted!", {
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

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/device/")
      .then((res) => {
        setDevices(res.data.devices);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Devices couldn't be fetched!", {
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

    axios
      .get("http://localhost:8080/api/space")
      .then((res) => {
        setSpaces(res.data.spaces);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Space couldn't be fetched!", {
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
  }, []);

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
              Monitor and manage your IoT devices across all spaces
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

            {/* ADD DIALOG */}
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
                    <Label htmlFor="type">Space</Label>
                    <Select
                      value={newDevice.space}
                      onValueChange={(value) =>
                        setNewDevice({
                          ...newDevice,
                          space: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {spaces.map((space: Space) => {
                          return (
                            <SelectItem key={space._id} value={space._id}>
                              {space.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
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
                key={device._id}
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
                          onClick={() => setDeviceToDelete(device._id)}
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
                      <p className="text-sm text-gray-600">Space</p>
                      <p className="font-medium">
                        {
                          spaces.filter(
                            (space: Space) => space._id === device.space
                          )[0]?.name
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Seen</p>
                      {/* <p className="font-medium">
                        {formatLastSeen(device.lastSeen)}
                      </p> */}
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
                    <Label htmlFor="type">Space</Label>
                    <Select
                      value={editingDevice.space}
                      onValueChange={(value) =>
                        setEditingDevice({
                          ...editingDevice,
                          space: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {spaces.map((space: Space) => {
                          return (
                            <SelectItem key={space._id} value={space._id}>
                              {space.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
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
                <AlertDialogCancel onClick={() => setDeviceToDelete(null)}>
                  Cancel
                </AlertDialogCancel>
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
      <ToastContainer />
    </Layout>
  );
}
