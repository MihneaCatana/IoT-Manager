import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/components/ui/layout.tsx";
import { useEffect, useState } from "react";
import {
  Activity,
  Thermometer,
  Droplets,
  Lightbulb,
  Shield,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Home,
  Building,
  Factory,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import { Space } from "@/interfaces/space";
import { ToastContainer, toast } from "react-toastify";

// Mock data for IoT devices and spaces
// const spaces = [
//   {
//     id: "office",
//     name: "Office Floor",
//     icon: Building,
//     deviceCount: 12,
//     activeDevices: 11,
//     devices: [
//       {
//         id: "temp-01",
//         name: "Temperature Sensor",
//         type: "temperature",
//         icon: Thermometer,
//         status: "online",
//         value: "22.5°C",
//         battery: 85,
//         lastUpdate: "2 min ago",
//       },
//       {
//         id: "hum-01",
//         name: "Humidity Sensor",
//         type: "humidity",
//         icon: Droplets,
//         status: "online",
//         value: "45%",
//         battery: 72,
//         lastUpdate: "1 min ago",
//       },
//       {
//         id: "light-01",
//         name: "Smart Light",
//         type: "light",
//         icon: Lightbulb,
//         status: "online",
//         value: "On - 75%",
//         battery: null,
//         lastUpdate: "30 sec ago",
//       },
//       {
//         id: "sec-01",
//         name: "Security Camera",
//         type: "security",
//         icon: Shield,
//         status: "offline",
//         value: "Offline",
//         battery: 15,
//         lastUpdate: "1 hour ago",
//       },
//     ],
//   },
//   {
//     id: "home",
//     name: "Smart Home",
//     icon: Home,
//     deviceCount: 8,
//     activeDevices: 7,
//     devices: [
//       {
//         id: "temp-02",
//         name: "Living Room Temp",
//         type: "temperature",
//         icon: Thermometer,
//         status: "online",
//         value: "24.1°C",
//         battery: 92,
//         lastUpdate: "1 min ago",
//       },
//       {
//         id: "light-02",
//         name: "Kitchen Light",
//         type: "light",
//         icon: Lightbulb,
//         status: "online",
//         value: "Off",
//         battery: null,
//         lastUpdate: "5 min ago",
//       },
//       {
//         id: "sec-02",
//         name: "Front Door Camera",
//         type: "security",
//         icon: Shield,
//         status: "online",
//         value: "Recording",
//         battery: 88,
//         lastUpdate: "30 sec ago",
//       },
//     ],
//   },
//   {
//     id: "warehouse",
//     name: "Warehouse",
//     icon: Factory,
//     deviceCount: 24,
//     activeDevices: 22,
//     devices: [
//       {
//         id: "temp-03",
//         name: "Zone A Temperature",
//         type: "temperature",
//         icon: Thermometer,
//         status: "online",
//         value: "18.3°C",
//         battery: 67,
//         lastUpdate: "3 min ago",
//       },
//       {
//         id: "hum-02",
//         name: "Zone A Humidity",
//         type: "humidity",
//         icon: Droplets,
//         status: "warning",
//         value: "78%",
//         battery: 45,
//         lastUpdate: "2 min ago",
//       },
//       {
//         id: "sec-03",
//         name: "Loading Bay Camera",
//         type: "security",
//         icon: Shield,
//         status: "online",
//         value: "Active",
//         battery: 91,
//         lastUpdate: "1 min ago",
//       },
//     ],
//   },
// ];

// Mock chart data
const temperatureData = [
  { time: "00:00", temperature: 20.5 },
  { time: "04:00", temperature: 19.8 },
  { time: "08:00", temperature: 22.1 },
  { time: "12:00", temperature: 24.3 },
  { time: "16:00", temperature: 23.7 },
  { time: "20:00", temperature: 22.4 },
];

const deviceStatusData = [
  { status: "Online", count: 40 },
  { status: "Offline", count: 3 },
  { status: "Warning", count: 1 },
];

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-500" />;
    }
  };

  const totalDevices = spaces.reduce(
    (sum, space) => sum + space.devices.length,
    0
  );
  const totalActiveDevices = spaces.reduce(
    (sum, space) =>
      sum + space.devices.filter((device) => device.status === "online").length,
    0
  );

  const splitDevicesByStatus = (spaces: Space[]) => {
    const categories = new Map();

    spaces.map((space) => {
      space.devices.map((device) => {
        return categories.has(device.status)
          ? categories.set(device.status, categories.get(device.status) + 1)
          : categories.set(device.status, 1);
      });
    });

    const statusArray = Array.from(categories, ([status, count]) => ({
      status,
      count: String(count), // use `count` if you want number, `String(count)` if you want string
    }));

    return statusArray;
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/space")
      .then((res) => {
        setSpaces(res.data.spaces);
        setSelectedSpace(res.data.spaces[0]);
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
      <div className="bg-gray-50 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">IoT Dashboard</h1>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-w-7xl">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold">{totalDevices}</div>
              <div className="text-sm text-gray-500">Total Devices</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-green-600">
                {totalActiveDevices}
              </div>
              <div className="text-sm text-gray-500">Online Devices</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-red-600">
                {totalDevices - totalActiveDevices}
              </div>
              <div className="text-sm text-gray-500">Offline Devices</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((totalActiveDevices / totalDevices) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Uptime</div>
            </CardContent>
          </Card>
        </div>

        {/* Spaces as Cards */}
        <h2 className="text-xl font-semibold mb-4">Spaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-7xl">
          {spaces.map((space) => {
            // const SpaceIcon = space.icon;
            const isSelected = selectedSpace?._id === space._id;
            return (
              <Card
                key={space._id}
                className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-blue-500 shadow-md" : ""}`}
                onClick={() => setSelectedSpace(space)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {/* <SpaceIcon className="h-5 w-5 text-gray-600" /> */}
                    <CardTitle>{space.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm">
                    <span>Devices</span>
                    <span className="font-medium">{space.devices.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active</span>
                    <span className="font-medium text-green-600">
                      {
                        space.devices.filter(
                          (device) => device.status === "online"
                        ).length
                      }
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Status</span>
                      <span>
                        {
                          space.devices.filter(
                            (device) => device.status === "online"
                          ).length
                        }
                        /{space.devices.length} online
                      </span>
                    </div>
                    <Progress
                      value={
                        (space.devices.filter(
                          (device) => device.status === "online"
                        ).length /
                          space.devices.length) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Selected Space Content */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-1">{selectedSpace?.name}</h2>
          <p className="text-gray-600">
            {
              selectedSpace?.devices.filter(
                (device) => device.status === "online"
              ).length
            }{" "}
            of {selectedSpace?.devices.length} devices online
          </p>
        </div>

        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-6">
            {/* Device Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl">
              {selectedSpace?.devices.map((device) => {
                // const DeviceIcon = device.icon;
                return (
                  <Card
                    key={device._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* <DeviceIcon className="h-5 w-5 text-gray-600" /> */}
                          <CardTitle className="text-sm">
                            {device.name}
                          </CardTitle>
                        </div>
                        {getStatusIcon(device.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        {/* <div className="text-lg font-semibold">
                          {device.value}
                        </div>
                        <div className="text-xs text-gray-500">
                          Last update: {device.lastUpdate}
                        </div> */}
                      </div>

                      {/* {device.battery !== null && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Battery</span>
                            <span>{device.battery}%</span>
                          </div>
                          <Progress value={device.battery} className="h-2" />
                        </div>
                      )} */}

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`}
                        />
                        <span className="text-xs capitalize text-gray-600">
                          {device.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl">
              {/* Temperature Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Trends</CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      temperature: {
                        label: "Temperature",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="green"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Device Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Status</CardTitle>
                  <CardDescription>
                    Current status across all spaces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Devices",
                        color: "green",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <BarChart data={splitDevicesByStatus(spaces)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="green" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <ToastContainer />
      </div>
    </Layout>
  );
}
