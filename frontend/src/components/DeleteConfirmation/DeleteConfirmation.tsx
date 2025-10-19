import Modal from "../Modal/Modal";

interface DeleteConfirmationModalProps {
  showDeleteModal: boolean;
  setShowDeleteModal: (value: boolean) => void;
  deletingId: string | null;
  onDeleteConfirmed: () => Promise<void>;
}

function DeleteConfirmationModal({
  showDeleteModal,
  setShowDeleteModal,
  deletingId,
  onDeleteConfirmed,
}: DeleteConfirmationModalProps) {
  if (!showDeleteModal) {
    return <></>;
  }

  return (
    <Modal onClose={() => setShowDeleteModal(false)}>
      <div className="text-center">
        <h3 className="mb-4 text-lg font-semibold">Confirm delete</h3>
        <div className="mb-4 text-sm text-gray-600">
          <p>Are you sure you want to delete this order?</p>
          <div className="my-2 font-bold">{deletingId}</div>
          <p>This action cannot be undone.</p>
        </div>
        <div className="flex justify-center space-x-3">
          <button onClick={() => setShowDeleteModal(false)} className="rounded border px-4 py-2">
            Cancel
          </button>
          <button
            onClick={() => {
              onDeleteConfirmed().catch((error) => {
                console.error("Delete operation failed:", error);
              });
            }}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
