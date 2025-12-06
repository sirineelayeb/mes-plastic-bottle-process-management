import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocketContext";

export function useFillerCapperChart(machineId: string) {
  const { activeMachines } = useSocket();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const m = activeMachines[machineId];
    if (!m || !m.payload) return;

    const entry = {
      time: new Date(m.timestamp),     
      fillVolume: m.payload.fillVolume,
      conveyorSpeed: m.payload.conveyorSpeed,
      capTorque: m.payload.capTorque,
    };

    setData((prev) => [...prev, entry].slice(-20));
  }, [activeMachines[machineId]]);

  return data;
}