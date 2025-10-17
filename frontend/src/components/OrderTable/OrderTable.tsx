import StatusBadge from "../StatusBadge/StatusBadge";
import StatusMultiSelect from "../StatusMultiSelect/StatusMultiSelect";
import { PaginatedOrdersResponse, OrderStatus } from "../../api/orders";
import Loading from "../Loading/Loading";

interface OrderTableProps {
  data: PaginatedOrdersResponse;
  openEdit: (id: string, mode: "show" | "create" | "edit") => void;
  confirmDelete: (id: string) => void;
  loading: boolean;
  selectedStatuses: OrderStatus[];
  onStatusFilterChange: (statuses: OrderStatus[]) => void;
}

function OrderTable({
  data,
  openEdit,
  confirmDelete,
  loading,
  selectedStatuses,
  onStatusFilterChange,
}: OrderTableProps) {
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="rounded border bg-white overflow-visible">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-sm text-gray-600">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2 uppercase text-sm">
              <span className="mr-2">Filter by:</span>
            </th>
            <th className="px-4 py-2 uppercase text-sm relative">
              <div className="flex items-center">
                <StatusMultiSelect
                  selectedStatuses={selectedStatuses}
                  onSelectionChange={onStatusFilterChange}
                />
              </div>
            </th>
          </tr>
          <tr>
            <th className="px-4 py-2 uppercase text-sm">Order ID</th>
            <th className="px-4 py-2 uppercase text-sm">Customer</th>
            <th className="px-4 py-2 uppercase text-sm">Item</th>
            <th className="px-4 py-2 uppercase text-sm">Qty</th>
            <th className="px-4 py-2 uppercase text-sm">Status</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 text-sm">
                <span
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    openEdit(order.id, "show");
                  }}
                >
                  {order.id}
                </span>
              </td>
              <td className="px-4 py-2 text-sm">{order.customerName}</td>
              <td className="px-4 py-2 text-sm">{order.item}</td>
              <td className="px-4 py-2 text-sm">{order.quantity}</td>
              <td className="px-4 py-2 text-sm">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-2 text-right space-x-2">
                {/* Edit icon */}
                <button
                  title="Edit"
                  onClick={() => openEdit(order.id, "edit")}
                  className="inline-flex items-center justify-center rounded-md bg-white border p-2 text-gray-600 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                  </svg>
                </button>

                {/* Delete icon */}
                <button
                  title="Delete"
                  onClick={() => confirmDelete(order.id)}
                  className="inline-flex items-center justify-center rounded bg-red-600 p-2 text-white hover:bg-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 0 011 1v2H9V4a1 1 0 011-1z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
