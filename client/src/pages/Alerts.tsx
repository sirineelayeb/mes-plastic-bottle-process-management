import AlertsList from "@/components/productmanager/AlertsList";
import { alerts } from "@/components/productmanager/mockData"; // ← import your mock alerts array

export default function AlertsPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Production Alerts</h1>
      <AlertsList alerts={alerts} />
    </div>
  );
}
