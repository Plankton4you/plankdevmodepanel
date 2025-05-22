import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Device } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";

export default function Messages() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const { toast } = useToast();
  
  const { data: devices, isLoading: devicesLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(parseInt(deviceId));
  };
  
  const handleSendMessage = async () => {
    if (!selectedDeviceId || !phoneNumber || !messageText) {
      toast({
        title: "Validation error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      const response = await apiRequest("POST", `/api/devices/${selectedDeviceId}/command`, {
        command: `send_message:${phoneNumber}/${messageText}`
      });
      
      if (response.ok) {
        toast({
          title: "Message sent",
          description: "Message was successfully sent",
        });
        setSendDialogOpen(false);
        setPhoneNumber("");
        setMessageText("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Message failed",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const messageHistory = [
    { id: 1, deviceId: 1, deviceName: "Samsung Galaxy S21", number: "+1234567890", text: "Hello, how are you?", timestamp: "10/15/2023 14:32", status: "sent" },
    { id: 2, deviceId: 2, deviceName: "Google Pixel 7", number: "+9876543210", text: "Meeting tomorrow at 2pm", timestamp: "10/14/2023 09:45", status: "sent" },
    { id: 3, deviceId: 1, deviceName: "Samsung Galaxy S21", number: "+1122334455", text: "Please call me back", timestamp: "10/13/2023 18:20", status: "sent" },
  ];
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Message Center</CardTitle>
            <CardDescription>
              Send and view message history
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <span className="material-icons text-sm mr-1">send</span>
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Message</DialogTitle>
                  <DialogDescription>
                    Send an SMS message from the selected device
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="device" className="text-sm font-medium">Device</label>
                    <Select
                      value={selectedDeviceId?.toString()}
                      onValueChange={handleDeviceChange}
                      disabled={devicesLoading || isSending}
                    >
                      <SelectTrigger>
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
                  
                  <div className="grid gap-2">
                    <label htmlFor="number" className="text-sm font-medium">Phone Number</label>
                    <Input
                      id="number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      disabled={isSending}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea
                      id="message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Enter your message here"
                      rows={4}
                      disabled={isSending}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSendDialogOpen(false)}
                    disabled={isSending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!selectedDeviceId || !phoneNumber || !messageText || isSending}
                  >
                    {isSending ? "Sending..." : "Send Message"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-x-auto border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {messageHistory.map((message) => (
                    <tr key={message.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{message.deviceName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{message.number}</td>
                      <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{message.text}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{message.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success/10 text-success">
                          {message.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="h-8">
                            <span className="material-icons text-xs">visibility</span>
                          </Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <span className="material-icons text-xs">send</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {messageHistory.length} messages
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
