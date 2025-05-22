import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File, Device } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileTableProps {
  files: File[];
  device?: Device;
  onRefresh: () => void;
}

export default function FileTable({ files, device, onRefresh }: FileTableProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { toast } = useToast();
  
  const fileIcons: Record<string, string> = {
    "folder": "folder",
    "image": "image",
    "audio": "audio_file",
    "video": "videocam",
    "document": "description",
    "application": "apps",
    "text": "text_snippet",
    "other": "insert_drive_file"
  };
  
  const fileIconColors: Record<string, string> = {
    "folder": "text-primary",
    "image": "text-success",
    "audio": "text-warning",
    "video": "text-destructive",
    "document": "text-blue-400",
    "application": "text-purple-400",
    "text": "text-gray-400",
    "other": "text-muted-foreground"
  };
  
  const getFileIcon = (type: string) => {
    return fileIcons[type] || fileIcons.other;
  };
  
  const getFileIconColor = (type: string) => {
    return fileIconColors[type] || fileIconColors.other;
  };
  
  const formatFileSize = (size?: number) => {
    if (!size) return "-";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleDeleteFile = async (id: number) => {
    try {
      setIsDeleting(id);
      const response = await apiRequest("DELETE", `/api/files/${id}`);
      
      if (response.ok) {
        toast({
          title: "File deleted",
          description: "The file was successfully deleted",
        });
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Deletion failed",
        description: "Failed to delete the file",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  return (
    <div className="bg-secondary rounded-lg border border-border">
      <div className="p-4 border-b border-border flex items-center">
        <div className="flex items-center space-x-2 text-sm text-foreground">
          <span className="material-icons text-primary text-sm">
            {device ? "smartphone" : "folder"}
          </span>
          <span>{device?.model || "All Devices"}</span>
          <span className="material-icons text-muted-foreground text-sm">chevron_right</span>
          <span>Files</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length > 0 ? (
              files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`material-icons text-sm mr-2 ${getFileIconColor(file.type)}`}>
                        {getFileIcon(file.type)}
                      </span>
                      <span className="text-sm text-foreground">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(file.modified)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost" className="text-primary h-8 w-8">
                        <span className="material-icons text-sm">
                          {file.type === "folder" ? "open_in_new" : "download"}
                        </span>
                      </Button>
                      <Button size="icon" variant="ghost" className="text-warning h-8 w-8">
                        <span className="material-icons text-sm">edit</span>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive h-8 w-8"
                        onClick={() => handleDeleteFile(file.id)}
                        disabled={isDeleting === file.id}
                      >
                        <span className="material-icons text-sm">
                          {isDeleting === file.id ? "hourglass_empty" : "delete"}
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No files available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
