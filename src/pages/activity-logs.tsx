import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ActivityLog, Device } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActivityLogs() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const { toast } = useToast();
  
  const { data: devices, isLoading: devicesLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const { data: logs, isLoading: logsLoading, refetch: refetchLogs } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activity', selectedDeviceId ? { deviceId: parseInt(selectedDeviceId) } : null],
    queryFn: async () => {
      const url = selectedDeviceId 
        ? `/api/activity?deviceId=${selectedDeviceId}&limit=100` 
        : '/api/activity?limit=100';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch activity logs');
      return res.json();
    }
  });
  
  useEffect(() => {
    if (logs) {
      if (searchQuery) {
        setFilteredLogs(logs.filter(log => 
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.details?.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } else {
        setFilteredLogs(logs);
      }
    }
  }, [logs, searchQuery]);
  
  const handleDeviceChange = (value: string) => {
    setSelectedDeviceId(value);
  };
  
  const handleRefresh = () => {
    refetchLogs();
    toast({
      title: "Refreshed",
      description: "Activity logs have been refreshed"
    });
  };
  
  const getActivityTypeIcon = (action: string) => {
    switch (true) {
      case action.includes('connected'):
        return { icon: 'devices', color: 'text-success', bg: 'bg-success/10' };
      case action.includes('disconnected'):
        return { icon: 'error', color: 'text-destructive', bg: 'bg-destructive/10' };
      case action.includes('command'):
        return { icon: 'code', color: 'text-primary', bg: 'bg-primary/10' };
      case action.includes('message'):
        return { icon: 'message', color: 'text-primary', bg: 'bg-primary/10' };
      case action.includes('file'):
        return { icon: 'folder', color: 'text-warning', bg: 'bg-warning/10' };
      case action.includes('photo'):
      case action.includes('camera'):
        return { icon: 'photo_camera', color: 'text-info', bg: 'bg-info/10' };
      case action.includes('mic'):
      case action.includes('recording'):
        return { icon: 'mic', color: 'text-info', bg: 'bg-info/10' };
      default:
        return { icon: 'info', color: 'text-muted-foreground', bg: 'bg-muted/50' };
    }
  };
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Group logs by date
  const groupByDate = (logs: ActivityLog[]) => {
    const grouped: Record<string, ActivityLog[]> = {};
    
    logs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      if (!grouped[date]) {
        grouped[date] = [];
      }
      
      grouped[date].push(log);
    });
    
    return grouped;
  };
  
  const groupedLogs = groupByDate(filteredLogs || []);
  const groupDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              View detailed activity history for all devices
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={logsLoading}
            >
              <span className="material-icons">refresh</span>
            </Button>
            
            <Select
              value={selectedDeviceId}
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
            
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                search
              </span>
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[200px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="mt-2">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline">
              {logsLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredLogs && filteredLogs.length > 0 ? (
                <ScrollArea className="h-[600px] pr-4">
                  {groupDates.map(date => (
                    <div key={date} className="mb-8">
                      <div className="sticky top-0 bg-background z-10 py-2">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">{date}</h3>
                      </div>
                      <div className="relative border-l-2 border-border pl-6 ml-3 space-y-6">
                        {groupedLogs[date].map(log => {
                          const { icon, color, bg } = getActivityTypeIcon(log.action);
                          return (
                            <div key={log.id} className="relative">
                              <div className="absolute -left-[34px] top-0">
                                <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                                  <span className={`material-icons text-sm ${color}`}>{icon}</span>
                                </div>
                              </div>
                              <div className="bg-secondary p-4 rounded-lg border border-border">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-foreground">
                                    {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {log.details || 'No additional details'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Device ID: {log.deviceId}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <span className="material-icons text-4xl mb-2">history</span>
                  <p>No activity logs found</p>
                  {searchQuery && (
                    <p className="text-sm mt-2">Try adjusting your search query</p>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="table">
              {logsLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredLogs && filteredLogs.length > 0 ? (
                <div className="rounded-md border">
                  <ScrollArea className="h-[600px]">
                    <table className="w-full">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Timestamp</th>
                          <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Device ID</th>
                          <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Action</th>
                          <th className="text-xs font-medium text-muted-foreground text-left py-3 px-4">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredLogs.map(log => (
                          <tr key={log.id} className="bg-card hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4 text-sm text-foreground">
                              {formatDate(log.timestamp)}
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">
                              {log.deviceId}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full ${getActivityTypeIcon(log.action).bg} flex items-center justify-center mr-2`}>
                                  <span className={`material-icons text-xs ${getActivityTypeIcon(log.action).color}`}>
                                    {getActivityTypeIcon(log.action).icon}
                                  </span>
                                </div>
                                <span className="text-sm text-foreground">
                                  {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-foreground">
                              {log.details || 'No additional details'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                  <span className="material-icons text-4xl mb-2">history</span>
                  <p>No activity logs found</p>
                  {searchQuery && (
                    <p className="text-sm mt-2">Try adjusting your search query</p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {filteredLogs ? `Showing ${filteredLogs.length} logs` : 'Loading...'}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Export
            </Button>
            <Button variant="outline" size="sm" disabled>
              Clear Logs
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
