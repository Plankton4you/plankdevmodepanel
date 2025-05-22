import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Device } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Console() {
  const [, setLocation] = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const deviceIdParam = queryParams.get("deviceId");
  const initialDeviceId = deviceIdParam ? parseInt(deviceIdParam) : undefined;
  
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>(initialDeviceId);
  const [command, setCommand] = useState("");
  const { toast } = useToast();
  const commandHistoryRef = useRef<HTMLDivElement>(null);
  
  const [commandHistory, setCommandHistory] = useState<Array<{
    id: number;
    type: 'command' | 'response' | 'info' | 'warning' | 'error' | 'success';
    text: string;
    timestamp: Date;
  }>>([
    { id: 1, type: 'info', text: '> Welcome to PLANKTON4YOU DEV', timestamp: new Date() },
    { id: 2, type: 'info', text: '> Select a device to start sending commands', timestamp: new Date() },
    { id: 3, type: 'info', text: '> Type "help" for a list of available commands', timestamp: new Date() },
  ]);
  
  const { data: devices, isLoading: devicesLoading } = useQuery<(Device & { isConnected?: boolean })[]>({
    queryKey: ['/api/devices'],
  });
  
  const { data: selectedDevice, isLoading: deviceLoading } = useQuery<Device>({
    queryKey: [`/api/devices/${selectedDeviceId}`],
    enabled: !!selectedDeviceId,
  });
  
  useEffect(() => {
    // Scroll to the bottom of the command history
    if (commandHistoryRef.current) {
      commandHistoryRef.current.scrollTop = commandHistoryRef.current.scrollHeight;
    }
  }, [commandHistory]);
  
  const addToCommandHistory = (type: 'command' | 'response' | 'info' | 'warning' | 'error' | 'success', text: string) => {
    setCommandHistory(prev => [...prev, {
      id: Date.now(),
      type,
      text,
      timestamp: new Date()
    }]);
  };
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(parseInt(deviceId));
    addToCommandHistory('info', `> Device selected: ${devices?.find(d => d.id === parseInt(deviceId))?.model}`);
  };
  
  const handleCommandSubmit = async () => {
    if (!command.trim()) return;
    
    if (!selectedDeviceId) {
      toast({
        title: "No device selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }
    
    addToCommandHistory('command', `> ${command}`);
    
    // Handle built-in commands
    if (command === "help") {
      addToCommandHistory('info', `> Available commands:`);
      addToCommandHistory('info', `>   help             - Show this help menu`);
      addToCommandHistory('info', `>   clear            - Clear the console`);
      addToCommandHistory('info', `>   get_device_info  - Get device information`);
      addToCommandHistory('info', `>   list_files [path]- List files in directory`);
      addToCommandHistory('info', `>   capture_photo    - Take a photo with camera`);
      addToCommandHistory('info', `>   send_message     - Send SMS to a number`);
      addToCommandHistory('info', `>   start_recording  - Record microphone`);
      setCommand("");
      return;
    }
    
    if (command === "clear") {
      setCommandHistory([
        { id: Date.now(), type: 'info', text: '> Console cleared', timestamp: new Date() }
      ]);
      setCommand("");
      return;
    }
    
    try {
      const response = await apiRequest("POST", `/api/devices/${selectedDeviceId}/command`, {
        command: command
      });
      
      if (response.ok) {
        toast({
          title: "Command sent",
          description: "Command was sent to the device",
        });
        
        // For demo purposes, add simulated responses based on the command
        if (command.startsWith("get_device_info")) {
          setTimeout(() => {
            addToCommandHistory('response', `> Device: ${selectedDevice?.model}`);
            addToCommandHistory('response', `> Battery: ${selectedDevice?.battery}`);
            addToCommandHistory('response', `> OS Version: ${selectedDevice?.version}`);
            addToCommandHistory('response', `> Provider: ${selectedDevice?.provider}`);
          }, 1000);
        } else if (command.startsWith("list_files")) {
          setTimeout(() => {
            addToCommandHistory('response', `> Directory listing:`);
            addToCommandHistory('response', `>   📁 Downloads`);
            addToCommandHistory('response', `>   📁 DCIM`);
            addToCommandHistory('response', `>   📁 Documents`);
            addToCommandHistory('response', `>   📄 example.txt (2.1 KB)`);
            addToCommandHistory('response', `>   📄 photo.jpg (1.5 MB)`);
          }, 1000);
        } else if (command.startsWith("capture_photo")) {
          setTimeout(() => {
            addToCommandHistory('response', `> Capturing photo...`);
            setTimeout(() => {
              addToCommandHistory('success', `> Photo captured successfully`);
              addToCommandHistory('info', `> Saved to: /storage/emulated/0/DCIM/photo_${Date.now()}.jpg`);
            }, 2000);
          }, 1000);
        } else if (command.startsWith("start_recording")) {
          const durationMatch = command.match(/\d+/);
          const duration = durationMatch ? parseInt(durationMatch[0]) : 10;
          
          addToCommandHistory('response', `> Starting microphone recording for ${duration} seconds...`);
          setTimeout(() => {
            addToCommandHistory('success', `> Recording complete`);
            addToCommandHistory('info', `> Saved to: /storage/emulated/0/Recordings/rec_${Date.now()}.mp3`);
          }, Math.min(duration * 1000, 5000)); // Cap at 5s for demo
        } else {
          setTimeout(() => {
            addToCommandHistory('success', `> Command executed successfully`);
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error sending command:", error);
      toast({
        title: "Command failed",
        description: "Failed to send command to device",
        variant: "destructive"
      });
      addToCommandHistory('error', `> Error: Failed to send command`);
    }
    
    setCommand("");
  };
  
  const quickCommands = [
    { label: "Device Info", value: "get_device_info" },
    { label: "List Files", value: "list_files /storage/emulated/0" },
    { label: "Capture Photo", value: "capture_photo" },
    { label: "Record Mic (10s)", value: "start_recording 10" },
    { label: "Get Location", value: "get_location" },
    { label: "List Apps", value: "list_apps" }
  ];
  
  const getColorClass = (type: string) => {
    switch (type) {
      case 'command': return 'text-primary';
      case 'response': return 'text-foreground';
      case 'info': return 'text-foreground';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      case 'success': return 'text-success';
      default: return 'text-foreground';
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Command Console</CardTitle>
            <CardDescription>
              Send commands to the selected device
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              value={selectedDeviceId?.toString()}
              onValueChange={handleDeviceChange}
              disabled={devicesLoading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {devices?.map((device) => (
                  <SelectItem 
                    key={device.id} 
                    value={device.id.toString()}
                    disabled={!device.isConnected}
                  >
                    {device.model} {!device.isConnected && "(Offline)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="relative">
              <ScrollArea 
                className="h-[60vh] border bg-secondary rounded-lg p-4 terminal-text"
                ref={commandHistoryRef}
              >
                {commandHistory.map((entry) => (
                  <div key={entry.id} className={`${getColorClass(entry.type)} mb-2`}>
                    {entry.text}
                  </div>
                ))}
              </ScrollArea>
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCommandSubmit()}
                placeholder="PLANKTON4YOU DEV"
                className="flex-1"
                disabled={!selectedDeviceId}
              />
              <Button 
                onClick={handleCommandSubmit}
                disabled={!selectedDeviceId || !command.trim()}
              >
                Execute
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {quickCommands.map((cmd) => (
                <Button
                  key={cmd.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setCommand(cmd.value)}
                  disabled={!selectedDeviceId}
                >
                  {cmd.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
