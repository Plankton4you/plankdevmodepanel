import React from 'react';
import { Device } from '../../types';
import { CheckCircle2, AlertCircle, XCircle, Terminal, Settings } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const getStatusIcon = () => {
    switch (device.status) {
      case 'online':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch (device.status) {
      case 'online':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg bg-${device.status === 'online' ? 'green' : device.status === 'warning' ? 'amber' : 'red'}-100 dark:bg-${device.status === 'online' ? 'green' : device.status === 'warning' ? 'amber' : 'red'}-900/30`}>
            {getStatusIcon()}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">{device.name}</h3>
            <div className="flex items-center mt-1">
              <span className={`text-xs font-medium ${getStatusText()} capitalize`}>{device.status}</span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{device.type}</span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{device.ipAddress}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <Terminal size={16} />
          </button>
          <button className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            <Settings size={16} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">CPU</span>
          <div className="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${device.cpuUsage > 80 ? 'bg-red-500' : device.cpuUsage > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${device.cpuUsage}%` }}
            ></div>
          </div>
          <span className="mt-1 text-xs font-medium">{device.cpuUsage}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Memory</span>
          <div className="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${device.memoryUsage > 80 ? 'bg-red-500' : device.memoryUsage > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${device.memoryUsage}%` }}
            ></div>
          </div>
          <span className="mt-1 text-xs font-medium">{device.memoryUsage}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">Disk</span>
          <div className="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${device.diskUsage > 80 ? 'bg-red-500' : device.diskUsage > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
              style={{ width: `${device.diskUsage}%` }}
            ></div>
          </div>
          <span className="mt-1 text-xs font-medium">{device.diskUsage}%</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Last active: {formatDate(device.lastActive)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{device.location}</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;