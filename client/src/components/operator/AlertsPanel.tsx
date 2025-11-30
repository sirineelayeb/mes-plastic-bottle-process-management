import { Wrench, Send, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function AlertsPanel() {
  const handleSend = () => {
    alert("Maintenance request sent to Product Manager!");
  };

  return (
    <Card className="rounded-xl shadow-sm border-l-4 border-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Wrench className="w-6 h-6 text-blue-600" />
          Request Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">
          Describe the issue or reason for maintenance below:
        </p>

        <div className="relative mb-4">
          <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Textarea
            placeholder="e.g. Machine M3 is overheating, unusual noise from conveyor belt, calibration needed..."
            rows={4}
            className="pl-10 pr-3 pt-9"
          />
        </div>

        <Button
          onClick={handleSend}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-2"
        >
          <Send className="w-4 h-4" />
          Send to Product Manager
        </Button>
      </CardContent>
    </Card>
  );
}