import React, { useState } from 'react';
import { devices } from '../../data/mockData';
import DeviceCard from './DeviceCard';
import { Filter, Server } from 'lucide-react';

const DeviceList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  const filteredDevices = devices.filter(device => {
    if (statusFilter && device.status !== statusFilter) return false;
    if (typeFilter && device.type !== typeFilter) return false;
    return true;
  });
  
  const deviceTypes = Array.from(new Set(devices.map(device => device.type)));
  
  return (
    <div className="mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex items-center">
          <Server className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold">Devices</h2>
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
            {filteredDevices.length}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center mt-2 sm:mt-0 gap-2">
          <div className="relative">
            <button className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
              <Filter size={16} className="mr-1" />
              <span>Status</span>
            </button>
            <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 hidden">
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setStatusFilter(null)}
                >
                  All
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setStatusFilter('online')}
                >
                  Online
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setStatusFilter('warning')}
                >
                  Warning
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setStatusFilter('offline')}
                >
                  Offline
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
              <Filter size={16} className="mr-1" />
              <span>Type</span>
            </button>
          </div>
          
          {statusFilter && (
            <button 
              onClick={() => setStatusFilter(null)}
              className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              Status: {statusFilter}
              <span className="ml-1">×</span>
            </button>
          )}
          
          {typeFilter && (
            <button 
              onClick={() => setTypeFilter(null)}
              className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              Type: {typeFilter}
              <span className="ml-1">×</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDevices.map(device => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
};

export default DeviceList;