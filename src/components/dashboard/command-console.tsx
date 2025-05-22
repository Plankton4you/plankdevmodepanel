import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Device } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommandConsoleProps {
  device?: Device;
  commandHistory: { 
    id: number;
    type: 'command' | 'response' | 'info' | 'warning' | 'error' | 'success';
    text: string;
    timestamp: Date;
  }[];
  addToHistory: (type: 'command' | 'response' | 'info' | 'warning' | 'error' | 'success', text: string) => void;
}

export default function CommandConsole({ device, commandHistory, addToHistory }: CommandConsoleProps) {
  const [command, setCommand] = useState("");
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const quickCommands = [
    { label: "Get Info", value: "get_device_info" },
    { label: "List Files", value: "list_files /storage/emulated/0" },
    { label: "Capture Photo", value: "capture_photo" },
    { label: "Record Mic", value: "start_recording 30" }
  ];
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [commandHistory]);
  
  const handleCommand = async () => {
    if (!command.trim()) return;
    
    if (!device) {
      toast({
        title: "No device selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      addToHistory('command', `> Sending command: ${command}`);
      
      const response = await apiRequest("POST", `/api/devices/${device.id}/command`, {
        command: command
      });
      
      if (response.ok) {
        toast({
          title: "Command sent",
          description: "Command was sent to the device",
        });
        
        // Simulate a response
        setTimeout(() => {
          addToHistory('success', `> Command executed successfully`);
        }, 1000);
      }
    } catch (error) {
      console.error("Error sending command:", error);
      toast({
        title: "Command failed",
        description: "Failed to send command to device",
        variant: "destructive"
      });
      addToHistory('error', `> Error: Failed to send command`);
    }
    
    setCommand("");
  };
  
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
    <Card>
      <CardHeader>
        <CardTitle>Command Console</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea 
          className="bg-secondary border border-border rounded-lg h-80 terminal-text p-4"
          ref={scrollAreaRef as any}
        >
          <div>
            {commandHistory.map((entry) => (
              <div key={entry.id} className={`${getColorClass(entry.type)} mb-2`}>
                {entry.text}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-4 flex">
          <Input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
            placeholder="PLANKTON4YOU DEV"
            className="flex-1 bg-secondary rounded-r-none"
          />
          <Button
            onClick={handleCommand}
            className="rounded-l-none"
            disabled={!device}
          >
            Execute
          </Button>
        </div>
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickCommands.map((cmd) => (
            <Button
              key={cmd.value}
              variant="outline"
              size="sm"
              onClick={() => {
                setCommand(cmd.value);
              }}
              disabled={!device}
            >
              {cmd.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
