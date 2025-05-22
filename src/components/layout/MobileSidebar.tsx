import React from 'react';
import { X } from 'lucide-react';
import Sidebar from './Sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      ></div>
      
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 transform transition-transform duration-300">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};

export default MobileSidebar;