export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning';
  type: string;
  lastActive: string;
  ipAddress: string;
  location: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar: string;
}