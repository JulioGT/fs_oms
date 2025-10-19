import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useSearchParams } from "react-router-dom";
import EditModal from "../components/EditModal/EditModal";
import Pagination from "../components/Pagination/Pagination";
import OrderTable from "../components/OrderTable/OrderTable";
import CardSection from "../components/CardSection/CardSection";
import DeleteConfirmationModal from "../components/DeleteConfirmation/DeleteConfirmation";
import { deleteOrder, listOrders, PaginatedOrdersResponse, OrderStatus } from "../api/orders";

export default function OrdersList() {
  const [pageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize status filter from URL params
  const getInitialStatusFilter = (): OrderStatus[] => {
    const statusParam = searchParams.get("status");

    if (!statusParam) {
      return [];
    }

    return statusParam
      .split(",")
      .filter((s): s is OrderStatus => ["pending", "completed", "cancelled"].includes(s));
  };

  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>(getInitialStatusFilter);
  const [data, setData] = useState<PaginatedOrdersResponse>({
    page: 1,
    data: [],
    total: 0,
    filtered_count: 0,
    page_size: 10,
    total_pending: 0,
    total_cancelled: 0,
    total_completed: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"edit" | "create" | "show">("edit");

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await listOrders(
        page,
        pageSize,
        selectedStatuses.length > 0 ? selectedStatuses : undefined,
      );
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = (statuses: OrderStatus[]) => {
    setSelectedStatuses(statuses);
    setPage(1);

    const newSearchParams = new URLSearchParams(searchParams);
    if (statuses.length > 0) {
      newSearchParams.set("status", statuses.join(","));
    } else {
      newSearchParams.delete("status");
    }
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedStatuses]);

  const totalPages = Math.max(1, Math.ceil(data.filtered_count / pageSize));
  const canNext = page < totalPages;
  const canPrev = page > 1;

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const onDeleteConfirmed = async () => {
    if (!deletingId) return;
    try {
      setLoading(true);
      await deleteOrder(deletingId);
      setShowDeleteModal(false);
      setDeletingId(null);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || e?.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (id: string, mode: "edit" | "create" | "show") => {
    setEditingId(id);
    setMode(mode);
  };

  const closeEdit = async () => {
    setEditingId(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <>
        <Header setEditingId={setEditingId} setMode={setMode} />

        <CardSection data={data} />

        {error && <div className="rounded bg-red-50 p-3 text-red-700">{error}</div>}

        <OrderTable
          data={data}
          openEdit={openEdit}
          confirmDelete={confirmDelete}
          loading={loading}
          selectedStatuses={selectedStatuses}
          onStatusFilterChange={handleStatusChange}
        />

        <Pagination
          setPage={setPage}
          totalPages={totalPages}
          canNext={canNext}
          canPrev={canPrev}
          page={page}
        />
      </>

      <EditModal mode={mode} closeEdit={closeEdit} editingId={editingId} />

      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deletingId={deletingId}
        onDeleteConfirmed={onDeleteConfirmed}
      />
    </div>
  );
}
