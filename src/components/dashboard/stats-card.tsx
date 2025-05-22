import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  trendText?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconColor,
  trend,
  trendText = "from last week"
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <h2 className="text-2xl font-semibold text-foreground mt-1">{value}</h2>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            iconColor === 'primary' ? 'bg-blue-500/10' : 
            iconColor === 'warning' ? 'bg-yellow-500/10' : 
            iconColor === 'success' ? 'bg-green-500/10' : 
            iconColor === 'destructive' ? 'bg-red-500/10' : 'bg-gray-500/10'
          }`}>
            <span className={`material-icons ${
              iconColor === 'primary' ? 'text-blue-500' : 
              iconColor === 'warning' ? 'text-yellow-500' : 
              iconColor === 'success' ? 'text-green-500' : 
              iconColor === 'destructive' ? 'text-red-500' : 'text-gray-500'
            }`}>{icon}</span>
          </div>
        </div>
        {trend && (
          <div className="flex items-center mt-4">
            <span className={`text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"} flex items-center`}>
              <span className="material-icons text-xs mr-1">
                {trend.isPositive ? "arrow_upward" : "arrow_downward"}
              </span>
              {trend.value}
            </span>
            {trendText && <span className="text-xs text-muted-foreground ml-2">{trendText}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
