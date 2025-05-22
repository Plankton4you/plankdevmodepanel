import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityLog } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

const activityIcons: Record<string, { icon: string, bgColor: string, iconColor: string }> = {
  "connected": { icon: "devices", bgColor: "bg-success/10", iconColor: "text-success" },
  "disconnected": { icon: "error", bgColor: "bg-destructive/10", iconColor: "text-destructive" },
  "reconnected": { icon: "devices", bgColor: "bg-success/10", iconColor: "text-success" },
  "command_sent": { icon: "code", bgColor: "bg-primary/10", iconColor: "text-primary" },
  "message_sent": { icon: "message", bgColor: "bg-primary/10", iconColor: "text-primary" },
  "message_received": { icon: "message", bgColor: "bg-primary/10", iconColor: "text-primary" },
  "file_created": { icon: "file_download", bgColor: "bg-warning/10", iconColor: "text-warning" },
  "file_deleted": { icon: "delete", bgColor: "bg-destructive/10", iconColor: "text-destructive" },
  "default": { icon: "info", bgColor: "bg-primary/10", iconColor: "text-primary" }
};

function getActivityIcon(action: string) {
  return activityIcons[action] || activityIcons.default;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return `just now`;
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  }
}

export default function ActivityFeed() {
  const { data: activities, isLoading, error } = useQuery<ActivityLog[]>({
    queryKey: ['/api/activity'],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 h-80">
            <div className="flex items-center p-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted"></div>
              <div className="ml-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
            <div className="flex items-center p-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted"></div>
              <div className="ml-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading activity logs</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80 pr-2">
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity) => {
                const { icon, bgColor, iconColor } = getActivityIcon(activity.action);
                return (
                  <div key={activity.id} className="flex items-start p-3 bg-secondary rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bgColor} flex-shrink-0`}>
                      <span className={`material-icons text-sm ${iconColor}`}>{icon}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">
                        Action: {activity.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(new Date(activity.timestamp))}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No recent activities
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Link href="/activity-logs">
          <Button className="mt-4 w-full" variant="outline">
            View All Activity
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
