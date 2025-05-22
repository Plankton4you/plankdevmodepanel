import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Device } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

export default function Microphone() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>();
  const [recordingDuration, setRecordingDuration] = useState(10);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [recordingHistory, setRecordingHistory] = useState<Array<{
    id: number;
    deviceName: string;
    duration: number;
    timestamp: string;
    status: string;
    filename: string;
  }>>([
    { 
      id: 1, 
      deviceName: "Samsung Galaxy S21", 
      duration: 30,
      timestamp: new Date().toLocaleString(), 
      status: "completed", 
      filename: "REC_20231015_143245.mp3" 
    },
    { 
      id: 2, 
      deviceName: "Google Pixel 7", 
      duration: 15,
      timestamp: new Date(Date.now() - 3600000).toLocaleString(), 
      status: "completed", 
      filename: "REC_20231015_133012.mp3" 
    }
  ]);
  
  const { toast } = useToast();
  
  const { data: devices, isLoading: devicesLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(parseInt(deviceId));
  };
  
  const handleDurationChange = (value: number[]) => {
    setRecordingDuration(value[0]);
  };
  
  const handleStartRecording = async () => {
    if (!selectedDeviceId) {
      toast({
        title: "No device selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      toast({
        title: "Already recording",
        description: "A recording is already in progress",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await apiRequest("POST", `/api/devices/${selectedDeviceId}/command`, {
        command: `microphone:${recordingDuration}`
      });
      
      if (response.ok) {
        setIsRecording(true);
        setRecordingProgress(0);
        setRecordingStartTime(Date.now());
        
        toast({
          title: "Recording started",
          description: `Microphone recording started for ${recordingDuration} seconds`,
        });
        
        // Add to history as in-progress
        const device = devices?.find(d => d.id === selectedDeviceId);
        const newRecordingId = Date.now();
        setRecordingHistory(prev => [
          {
            id: newRecordingId,
            deviceName: device?.model || "Unknown Device",
            duration: recordingDuration,
            timestamp: new Date().toLocaleString(),
            status: "in-progress",
            filename: `REC_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}.mp3`
          },
          ...prev
        ]);
        
        // Simulate recording completion after the specified duration
        setTimeout(() => {
          setIsRecording(false);
          setRecordingProgress(100);
          setRecordingStartTime(null);
          
          // Update status to completed
          setRecordingHistory(prev => 
            prev.map(item => 
              item.id === newRecordingId 
                ? { ...item, status: "completed" } 
                : item
            )
          );
          
          toast({
            title: "Recording completed",
            description: "Microphone recording has completed",
          });
        }, recordingDuration * 1000);
      }
    } catch (error) {
      console.error("Error sending command:", error);
      toast({
        title: "Command failed",
        description: "Failed to start microphone recording",
        variant: "destructive"
      });
    }
  };
  
  // Update progress bar while recording
  useEffect(() => {
    if (isRecording && recordingStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - recordingStartTime) / 1000;
        const progress = Math.min((elapsed / recordingDuration) * 100, 100);
        setRecordingProgress(progress);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isRecording, recordingStartTime, recordingDuration]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const currentTime = isRecording && recordingStartTime 
    ? Math.min(Math.floor((Date.now() - recordingStartTime) / 1000), recordingDuration)
    : 0;
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Microphone Control</CardTitle>
            <CardDescription>
              Record audio from your devices' microphones
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              value={selectedDeviceId?.toString()}
              onValueChange={handleDeviceChange}
              disabled={devicesLoading || isRecording}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {devices?.map((device) => (
                  <SelectItem 
                    key={device.id} 
                    value={device.id.toString()}
                    disabled={device.status !== "online"}
                  >
                    {device.model} {device.status !== "online" && "(Offline)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary p-8 rounded-lg border border-border flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-icons text-primary text-2xl">mic</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Audio Recording</h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              Record audio from the device's microphone. Specify the recording duration and click the button to start.
            </p>
            
            <div className="w-full max-w-md mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="text-sm font-medium">{recordingDuration} seconds</span>
              </div>
              <Slider
                value={[recordingDuration]}
                onValueChange={handleDurationChange}
                min={5}
                max={60}
                step={5}
                disabled={isRecording}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">5s</span>
                <span className="text-xs text-muted-foreground">60s</span>
              </div>
            </div>
            
            {isRecording && (
              <div className="w-full max-w-md mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-primary">Recording...</span>
                  <span className="text-sm font-medium">{formatTime(currentTime)} / {formatTime(recordingDuration)}</span>
                </div>
                <Progress value={recordingProgress} className="h-2" />
              </div>
            )}
            
            <Button
              onClick={handleStartRecording}
              disabled={!selectedDeviceId || isRecording}
              className="min-w-[200px]"
            >
              {isRecording ? (
                <>
                  <span className="material-icons text-sm mr-2 animate-pulse">fiber_manual_record</span>
                  Recording...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-2">mic</span>
                  Start Recording
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Recording History</h3>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4">
                {recordingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {recordingHistory.map((item) => (
                      <div key={item.id} className="flex items-start p-3 bg-secondary rounded-lg border border-border">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 flex-shrink-0">
                          <span className="material-icons text-lg text-primary">
                            audio_file
                          </span>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground">{item.filename}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              item.status === "completed" 
                                ? "bg-success/10 text-success" 
                                : "bg-warning/10 text-warning"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Device: {item.deviceName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Duration: {item.duration} seconds
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">
                              {item.timestamp}
                            </p>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <span className="material-icons text-sm">download</span>
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <span className="material-icons text-sm">play_arrow</span>
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-destructive">
                                <span className="material-icons text-sm">delete</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <span className="material-icons text-3xl mb-2">audio_file</span>
                    <p>No recording history</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
