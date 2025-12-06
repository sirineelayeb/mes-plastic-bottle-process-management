import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Calendar({ data }) {
  // Ensure processes exist
  const processes = data?.processes || [];

  if (processes.length === 0) return <p>No dates available</p>;

  // Extract all planned dates
  const dates = processes
    .map((p) => new Date(p.datePlanned))
    .filter((d) => !isNaN(d));

  // Get min / max
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  const range = { from: minDate, to: maxDate };

  return (
    <DayPicker
      mode="range"
      selected={range}
      disabled={{
        before: minDate,
        after: maxDate
      }}
    />
  );
}
