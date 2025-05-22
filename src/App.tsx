import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Devices from "@/pages/devices";
import Console from "@/pages/console";
import FileManager from "@/pages/file-manager";
import Messages from "@/pages/messages";
import CameraControl from "@/pages/camera-control";
import Microphone from "@/pages/microphone";
import ActivityLogs from "@/pages/activity-logs";
import Settings from "@/pages/settings";
import AuthPage from "@/pages/auth-page";
import UserManagement from "@/pages/user-management";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useState } from "react";
import { useLocation } from "wouter";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const getTitle = (path: string) => {
    switch (path) {
      case "/": return "Dashboard";
      case "/devices": return "Devices";
      case "/console": return "Console";
      case "/file-manager": return "File Manager";
      case "/messages": return "Messages";
      case "/camera-control": return "Camera Control";
      case "/microphone": return "Microphone";
      case "/activity-logs": return "Activity Logs";
      case "/user-management": return "User Management";
      case "/settings": return "Settings";
      default: return "Panel Plank.Dev V4";
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title={getTitle(location)} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        
        <main className="flex-1 overflow-y-auto scrollbar-custom bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  
  // Check if current path is auth page
  const isAuthPage = location === '/auth';

  return (
    <>
      {isAuthPage ? (
        <Switch>
          <Route path="/auth" component={AuthPage} />
        </Switch>
      ) : (
        <AppLayout>
          <Switch>
            <ProtectedRoute path="/" component={Dashboard} />
            <ProtectedRoute path="/devices" component={Devices} />
            <ProtectedRoute path="/console" component={Console} />
            <ProtectedRoute path="/file-manager" component={FileManager} />
            <ProtectedRoute path="/messages" component={Messages} />
            <ProtectedRoute path="/camera-control" component={CameraControl} />
            <ProtectedRoute path="/microphone" component={Microphone} />
            <ProtectedRoute path="/activity-logs" component={ActivityLogs} />
            <ProtectedRoute path="/user-management" component={UserManagement} />
            <ProtectedRoute path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
