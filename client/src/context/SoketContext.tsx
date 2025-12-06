import { useAuthContext } from '@/hooks/useAuthContext';
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';

// -------------------- Types --------------------
export interface MachineData {
  machineId: string;
  status: "ON" | "OFF";
  payload: any;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  activeMachines: Record<string, MachineData>;
  isMachineOn: (machineId: string) => boolean;
  getMachineData: (machineId: string) => MachineData | null;
  totalActiveMachines: number;
}

interface SocketProviderProps {
  children: ReactNode;
}

// -------------------- Context --------------------
export const SocketContext = createContext<SocketContextType | undefined>(undefined);

// -------------------- Provider --------------------
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeMachines, setActiveMachines] = useState<Record<string, MachineData>>({});
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;

    const socketInstance: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      autoConnect: true,
      auth: {
        userName: user.name,
        role: user.role,
        userId: user._id,
      },
    });

    // Connection events
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    // Machine status events
    const handleStatus = (data: MachineData) => {
      setActiveMachines((prev) => {
        const updated = { ...prev };
        if (data.status === "ON") {
          updated[data.machineId] = data;
        } else {
          delete updated[data.machineId];
        }
        return updated;
      });
    };

    const handleSensors = (data: MachineData) => {
      setActiveMachines((prev) => {
        if (!prev[data.machineId]) return prev;
        return { 
          ...prev, 
          [data.machineId]: { 
            ...prev[data.machineId], 
            payload: data.payload, 
            timestamp: data.timestamp 
          } 
        };
      });
    };

    socketInstance.on("machine_status", handleStatus);
    socketInstance.on("machine_sensors", handleSensors);

    // Save socket instance in state
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.off("machine_status", handleStatus);
      socketInstance.off("machine_sensors", handleSensors);
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  const isMachineOn = (machineId: string): boolean => {
    return !!activeMachines[machineId];
  };

  const getMachineData = (machineId: string): MachineData | null => {
    return activeMachines[machineId] || null;
  };

  const totalActiveMachines = Object.keys(activeMachines).length;

  return (
    <SocketContext.Provider 
      value={{ 
        socket, 
        isConnected,
        activeMachines,
        isMachineOn,
        getMachineData,
        totalActiveMachines
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};