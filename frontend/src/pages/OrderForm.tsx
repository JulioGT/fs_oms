import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOrder, getOrder, OrderStatus, putOrder } from "../api/orders";
import { z } from "zod";

const formSchema = z.object({
  customerName: z.string().min(1).max(100),
  item: z.string().min(1).max(100),
  quantity: z.coerce.number().int().min(1),
  status: z
    .string()
    .min(1)
    .refine((v) => v === "pending" || v === "completed" || v === "cancelled", {
      message: "status must be one of: pending, completed, cancelled",
    }),
});

type FormState = z.infer<typeof formSchema>;

export default function OrderForm({
  mode,
  orderId,
  onClose,
}: {
  mode: "create" | "edit" | "show";
  orderId?: string;
  onClose?: () => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const routeId = params?.id;
  const id = orderId ?? routeId;
  const [values, setValues] = useState<FormState>({
    customerName: "",
    item: "",
    quantity: 1,
    status: "pending",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "show") && id) {
      (async () => {
        try {
          setLoading(true);
          const order = await getOrder(id);
          setValues({
            customerName: order.customerName,
            item: order.item,
            quantity: order.quantity,
            status: order.status as OrderStatus,
          });
        } catch (e: any) {
          setError(e?.response?.data?.error?.message || e?.message || "Failed to load");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, mode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues.map((i) => i.message).join(", "));
      return;
    }
    try {
      setLoading(true);
      if (mode === "create") {
        const payload = { ...parsed.data, status: parsed.data.status as OrderStatus };
        await createOrder(payload);
        if (onClose) return onClose();
        navigate("/orders");
      } else if (id) {
        // full PUT for simplicity
        const payload = { ...parsed.data, status: parsed.data.status as OrderStatus };
        await putOrder(id, payload);
        if (onClose) return onClose();
        navigate("/orders");
      }
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{mode === "create" ? "New Order" : `${id}`}</h1>
      </div>

      {error && <div className="rounded bg-red-50 p-3 text-red-700">{error}</div>}

      <form onSubmit={onSubmit} className="my-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-8">
          <div>
            <label className="block text-sm font-bold">Customer Name</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={values.customerName}
              onChange={(e) => setValues({ ...values, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold">Item</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={values.item}
              onChange={(e) => setValues({ ...values, item: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold">Quantity</label>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={values.quantity}
              onChange={(e) => setValues({ ...values, quantity: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-bold">Status</label>
            <select
              className="mt-1 w-full rounded border p-2"
              value={values.status}
              onChange={(e) => setValues({ ...values, status: e.target.value as OrderStatus })}
            >
              <option value="pending">pending</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-8">
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-300 to-gray-100 px-5 py-2 text-black shadow-lg hover:opacity-95 focus:outline-none"
            to="/orders"
            onClick={() => onClose?.()}
          >
            Close
          </Link>
          {(mode === "edit" || mode === "create") && (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-white shadow-lg hover:opacity-95 focus:outline-none"
            >
              {mode === "create" ? "Create" : "Save"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
