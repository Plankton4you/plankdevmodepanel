import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Device, File } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileTable from "@/components/file-manager/file-table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

export default function FileManager() {
  const [location, params] = useLocation();
  const queryParams = new URLSearchParams(params);
  const deviceIdParam = queryParams.get("deviceId");
  const initialDeviceId = deviceIdParam ? parseInt(deviceIdParam) : undefined;
  
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>(initialDeviceId);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFilePath, setNewFilePath] = useState("/storage/emulated/0/Download");
  const [newFileType, setNewFileType] = useState("document");
  const [newFileSize, setNewFileSize] = useState(1024);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: devices, isLoading: devicesLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const { data: selectedDevice } = useQuery<Device>({
    queryKey: [`/api/devices/${selectedDeviceId}`],
    enabled: !!selectedDeviceId,
  });
  
  const { data: files, isLoading: filesLoading, refetch: refetchFiles } = useQuery<File[]>({
    queryKey: ['/api/files', selectedDeviceId ? { deviceId: selectedDeviceId } : null],
    queryFn: async () => {
      const url = selectedDeviceId 
        ? `/api/files?deviceId=${selectedDeviceId}` 
        : '/api/files';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch files');
      return res.json();
    }
  });
  
  const fileUploadMutation = useMutation({
    mutationFn: async (fileData: any) => {
      const response = await apiRequest("POST", `/api/files`, fileData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/files'] });
      toast({
        title: "File uploaded",
        description: "File was successfully uploaded",
      });
      setUploadDialogOpen(false);
      setNewFileName("");
      setNewFilePath("/storage/emulated/0/Download");
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file",
        variant: "destructive"
      });
    }
  });
  
  const handleUploadFile = () => {
    if (!newFileName || !newFilePath || !selectedDeviceId) {
      toast({
        title: "Validation error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    fileUploadMutation.mutate({
      deviceId: selectedDeviceId,
      name: newFileName,
      path: newFilePath,
      type: newFileType,
      size: newFileSize
    });
  };
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(parseInt(deviceId));
  };
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>File Manager</CardTitle>
            <CardDescription>
              Browse and manage files on your devices
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-primary/10 text-primary">
                  <span className="material-icons text-sm mr-1">upload</span>
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Add a new file to the selected device
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="device" className="text-sm font-medium">Device</label>
                    <Select
                      value={selectedDeviceId?.toString()}
                      onValueChange={handleDeviceChange}
                      disabled={devicesLoading || fileUploadMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a device" />
                      </SelectTrigger>
                      <SelectContent>
                        {devices?.map((device) => (
                          <SelectItem key={device.id} value={device.id.toString()}>
                            {device.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">File Name</label>
                    <Input
                      id="name"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="e.g. document.pdf"
                      disabled={fileUploadMutation.isPending}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="path" className="text-sm font-medium">Path</label>
                    <Input
                      id="path"
                      value={newFilePath}
                      onChange={(e) => setNewFilePath(e.target.value)}
                      placeholder="/storage/emulated/0/Download"
                      disabled={fileUploadMutation.isPending}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">File Type</label>
                    <Select
                      value={newFileType}
                      onValueChange={setNewFileType}
                      disabled={fileUploadMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="folder">Folder</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                    disabled={fileUploadMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadFile}
                    disabled={!selectedDeviceId || !newFileName || fileUploadMutation.isPending}
                  >
                    {fileUploadMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Select
              value={selectedDeviceId?.toString()}
              onValueChange={handleDeviceChange}
              disabled={devicesLoading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Devices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Devices</SelectItem>
                {devices?.map((device) => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <FileTable 
            files={filesLoading ? [] : files || []} 
            device={selectedDevice}
            onRefresh={refetchFiles}
          />
        </CardContent>
      </Card>
    </div>
  );
}
