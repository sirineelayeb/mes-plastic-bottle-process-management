'use client';
import React from "react";
import { AlertCircle } from "lucide-react";

interface AlertItemProps {
  type: 'error' | 'warning' | 'info';
  message: string;
  step: string;
  timestamp: string;
}

export default function AlertItem({ type, message, step, timestamp }: AlertItemProps) {
  const typeClasses = {
    error: 'bg-red-100 border-red-300 text-red-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800'
  };

  return (
    <div className={`p-3 rounded-lg border ${typeClasses[type]}`}>
      <div className="flex gap-2">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium uppercase">{type}</p>
          <p className="text-sm mt-1">{message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {step} • {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
