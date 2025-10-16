import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder, Order } from "../api/orders";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) return;
        const res = await getOrder(id);
        setOrder(res);
      } catch (e: any) {
        setError(e?.response?.data?.error?.message || e?.message || "Not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="rounded bg-red-50 p-3 text-red-700">{error}</div>;
  if (!order) return <div>Not found</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Order {order.id}</h1>
        <div className="space-x-2">
          <Link className="rounded bg-gray-200 px-3 py-2" to="/orders">
            Back
          </Link>
          <Link
            className="rounded bg-blue-600 px-3 py-2 text-white"
            to={`/orders/${order.id}/edit`}
          >
            Edit
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded border bg-white">
        <div className="grid grid-cols-2 gap-4 p-4 text-sm">
          <div>
            <span className="font-medium">Customer:</span> {order.customerName}
          </div>
          <div>
            <span className="font-medium">Item:</span> {order.item}
          </div>
          <div>
            <span className="font-medium">Quantity:</span> {order.quantity}
          </div>
          <div>
            <span className="font-medium">Status:</span> {order.status}
          </div>
          <div>
            <span className="font-medium">Created:</span>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{" "}
            {new Date(order.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
