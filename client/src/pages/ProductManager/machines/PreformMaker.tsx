import { useSocket } from "@/hooks/useSocketContext";
import {MachineLineChart} from "@/components/base/RealTimeLineChart";
import { usePreformMakerChart } from "@/hooks/usePreformMakerChart";

function PreformMaker() {
  const machineId = "MACHINE001";

  const { isMachineOn, getMachineData } = useSocket();
  const chartData = usePreformMakerChart(machineId);
  const machine = getMachineData(machineId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Preform Maker (MACHINE001)</h1>

      {!isMachineOn(machineId) && (
        <p className="text-red-600 font-bold">Machine is OFF</p>
      )}

      {isMachineOn(machineId) && (
        <>
          <p className="text-green-600 font-semibold mb-4">Machine is ON</p>
          <div className="flex gap-5">
        <MachineLineChart
  title="Barrel Temperature (°C)"
  data={chartData}
  dataKey="barrelTemperature"
  min={200}
  max={260}
  color="var(--chart-1)"
/>

<MachineLineChart
  title="Injection Pressure (bar)"
  data={chartData}
  dataKey="injectionPressure"
  min={60}
  max={150}
  color="var(--chart-2)"
/>

<MachineLineChart
  title="Clamping Force (kN)"
  data={chartData}
  dataKey="clampingForce"
  min={450}
  max={600}
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

export default PreformMaker;
