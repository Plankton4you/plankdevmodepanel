import React from 'react';
import StatusOverview from '../components/dashboard/StatusOverview';
import DeviceList from '../components/dashboard/DeviceList';
import CommandConsole from '../components/dashboard/CommandConsole';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Monitor and control your devices in real-time
        </p>
      </div>
      
      <StatusOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceList />
        </div>
        <div>
          <CommandConsole />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;