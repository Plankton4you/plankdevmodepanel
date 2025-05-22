import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import StatsCard from "@/components/dashboard/stats-card";
import DeviceCard from "@/components/dashboard/device-card";
import CommandConsole from "@/components/dashboard/command-console";
import ActivityFeed from "@/components/dashboard/activity-feed";
import FileTable from "@/components/file-manager/file-table";
import Footer from "@/components/layout/footer";
import { Device, File } from "@shared/schema";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const [commandHistory, setCommandHistory] = useState<Array<{
    id: number;
    type: 'command' | 'response' | 'info' | 'warning' | 'error' | 'success';
    text: string;
    timestamp: Date;
  }>>([
    { id: 1, type: 'info', text: '> Welcome to PLANKTON4YOU DEV', timestamp: new Date() },
    { id: 2, type: 'info', text: '> Select a device to start sending commands', timestamp: new Date() }
  ]);
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  const { data: devices, isLoading: devicesLoading } = useQuery<(Device & { isConnected?: boolean })[]>({
    queryKey: ['/api/devices'],
    refetchInterval: 15000, // Refresh every 15 seconds
  });
  
  const { data: files, isLoading: filesLoading, refetch: refetchFiles } = useQuery<File[]>({
    queryKey: ['/api/files'],
  });
  
  const addToCommandHistory = (type: 'command' | 'response' | 'info' | 'warning' | 'error' | 'success', text: string) => {
    setCommandHistory(prev => [...prev, {
      id: Date.now(),
      type,
      text,
      timestamp: new Date()
    }]);
  };
  
  const handleViewDevice = (deviceId: number) => {
    const device = devices?.find(d => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
      addToCommandHistory('info', `> Connected to device: ${device.model}`);
    }
  };
  
  return (
    <div className="p-6 space-y-6 dashboard-page">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Connected Devices"
          value={statsLoading ? "..." : stats?.connectedDevices || 0}
          icon="devices"
          iconColor="primary"
          trend={{ value: "+14%", isPositive: true }}
        />
        
        <StatsCard
          title="Commands Executed"
          value={statsLoading ? "..." : stats?.commandsExecuted || 0}
          icon="code"
          iconColor="primary"
          trend={{ value: "+23%", isPositive: true }}
        />
        
        <StatsCard
          title="Files Transferred"
          value={statsLoading ? "..." : stats?.filesTransferred || 0}
          icon="file_download"
          iconColor="warning"
          trend={{ value: "-8%", isPositive: false }}
        />
        
        <StatsCard
          title="Messages Sent"
          value={statsLoading ? "..." : stats?.messagesSent || 0}
          icon="message"
          iconColor="success"
          trend={{ value: "+18%", isPositive: true }}
        />
      </div>
      
      {/* Connected Devices Section */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Connected Devices</h2>
          <Button
            variant="outline"
            onClick={() => setLocation("/devices")}
            className="bg-primary/10 text-primary"
          >
            <span className="material-icons text-sm mr-1">add</span>
            Add Device
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devicesLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-secondary p-5 rounded-xl animate-pulse h-48">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted"></div>
                    <div className="ml-3 space-y-2">
                      <div className="h-4 bg-muted rounded w-24"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : devices && devices.length > 0 ? (
            devices.map(device => (
              <DeviceCard 
                key={device.id} 
                device={device} 
                onViewDevice={handleViewDevice} 
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              No devices connected. Add a device to get started.
            </div>
          )}
        </div>
      </div>
      
      {/* Command Console and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Command Console */}
        <div className="lg:col-span-3">
          <CommandConsole 
            device={selectedDevice}
            commandHistory={commandHistory}
            addToHistory={addToCommandHistory}
          />
        </div>
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>
      
      {/* File Management */}
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">File Management</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="bg-primary/10 text-primary"
              onClick={() => setLocation("/file-manager")}
            >
              <span className="material-icons text-sm mr-1">upload</span>
              Upload
            </Button>
            <Button variant="outline" className="bg-primary/10 text-primary">
              <span className="material-icons text-sm mr-1">download</span>
              Download
            </Button>
          </div>
        </div>
        
        <FileTable 
          files={filesLoading ? [] : files || []} 
          device={selectedDevice}
          onRefresh={refetchFiles}
        />
      </div>
      
      {/* Contact & Social Media Footer */}
      <Footer />
    </div>
  );
}
