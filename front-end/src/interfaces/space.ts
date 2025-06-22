import { Device } from "./device";

export interface Space {
    _id: string;
    name: string;
    type: "smart-home" | "factory" | "warehouse";
    location: string;
    devices: Device[];
    owner?: string;
    status: "active" | "inactive" | "maintenance";
    createdAt?: string;
  }