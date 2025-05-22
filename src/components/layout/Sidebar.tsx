import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  AlertTriangle, 
  Settings, 
  Users, 
  BarChart3, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import { currentUser } from '../../data/mockData';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  alert?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, alert = false }) => {
  return (
    <li className={`flex items-center px-4 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-200 ease-in-out 
      ${active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      <div className="flex items-center">
        <span className="mr-3">{icon}</span>
        <span className={`font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
      </div>
      {alert && (
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          3
        </span>
      )}
    </li>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 flex items-center border-b border-gray-200 dark:border-gray-800">
        <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Plank.Dev</h1>
      </div>
      
      <div className="px-4 py-5 flex items-center border-b border-gray-200 dark:border-gray-800">
        <img 
          src={currentUser.avatar} 
          alt="User profile" 
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-3">
        <ul>
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarItem icon={<Server size={20} />} label="Devices" />
          <SidebarItem icon={<AlertTriangle size={20} />} label="Alerts" alert />
          <SidebarItem icon={<BarChart3 size={20} />} label="Analytics" />
          <SidebarItem icon={<Users size={20} />} label="Users" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
          <SidebarItem icon={<HelpCircle size={20} />} label="Help & Support" />
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200">
          <LogOut size={20} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;