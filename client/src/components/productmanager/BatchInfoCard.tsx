import { Progress } from "@/components/ui/progress";

interface BatchInfoCardProps {
  productName: string;
  quantity: number;
  progress: number;
}

export default function BatchInfoCard({ productName, quantity, progress }: BatchInfoCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="font-semibold text-lg">{productName}</h2>
      <p className="text-muted-foreground mb-2">Produced: {quantity}</p>
      <Progress value={progress} className="h-3 rounded-full" />
      <p className="text-sm mt-1">{progress}% completed</p>
    </div>
  );
}
