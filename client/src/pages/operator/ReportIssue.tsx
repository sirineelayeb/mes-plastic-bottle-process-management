import { useState } from "react";
import {
  AlertTriangle,
  X,
  MessageSquare,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";



export default function ReportIssue() {
 

  return (
    <div>
     <h1 className="text-3xl font-bold mb-5">Send Report</h1>
   <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          Report an Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Title
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Briefly describe the issue..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detailed Description
            </label>
            <Textarea
              placeholder="Include steps to reproduce, error messages, or relevant context..."
              rows={4}
            />
          </div>

          {/* Reporter & Date (static values) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reported By
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  value="John Doe" // ← static name
                  disabled
                  className="pl-10 bg-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  type="date"
                  value={new Date().toISOString().split("T")[0]}
                  disabled
                  className="pl-10 bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Submit Button (does nothing) */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => alert("Issue reported! (This is a static demo.)")}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
  );
}


