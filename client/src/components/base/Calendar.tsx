import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Calendar() {
  // your date range (from → to)
  const range = {
    from: new Date(2025, 11, 10), // Jan 10, 2025
    to: new Date(2025, 11, 22),   // Jan 22, 2025
  };

  return (
    <DayPicker
      mode="range"
      selected={range}
      disabled={{
        before: range.from,
        after: range.to
      }} // makes it display-only
    />
  );
}
