import api from "./client";

export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  item: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  total: number;
  filtered_count: number;
  page: number;
  page_size: number;
  total_cancelled: number;
  total_completed: number;
  total_pending: number;
}

export async function listOrders(page = 1, pageSize = 10, statusFilter?: OrderStatus[]) {
  const params: Record<string, unknown> = { page, page_size: pageSize };

  if (statusFilter && statusFilter.length > 0) {
    params.status = statusFilter.join(",");
  }

  const res = await api.get<PaginatedOrdersResponse>(`/orders`, { params });
  return res.data;
}

export async function getOrder(id: string) {
  const res = await api.get<Order>(`/orders/${id}`);
  return res.data;
}

export async function createOrder(payload: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  const res = await api.post<Order>(`/orders`, payload);
  return res.data;
}

export async function putOrder(id: string, payload: Omit<Order, "id" | "createdAt" | "updatedAt">) {
  const res = await api.put<Order>(`/orders/${id}`, payload);
  return res.data;
}

export async function patchOrder(
  id: string,
  payload: Partial<Omit<Order, "id" | "createdAt" | "updatedAt">>,
) {
  const res = await api.patch<Order>(`/orders/${id}`, payload);
  return res.data;
}

export async function deleteOrder(id: string) {
  await api.delete(`/orders/${id}`);
}
