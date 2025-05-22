import React from 'react';
import StatusCard from './StatusCard';

const StatusOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatusCard 
        title="Total Devices" 
        value={7} 
        type="server"
        trend="up"
        trendValue="+14%"
      />
      <StatusCard 
        title="Active Alerts" 
        value={3} 
        type="alert"
        trend="down"
        trendValue="-5%"
      />
      <StatusCard 
        title="Database Nodes" 
        value={4} 
        type="database"
        trend="neutral"
        trendValue="0%"
      />
      <StatusCard 
        title="Network Status" 
        value={98} 
        type="network"
        trend="up"
        trendValue="+2%"
      />
    </div>
  );
};

export default StatusOverview;