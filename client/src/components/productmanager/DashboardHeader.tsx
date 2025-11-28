import { Activity } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
