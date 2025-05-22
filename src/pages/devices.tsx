import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import DeviceCard from "@/components/dashboard/device-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Device } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export default function Devices() {
  const [location, setLocation] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: devices, isLoading } = useQuery<(Device & { isConnected?: boolean })[]>({
    queryKey: ['/api/devices'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });
  
  const handleViewDevice = (deviceId: number) => {
    const device = devices?.find(d => d.id === deviceId);
    if (device) {
      setSelectedDevice(device);
      setDialogOpen(true);
    }
  };
  
  const handleSendCommand = (deviceId: number) => {
    const device = devices?.find(d => d.id === deviceId);
    if (device) {
      setLocation(`/console?deviceId=${deviceId}`);
    }
  };
  
  const handleFileManager = (deviceId: number) => {
    const device = devices?.find(d => d.id === deviceId);
    if (device) {
      setLocation(`/file-manager?deviceId=${deviceId}`);
    }
  };
  
  // Group devices by status
  const deviceGroups = devices?.reduce((acc, device) => {
    const isOnline = device.isConnected || device.status === "online";
    const group = isOnline ? "online" : "offline";
    if (!acc[group]) acc[group] = [];
    acc[group].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Devices</h1>
        <Button className="bg-primary/10 text-primary" variant="outline">
          <span className="material-icons text-sm mr-1">refresh</span>
          Refresh
        </Button>
      </div>
      
      {/* Online Devices Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
            <CardTitle>Online Devices</CardTitle>
          </div>
          <CardDescription>
            Devices currently connected to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3).fill(0).map((_, i) => (
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
              ))}
            </div>
          ) : deviceGroups?.online && deviceGroups.online.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deviceGroups.online.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onViewDevice={handleViewDevice}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No devices are currently online.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Offline Devices Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-destructive rounded-full mr-2"></div>
            <CardTitle>Offline Devices</CardTitle>
          </div>
          <CardDescription>
            Devices that are registered but not currently connected
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-secondary p-5 rounded-xl animate-pulse h-48"></div>
            </div>
          ) : deviceGroups?.offline && deviceGroups.offline.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deviceGroups.offline.map(device => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onViewDevice={handleViewDevice}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No offline devices.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Device Detail Dialog */}
      {selectedDevice && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Device Details</DialogTitle>
              <DialogDescription>
                View detailed information about this device
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
                  <span className="material-icons text-primary">smartphone</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-foreground">{selectedDevice.model}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDevice.uuid}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-muted-foreground">Battery</Label>
                  <p className="text-foreground">{selectedDevice.battery || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">OS Version</Label>
                  <p className="text-foreground">{selectedDevice.version || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Provider</Label>
                  <p className="text-foreground">{selectedDevice.provider || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Brightness</Label>
                  <p className="text-foreground">{selectedDevice.brightness || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p className={`text-foreground status-indicator ${selectedDevice.status === "online" ? "status-online" : "status-offline"}`}>
                    {selectedDevice.status?.charAt(0).toUpperCase() + selectedDevice.status?.slice(1) || "Unknown"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Seen</Label>
                  <p className="text-foreground">
                    {selectedDevice.lastSeen 
                      ? new Date(selectedDevice.lastSeen).toLocaleString() 
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={() => handleSendCommand(selectedDevice.id)}
                className="flex-1"
              >
                <span className="material-icons text-sm mr-1">terminal</span>
                Console
              </Button>
              <Button 
                onClick={() => handleFileManager(selectedDevice.id)}
                className="flex-1"
              >
                <span className="material-icons text-sm mr-1">folder</span>
                Files
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={() => setDialogOpen(false)}
              >
                <span className="material-icons text-sm mr-1">close</span>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
