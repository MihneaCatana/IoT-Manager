export interface Device {
    id: string;
    name: string;
    type: string;
    status: "online" | "offline" | "maintenance";
    location: string;
  }