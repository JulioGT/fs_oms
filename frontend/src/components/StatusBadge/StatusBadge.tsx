import { Order } from "../../api/orders";

function StatusBadge({ status }: { status: Order["status"] }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold capitalize transition-colors duration-150";
  if (status === "completed")
    return (
      <span className={base + " bg-green-50 text-green-800 border border-green-100"}>{status}</span>
    );
  if (status === "cancelled")
    return <span className={base + " bg-red-50 text-red-800 border border-red-100"}>{status}</span>;
  return (
    <span className={base + " bg-orange-50 text-orange-800 border border-orange-100"}>
      {status}
    </span>
  );
}

export default StatusBadge;
