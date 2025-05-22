import React, { useState } from 'react';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { currentUser } from '../../data/mockData';

interface HeaderProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isDarkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu size={20} />
        </button>
        <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white md:hidden">Plank.Dev</h1>
      </div>
      
      <div className="hidden md:flex items-center max-w-md w-full relative">
        <Search size={18} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search devices, commands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-10 pr-4 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="relative">
          <button className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
        
        <div className="flex items-center">
          <img
            src={currentUser.avatar}
            alt="User profile"
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;