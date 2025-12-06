import { Wrench, Send, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function AlertsPanel() {
const handleSend = () => {
alert("Maintenance request sent to Product Manager!");
};

return ( <Card className="rounded-xl shadow-sm"> <CardHeader className="pb-3"> <CardTitle className="flex items-center gap-2"> <Wrench className="w-6 h-6" />
Request Maintenance </CardTitle> </CardHeader> <CardContent> <p className="text-sm mb-4">
Describe the issue or reason for maintenance below: </p>


    <div className="relative mb-4">
      <MessageSquare className="absolute left-3 top-3 w-4 h-4" />
      <Textarea
        placeholder="e.g. Machine M3 is overheating, unusual noise from conveyor belt, calibration needed..."
        rows={4}
        className="pl-10 pr-3 pt-3"
      />
    </div>

    <Button
      onClick={handleSend}
      className="w-full flex items-center justify-center gap-2 py-2"
    >
      <Send className="w-4 h-4" />
      Send to Product Manager
    </Button>
  </CardContent>
</Card>


);
}
