export const getStepStatusConfig = (status: string) => {
  switch (status) {
    case "in_progress":
      return { label: "In Progress", color: "text-blue-700", bg: "bg-blue-100" };
    case "pending":
      return { label: "Pending", color: "text-gray-700", bg: "bg-gray-100" };
    case "completed":
      return { label: "Completed", color: "text-green-700", bg: "bg-green-100" };
    case "paused":
      return { label: "Paused", color: "text-orange-700", bg: "bg-orange-100" };
    default:
      return { label: status, color: "text-gray-700", bg: "bg-gray-100" };
  }
};

export const getMachineStatusConfig = (status: string) => {
  switch (status) {
    case "in_use":
      return { label: "In Use", color: "text-blue-700", bg: "bg-blue-100" };
    case "available":
      return { label: "Available", color: "text-green-700", bg: "bg-green-100" };
    case "maintenance":
      return { label: "Maintenance", color: "text-orange-700", bg: "bg-orange-100" };
    case "out_of_service":
      return { label: "Out of Service", color: "text-red-700", bg: "bg-red-100" };
    default:
      return { label: status, color: "text-gray-700", bg: "bg-gray-100" };
  }
};
