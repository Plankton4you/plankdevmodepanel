import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Device } from "@shared/schema";
import { cn } from "@/lib/utils";

interface DeviceCardProps {
  device: Device & { isConnected?: boolean };
  onViewDevice: (deviceId: number) => void;
}

export default function DeviceCard({ device, onViewDevice }: DeviceCardProps) {
  const isOnline = device.isConnected || device.status === "online";
  const statusClass = isOnline ? "bg-success" : "bg-destructive";
  const deviceIcon = device.model?.toLowerCase().includes("iphone") ? "phone_iphone" : "smartphone";
  const iconColor = isOnline ? "primary" : "destructive";
  
  // Format battery level for display
  const batteryLevel = device.battery?.replace('%', '') || "0";
  const batteryIcon = parseInt(batteryLevel) <= 20 
    ? "battery_2_bar" 
    : parseInt(batteryLevel) <= 50 
      ? "battery_4_bar" 
      : "battery_full";
  
  const batteryIconColor = parseInt(batteryLevel) <= 20 
    ? "text-destructive" 
    : parseInt(batteryLevel) <= 50 
      ? "text-warning" 
      : "text-success";

  return (
    <Card className="bg-secondary p-5 device-card transition-all cursor-pointer border-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            iconColor === 'primary' ? 'bg-blue-500/10' : 
            iconColor === 'destructive' ? 'bg-red-500/10' : 'bg-gray-500/10'
          }`}>
            <span className={`material-icons ${
              iconColor === 'primary' ? 'text-blue-500' : 
              iconColor === 'destructive' ? 'text-red-500' : 'text-gray-500'
            }`}>{deviceIcon}</span>
          </div>
          <div className="ml-3">
            <h3 className="text-foreground font-medium">{device.model || "Unknown Device"}</h3>
            <p className="text-sm text-muted-foreground">
              {device.version || "Unknown Version"}
            </p>
          </div>
        </div>
        <div className={cn("w-3 h-3 rounded-full", statusClass, isOnline && "pulse")}></div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Battery</p>
          <div className="flex items-center mt-1">
            <span className={`material-icons text-sm ${
              parseInt(batteryLevel) <= 20 ? "text-red-500" : 
              parseInt(batteryLevel) <= 50 ? "text-yellow-500" : 
              "text-green-500"
            }`}>{batteryIcon}</span>
            <span className="text-foreground text-sm ml-1">{device.battery || "N/A"}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Provider</p>
          <div className="flex items-center mt-1">
            <span className="material-icons text-primary text-sm">wifi</span>
            <span className="text-foreground text-sm ml-1">{device.provider || "N/A"}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Brightness</p>
          <div className="flex items-center mt-1">
            <span className="material-icons text-warning text-sm">brightness_medium</span>
            <span className="text-foreground text-sm ml-1">{device.brightness || "N/A"}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Status</p>
          <div className={`flex items-center mt-1 ${isOnline ? "status-online" : "status-offline"} status-indicator`}>
            <span className="text-foreground text-sm">{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      
      <div className="flex mt-5 space-x-2">
        <Button 
          onClick={() => onViewDevice(device.id)} 
          className="flex-1" 
          variant="outline"
        >
          <span className="material-icons text-sm mr-1">visibility</span>
          View
        </Button>
        <Button variant="outline" size="icon">
          <span className="material-icons text-sm">more_vert</span>
        </Button>
      </div>
    </Card>
  );
}
