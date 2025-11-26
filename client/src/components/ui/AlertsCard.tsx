'use client';
import React from "react";
import { AlertCircle } from "lucide-react";
import AlertItem from "./AlertItem";

interface Alert {
  _id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  step: string;
  timestamp: string;
}

interface AlertsCardProps {
  alerts: Alert[];
}

export default function AlertsCard({ alerts }: AlertsCardProps) {
  return (
    <div className="bg-card border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" /> Recent Alerts
        </h2>
      </div>
      <div className="p-4 space-y-3">
        {alerts.length === 0 && <p className="text-sm text-muted-foreground">No alerts</p>}
        {alerts.map(alert => (
          <AlertItem
            key={alert._id}
            type={alert.type}
            message={alert.message}
            step={alert.step}
            timestamp={alert.timestamp}
          />
        ))}
      </div>
    </div>
  );
}
