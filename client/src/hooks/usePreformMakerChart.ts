import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocketContext";

export function usePreformMakerChart(machineId: string) {
  const { activeMachines } = useSocket();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
  const m = activeMachines[machineId];
  if (!m || !m.payload) return;

  const entry = {
    time: new Date(m.timestamp),     
    barrelTemperature: m.payload.barrelTemperature,
    injectionPressure: m.payload.injectionPressure,
    clampingForce: m.payload.clampingForce,
  };

  setData((prev) => [...prev, entry].slice(-20));
}, [activeMachines[machineId]]);


  return data;
}
