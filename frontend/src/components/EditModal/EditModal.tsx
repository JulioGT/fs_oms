import Modal from "../Modal/Modal";
import OrderForm from "../../pages/OrderForm";

interface EditModalProps {
  mode: "edit" | "create" | "show";
  closeEdit: () => void;
  editingId: string | null;
}

function EditModal({ mode, closeEdit, editingId }: EditModalProps) {
  if (!editingId) {
    return <></>;
  }

  return (
    <Modal onClose={closeEdit}>
      {mode === "edit" && <h2 className="mb-4 text-2xl font-semibold">Edit Order</h2>}
      <OrderForm mode={mode} orderId={editingId} onClose={closeEdit} />
    </Modal>
  );
}

export default EditModal;
