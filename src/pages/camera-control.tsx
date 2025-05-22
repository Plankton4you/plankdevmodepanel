import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Device } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CameraControl() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>();
  const [recordingDuration, setRecordingDuration] = useState("10");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState("main"); // main or selfie
  const [captureHistory, setCaptureHistory] = useState<Array<{
    id: number;
    type: string;
    deviceName: string;
    timestamp: string;
    status: string;
    filename: string;
  }>>([
    { 
      id: 1, 
      type: "photo", 
      deviceName: "Samsung Galaxy S21", 
      timestamp: new Date().toLocaleString(), 
      status: "completed", 
      filename: "IMG_20231015_143245.jpg" 
    },
    { 
      id: 2, 
      type: "video", 
      deviceName: "Google Pixel 7", 
      timestamp: new Date(Date.now() - 3600000).toLocaleString(), 
      status: "completed", 
      filename: "VID_20231015_133012.mp4" 
    }
  ]);
  
  const { toast } = useToast();
  
  const { data: devices, isLoading: devicesLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(parseInt(deviceId));
  };
  
  const handleCapturePhoto = async () => {
    if (!selectedDeviceId) {
      toast({
        title: "No device selected",
        description: "Please select a device first",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await apiRequest("POST", `/api/devices/${selectedDeviceId}/command`, {
        command: `capture_photo`
      });
      
      if (response.ok) {
        toast({
          title: "Command sent",
          description: "Photo capture command was sent to the device",
        });
        
        // Add to history
        const device = devices?.find(d => d.id === selectedDeviceId);
        setCaptureHistory(prev => [
          {
            id: Date.now(),
            type: "photo",
            deviceName: device?.model || "Unknown Device",
            timestamp: new Date().toLocaleString(),
            status: "completed",
            filename: `IMG_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}.jpg`
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error("Error sending command:", error);
      toast({
        title: "Command failed",
        description: "Failed to send photo capture command",
        variant: "destructive"
      });
    }
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
      const command = recordingType === "main" 
        ? `rec_camera_main:${recordingDuration}` 
        : `rec_camera_selfie:${recordingDuration}`;
      
      const response = await apiRequest("POST", `/api/devices/${selectedDeviceId}/command`, {
        command
      });
      
      if (response.ok) {
        setIsRecording(true);
        toast({
          title: "Recording started",
          description: `Recording started for ${recordingDuration} seconds`,
        });
        
        // Add to history as in-progress
        const device = devices?.find(d => d.id === selectedDeviceId);
        const newRecordingId = Date.now();
        setCaptureHistory(prev => [
          {
            id: newRecordingId,
            type: "video",
            deviceName: device?.model || "Unknown Device",
            timestamp: new Date().toLocaleString(),
            status: "in-progress",
            filename: `VID_${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}.mp4`
          },
          ...prev
        ]);
        
        // Simulate recording completion after the specified duration
        setTimeout(() => {
          setIsRecording(false);
          
          // Update status to completed
          setCaptureHistory(prev => 
            prev.map(item => 
              item.id === newRecordingId 
                ? { ...item, status: "completed" } 
                : item
            )
          );
          
          toast({
            title: "Recording completed",
            description: "Video recording has completed",
          });
        }, parseInt(recordingDuration) * 1000);
      }
    } catch (error) {
      console.error("Error sending command:", error);
      toast({
        title: "Command failed",
        description: "Failed to start video recording",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Camera Control</CardTitle>
            <CardDescription>
              Capture photos and record videos from your devices
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
          <Tabs defaultValue="photo" className="mt-2">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="photo">Photo Capture</TabsTrigger>
              <TabsTrigger value="video">Video Recording</TabsTrigger>
            </TabsList>
            
            <TabsContent value="photo" className="space-y-4">
              <div className="bg-secondary p-8 rounded-lg border border-border flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-icons text-primary text-2xl">photo_camera</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Take a Photo</h3>
                <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                  Capture a photo from the device's camera. The image will be stored on the device and can be downloaded later.
                </p>
                <Button
                  onClick={handleCapturePhoto}
                  disabled={!selectedDeviceId || isRecording}
                  className="min-w-[150px]"
                >
                  <span className="material-icons text-sm mr-2">camera</span>
                  Capture Photo
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="video" className="space-y-4">
              <div className="bg-secondary p-8 rounded-lg border border-border flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="material-icons text-primary text-2xl">videocam</span>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Record Video</h3>
                <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                  Record a video from the device's camera. Choose the camera and recording duration.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Camera</label>
                    <Select
                      value={recordingType}
                      onValueChange={setRecordingType}
                      disabled={isRecording}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Camera</SelectItem>
                        <SelectItem value="selfie">Selfie Camera</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (seconds)</label>
                    <Input
                      type="number"
                      value={recordingDuration}
                      onChange={(e) => setRecordingDuration(e.target.value)}
                      min="1"
                      max="60"
                      disabled={isRecording}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleStartRecording}
                  disabled={!selectedDeviceId || isRecording}
                  className="min-w-[150px]"
                >
                  {isRecording ? (
                    <>
                      <span className="material-icons text-sm mr-2 animate-pulse">fiber_manual_record</span>
                      Recording...
                    </>
                  ) : (
                    <>
                      <span className="material-icons text-sm mr-2">videocam</span>
                      Start Recording
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-foreground mb-4">Capture History</h3>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4">
                {captureHistory.length > 0 ? (
                  <div className="space-y-4">
                    {captureHistory.map((item) => (
                      <div key={item.id} className="flex items-start p-3 bg-secondary rounded-lg border border-border">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.type === "photo" ? "bg-primary/10" : "bg-warning/10"
                        } flex-shrink-0`}>
                          <span className={`material-icons text-lg ${
                            item.type === "photo" ? "text-primary" : "text-warning"
                          }`}>
                            {item.type === "photo" ? "photo_camera" : "videocam"}
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
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">
                              {item.timestamp}
                            </p>
                            <div className="flex space-x-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <span className="material-icons text-sm">download</span>
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <span className="material-icons text-sm">visibility</span>
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
                    <span className="material-icons text-3xl mb-2">photo_library</span>
                    <p>No capture history</p>
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
