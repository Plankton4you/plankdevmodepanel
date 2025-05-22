import React from 'react';
import { Server, Database, AlertTriangle, Wifi } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: number;
  type: 'server' | 'database' | 'alert' | 'network';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  value, 
  type, 
  trend = 'neutral',
  trendValue = '0%'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'server':
        return <Server className="h-6 w-6 text-blue-500" />;
      case 'database':
        return <Database className="h-6 w-6 text-purple-500" />;
      case 'alert':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case 'network':
        return <Wifi className="h-6 w-6 text-green-500" />;
      default:
        return <Server className="h-6 w-6 text-blue-500" />;
    }
  };
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'neutral':
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
          {getIcon()}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {trendValue}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last week</span>
      </div>
    </div>
  );
};

export default StatusCard;