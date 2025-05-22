import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  
  const menuItems = [
    { path: "/", label: "Dashboard", icon: "dashboard" },
    { path: "/devices", label: "Devices", icon: "devices" },
    { path: "/console", label: "Console", icon: "terminal" },
    { path: "/file-manager", label: "File Manager", icon: "folder" },
    { path: "/messages", label: "Messages", icon: "message" },
    { path: "/camera-control", label: "Camera Control", icon: "videocam" },
    { path: "/microphone", label: "Microphone", icon: "mic" },
    { path: "/activity-logs", label: "Activity Logs", icon: "history" },
    { path: "/user-management", label: "User Management", icon: "people" },
    { path: "/settings", label: "Settings", icon: "settings" }
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={() => setIsOpen(false)}
        ></div>
        
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-sidebar shadow-xl transition transform">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">router</span>
                <span className="font-medium text-lg text-sidebar-foreground">Panel Plank.Dev V4</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-muted-foreground hover:text-sidebar-foreground transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-custom">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 text-sidebar-foreground rounded-lg menu-item",
                    location === item.path && "active"
                  )}
                >
                  <span className="material-icons mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center p-4 border-t border-sidebar-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">admin@devconsole.io</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Minimized */}
      {!isOpen && (
        <div className="hidden md:flex flex-col w-16 bg-sidebar transition-all duration-300">
          <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
            <span className="material-icons text-primary text-2xl">router</span>
          </div>
          <div className="flex-1 py-4 overflow-y-auto scrollbar-custom">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex justify-center px-2 py-3 rounded-lg menu-item mx-2 mb-1",
                  location === item.path && "active"
                )}
              >
                <span className="material-icons text-sidebar-foreground">{item.icon}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-sidebar-border p-4 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-semibold">A</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar - Expanded */}
      {isOpen && (
        <aside className="hidden md:flex md:flex-shrink-0 transition-all duration-300 w-64">
          <div className="flex flex-col w-64 bg-sidebar border-r border-sidebar-border">
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
              <div className="flex items-center">
                <span className="material-icons text-primary mr-2">router</span>
                <span className="font-medium text-lg text-sidebar-foreground">Panel Plank.Dev V4</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-muted-foreground hover:text-sidebar-foreground transition-colors"
              >
                <span className="material-icons">menu_open</span>
              </button>
            </div>

            <div className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-custom">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sidebar-foreground rounded-lg menu-item",
                    location === item.path && "active"
                  )}
                >
                  <span className="material-icons mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center p-4 border-t border-sidebar-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">admin@devconsole.io</p>
              </div>
              <div className="ml-auto">
                <span className="material-icons text-muted-foreground cursor-pointer">expand_more</span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
