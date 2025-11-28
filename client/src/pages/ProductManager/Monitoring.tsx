// // import React, { useState, useEffect } from 'react';
// // import AlertsCard from '@/components/ui/AlertsCard';
// // import type { AlertItem } from '@/types/types';
// // import { alerts as initialAlerts } from '@/components/productmanager/mockData';

// interface LiveMonitoringPageProps {
//   initialData?: AlertItem[];
// }

export default function LiveMonitoringPage(){
  // const [alerts, setAlerts] = useState<AlertItem[]>(initialData || initialAlerts);

  // // Example: placeholder for future WebSocket integration
  // useEffect(() => {
  //   // In the future, you can connect to your WebSocket here and update alerts:
  //   // ws.onmessage = (event) => setAlerts(prev => [event.data, ...prev]);
  // }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Live Monitoring</h1>
    </div>
  );
}
