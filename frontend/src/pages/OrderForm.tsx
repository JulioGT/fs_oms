import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createOrder, getOrder, Order, OrderStatus, patchOrder, putOrder } from "../api/orders";
import { z } from "zod";

const formSchema = z.object({
  customerName: z.string().min(1).max(100),
  item: z.string().min(1).max(100),
  quantity: z.coerce.number().int().min(1),
  // Use a string with a refine check instead of z.enum/z.union to avoid TS overload issues
  status: z
    .string()
    .min(1)
    .refine((v) => v === "pending" || v === "completed" || v === "cancelled", {
      message: "status must be one of: pending, completed, cancelled",
    }),
});

type FormState = z.infer<typeof formSchema>;

export default function OrderForm({ mode }: { mode: "create" | "edit" }) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [values, setValues] = useState<FormState>({
    customerName: "",
    item: "",
    quantity: 1,
    status: "pending",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
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
      } else if (id) {
        // full PUT for simplicity
        const payload = { ...parsed.data, status: parsed.data.status as OrderStatus };
        await putOrder(id, payload);
      }
      navigate("/orders");
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {mode === "create" ? "New Order" : `Edit Order ${id}`}
        </h1>
        <Link className="rounded bg-gray-200 px-3 py-2" to="/orders">
          Back
        </Link>
      </div>

      {error && <div className="rounded bg-red-50 p-3 text-red-700">{error}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={values.customerName}
              onChange={(e) => setValues({ ...values, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Item</label>
            <input
              className="mt-1 w-full rounded border p-2"
              value={values.item}
              onChange={(e) => setValues({ ...values, item: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={values.quantity}
              onChange={(e) => setValues({ ...values, quantity: Number(e.target.value) })}
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
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
        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
