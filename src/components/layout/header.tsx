import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  title: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Header({ title, isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectionToggle = () => {
    setIsConnected(!isConnected);
    // Here you would typically handle the actual connection logic
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <header className="bg-card border-b border-border">
      <div className="px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2"
          >
            <span className="material-icons">menu</span>
          </Button>
          <span className="material-icons text-primary mr-2">router</span>
          <span className="font-medium text-lg text-foreground">Panel Plank.Dev V4.1.1</span>
        </div>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {title === "Dashboard" 
              ? "Monitor your connected devices" 
              : `Manage your ${title.toLowerCase()}`}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <span className="material-icons text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2">search</span>
            <Input 
              type="text" 
              placeholder="Search..." 
              className="bg-secondary pl-10 w-full max-w-[240px]"
            />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="icon" 
                  variant={isConnected ? "default" : "outline"}
                  className={`relative ${isConnected ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  onClick={handleConnectionToggle}
                >
                  <span className={`material-icons ${isConnected ? "text-white" : ""}`}>wifi</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isConnected ? "Connected" : "Not connected"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button size="icon" variant="outline" className="relative">
            <span className="material-icons">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="relative">
                <span className="material-icons">account_circle</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.name || user?.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                <span className="material-icons text-sm mr-2">settings</span>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                <span className="material-icons text-sm mr-2">logout</span>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
