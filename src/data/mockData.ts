import { Device, User } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'admin',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

export const devices: Device[] = [
  {
    id: '1',
    name: 'Server Alpha',
    status: 'online',
    type: 'server',
    lastActive: '2023-10-15T14:48:00',
    ipAddress: '192.168.1.101',
    location: 'US East',
    cpuUsage: 45,
    memoryUsage: 60,
    diskUsage: 72
  },
  {
    id: '2',
    name: 'Database Node',
    status: 'warning',
    type: 'database',
    lastActive: '2023-10-15T14:30:00',
    ipAddress: '192.168.1.102',
    location: 'US West',
    cpuUsage: 78,
    memoryUsage: 85,
    diskUsage: 45
  },
  {
    id: '3',
    name: 'Web Server',
    status: 'offline',
    type: 'server',
    lastActive: '2023-10-14T23:15:00',
    ipAddress: '192.168.1.103',
    location: 'Europe',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 65
  },
  {
    id: '4',
    name: 'Load Balancer',
    status: 'online',
    type: 'networking',
    lastActive: '2023-10-15T14:48:00',
    ipAddress: '192.168.1.104',
    location: 'Asia',
    cpuUsage: 35,
    memoryUsage: 42,
    diskUsage: 30
  },
  {
    id: '5',
    name: 'Backup Server',
    status: 'online',
    type: 'storage',
    lastActive: '2023-10-15T14:40:00',
    ipAddress: '192.168.1.105',
    location: 'US East',
    cpuUsage: 20,
    memoryUsage: 35,
    diskUsage: 90
  }
];