// Real-time monitoring view
'use client';

import React, { useState, useEffect } from 'react';
import AlertsCard from '@/components/ui/AlertsCard';
import type { AlertItem } from '@/types/types';

export default function LiveMonitoringPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Mock live alerts generator
  useEffect(() => {
    // Initial mock alerts
    setAlerts([
      { _id: '1', type: 'warning', message: 'Cooling temperature slightly elevated', timestamp: new Date().toISOString(), step: 'Cooling' },
      { _id: '2', type: 'info', message: 'Blow Molding completed successfully', timestamp: new Date().toISOString(), step: 'Blow Molding' },
    ]);

    // Simulate receiving new alerts every 10 seconds
    const interval = setInterval(() => {
      const id = (alerts.length + 1).toString();
      const types: AlertItem['type'][] = ['info', 'warning', 'error'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newAlert: AlertItem = {
        _id: id,
        type: randomType,
        message: `Random ${randomType} alert #${id}`,
        timestamp: new Date().toISOString(),
        step: `Step ${Math.ceil(Math.random() * 5)}`,
      };
      setAlerts(prev => [newAlert, ...prev]); // newest on top
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Live Monitoring</h1>
      <AlertsCard alerts={alerts} />
    </div>
  );
}
