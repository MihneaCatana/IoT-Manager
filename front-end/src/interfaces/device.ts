export interface Device {
  _id: string;
  name: string;
  type: string;
  status: "online" | "offline" | "maintenance";
  location: string;
}
