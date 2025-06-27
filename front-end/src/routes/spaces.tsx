import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";
import { useEffect, useState } from "react";
import {
  Plus,
  Home,
  Factory,
  Warehouse,
  Settings,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpaceDetailsModal } from "@/components/ui/space-details-modal";
import { CreateSpaceModal } from "@/components/ui/create-space-modal";
import axios from "axios";
import { Space } from "@/interfaces/space";
import { ToastContainer, toast } from "react-toastify";

export const Route = createFileRoute("/spaces")({
  component: RouteComponent,
});

function RouteComponent() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateSpace = (newSpace: Omit<Space, "_id" | "createdAt">) => {
    const space: Space = {
      ...newSpace,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setSpaces([...spaces, space]);
  };

  const handleUpdateSpace = (updatedSpace: Space) => {
    setSpaces(
      spaces.map((space) =>
        space._id === updatedSpace._id ? updatedSpace : space
      )
    );
  };

  const handleSpaceClick = (space: Space) => {
    console.log("click");
    setSelectedSpace(space);
    console.log(space);
    setIsDetailsModalOpen(true);
  };

  const totalDevices = spaces.reduce(
    (total, space) => total + space.devices.length,
    0
  );
  const onlineDevices = spaces.reduce(
    (total, space) =>
      total +
      space.devices.filter((device) => device.status === "online").length,
    0
  );
  const activeSpaces = spaces.filter(
    (space) => space.status === "active"
  ).length;

  useEffect(() => {
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
              Space Management
            </h1>
            <p className="text-gray-600">
              Manage your smart homes, factories, and warehouses
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spaces
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{spaces.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeSpaces} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Devices
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalDevices}</div>
                <p className="text-xs text-muted-foreground">
                  {onlineDevices} online
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Smart Homes
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {spaces.filter((s) => s.type === "smart-home").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Industrial
                </CardTitle>
                <Factory className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    spaces.filter(
                      (s) => s.type === "factory" || s.type === "warehouse"
                    ).length
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Spaces</h2>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Space
            </Button>
          </div>

          {/* Spaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card
                key={space._id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSpaceClick(space)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getSpaceIcon(space.type)}
                      <CardTitle className="text-lg">{space.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(space.status)}>
                      {space.status}
                    </Badge>
                  </div>
                  <CardDescription>{space.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">
                        {space.type.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Devices:</span>
                      <span className="font-medium">
                        {space.devices.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Online:</span>
                      <span className="font-medium text-green-600">
                        {
                          space.devices.filter((d) => d.status === "online")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {space.createdAt!.split("T")[0]}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Modals */}
          <CreateSpaceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCreateSpace={handleCreateSpace}
          />

          {selectedSpace && (
            <SpaceDetailsModal
              isOpen={isDetailsModalOpen}
              onClose={() => {
                setIsDetailsModalOpen(false);
                setSelectedSpace(null);
              }}
              space={selectedSpace}
              onUpdateSpace={handleUpdateSpace}
            />
          )}
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}
