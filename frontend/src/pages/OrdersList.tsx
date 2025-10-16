import { useEffect, useState } from "react";
import { deleteOrder, listOrders, Order } from "../api/orders";
import { Link } from "react-router-dom";

export default function OrdersList() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await listOrders(page, pageSize);
      setData(res.data);
      setTotal(res.total);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const onDelete = async (id: string) => {
    await deleteOrder(id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Link
          to="/orders/new"
          className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          New Order
        </Link>
      </div>

      {error && <div className="rounded bg-red-50 p-3 text-red-700">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-hidden rounded border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Item</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-xs">
                    <Link className="text-blue-600 hover:underline" to={`/orders/${o.id}`}>
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{o.customerName}</td>
                  <td className="px-4 py-2">{o.item}</td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2 capitalize">{o.status}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <Link
                      className="rounded bg-gray-200 px-2 py-1 text-sm"
                      to={`/orders/${o.id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded bg-red-600 px-2 py-1 text-sm text-white"
                      onClick={() => onDelete(o.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!canPrev}
        >
          Previous
        </button>
        <div className="text-sm">
          Page {page} of {totalPages}
        </div>
        <button
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
          onClick={() => setPage((p) => (canNext ? p + 1 : p))}
          disabled={!canNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
