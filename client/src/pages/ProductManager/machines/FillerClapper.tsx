import { useSocket } from "@/hooks/useSocketContext";
import { MachineLineChart } from "@/components/base/RealTimeLineChart";
import { useFillerCapperChart } from "@/hooks/useFillerCapperChart";

function FillerCapper() {
  const machineId = "MACHINE003";

  const { isMachineOn, getMachineData } = useSocket();
  const chartData = useFillerCapperChart(machineId);
  const machine = getMachineData(machineId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Filler Capper (MACHINE003)</h1>

      {!isMachineOn(machineId) && (
        <p className="text-red-600 font-bold">Machine is OFF</p>
      )}

      {isMachineOn(machineId) && (
        <>
          <p className="text-green-600 font-semibold mb-4">Machine is ON</p>
          <div className="flex gap-5">
            <MachineLineChart
              title="Fill Volume (ml)"
              data={chartData}
              dataKey="fillVolume"
              min={500}
              max={510}
              color="var(--chart-1)"
            />

            <MachineLineChart
              title="Conveyor Speed (m/min)"
              data={chartData}
              dataKey="conveyorSpeed"
              min={120}
              max={150}
              color="var(--chart-2)"
            />

            <MachineLineChart
              title="Cap Torque (Nm)"
              data={chartData}
              dataKey="capTorque"
              min={0.8}
              max={1.1}
              color="var(--chart-3)"
            />
          </div>

          <h3 className="mt-4 font-semibold">Latest Raw Payload:</h3>
          <pre className="p-4 rounded text-sm mt-2">
            {JSON.stringify(machine?.payload, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

export default FillerCapper;