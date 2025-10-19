import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteConfirmationModal from "./DeleteConfirmation";

// Mock the Modal component
jest.mock("../Modal/Modal", () => {
  return function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
    return (
      <div data-testid="modal">
        <button onClick={onClose} data-testid="modal-close">
          ×
        </button>
        {children}
      </div>
    );
  };
});

describe("DeleteConfirmationModal - DELETE & DESTROY TESTS", () => {
  const mockSetShowDeleteModal = jest.fn();
  const mockOnDeleteConfirmed = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnDeleteConfirmed.mockResolvedValue(undefined);
  });

  const renderDeleteModal = (
    showDeleteModal: boolean = true,
    deletingId: string | null = "order-123",
  ) => {
    return render(
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={mockSetShowDeleteModal}
        deletingId={deletingId}
        onDeleteConfirmed={mockOnDeleteConfirmed}
      />,
    );
  };

  describe("DELETE CONFIRMATION DISPLAY", () => {
    it("should render delete confirmation modal when showDeleteModal is true", () => {
      renderDeleteModal(true, "order-456");

      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("Confirm delete")).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete this order\?/)).toBeInTheDocument();
      expect(screen.getByText("order-456")).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone\./)).toBeInTheDocument();
    });

    it("should not render anything when showDeleteModal is false", () => {
      renderDeleteModal(false);

      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
      expect(screen.queryByText("Confirm delete")).not.toBeInTheDocument();
    });

    it("should display the correct order ID in confirmation message", () => {
      renderDeleteModal(true, "special-order-789");

      expect(screen.getByText("special-order-789")).toBeInTheDocument();
    });

    it("should render Cancel and Delete buttons", () => {
      renderDeleteModal();

      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });
  });

  describe("DELETE CANCELLATION", () => {
    it("should close modal when Cancel button is clicked", () => {
      renderDeleteModal();

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockSetShowDeleteModal).toHaveBeenCalledWith(false);
    });

    it("should close modal when modal close button is clicked", () => {
      renderDeleteModal();

      const closeButton = screen.getByTestId("modal-close");
      fireEvent.click(closeButton);

      expect(mockSetShowDeleteModal).toHaveBeenCalledWith(false);
    });

    it("should not call onDeleteConfirmed when cancelling", () => {
      renderDeleteModal();

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnDeleteConfirmed).not.toHaveBeenCalled();
    });
  });

  describe("DELETE CONFIRMATION & DESTRUCTION", () => {
    it("should call onDeleteConfirmed when Delete button is clicked", async () => {
      renderDeleteModal();

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnDeleteConfirmed).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle successful deletion", async () => {
      mockOnDeleteConfirmed.mockResolvedValue(undefined);
      renderDeleteModal();

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnDeleteConfirmed).toHaveBeenCalled();
      });

      // Should have been called (with or without arguments)
      expect(mockOnDeleteConfirmed).toHaveBeenCalled();
    });

    it("should handle deletion errors gracefully", async () => {
      const deleteError = new Error("Delete failed");
      mockOnDeleteConfirmed.mockRejectedValue(deleteError);
      renderDeleteModal();

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(mockOnDeleteConfirmed).toHaveBeenCalled();
      });

      // The component should still call the function even if it fails
      expect(mockOnDeleteConfirmed).toHaveBeenCalled();
    });

    it("should have correct button styling for delete action", () => {
      renderDeleteModal();

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton).toHaveClass("bg-red-600", "text-white");

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      expect(cancelButton).toHaveClass("border");
    });
  });

  describe("DELETE WORKFLOW INTEGRATION", () => {
    it("should show correct confirmation message format", () => {
      renderDeleteModal(true, "order-999");

      // Check the complete flow message
      expect(screen.getByText(/Are you sure you want to delete this order\?/)).toBeInTheDocument();
      expect(screen.getByText("order-999")).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone\./)).toBeInTheDocument();
    });

    it("should maintain accessibility with proper button roles", () => {
      renderDeleteModal();

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      expect(deleteButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });
});
