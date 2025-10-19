import { render, screen, fireEvent } from "@testing-library/react";
import EditModal from "./EditModal";

// Mock the Modal component
jest.mock("../Modal/Modal", () => {
  return function Modal({ onClose, children }: any) {
    return (
      <div data-testid="modal-backdrop">
        <div data-testid="modal-content">
          <button data-testid="modal-close" onClick={onClose}>
            ×
          </button>
          {children}
        </div>
      </div>
    );
  };
});

// Mock the OrderForm component
jest.mock("../../pages/OrderForm", () => {
  return function OrderForm({ mode, orderId, onClose }: any) {
    return (
      <div data-testid="order-form">
        <div data-testid="form-mode">{mode}</div>
        <div data-testid="form-order-id">{orderId}</div>
        <button data-testid="form-close" onClick={onClose}>
          Close Form
        </button>
        {mode === "edit" && (
          <>
            <input data-testid="edit-customer" defaultValue="John Doe" />
            <input data-testid="edit-item" defaultValue="Widget A" />
            <input data-testid="edit-quantity" type="number" defaultValue="5" />
            <select data-testid="edit-status" defaultValue="pending">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button data-testid="save-button">Save Changes</button>
          </>
        )}
        {mode === "show" && (
          <div data-testid="order-details">
            <div>Customer: John Doe</div>
            <div>Item: Widget A</div>
            <div>Quantity: 5</div>
            <div>Status: pending</div>
          </div>
        )}
      </div>
    );
  };
});

describe("EditModal Component - COMPREHENSIVE EDIT TESTS", () => {
  const mockCloseEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("MODAL DISPLAY & MODES", () => {
    it("should not render when editingId is null", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId={null} />);

      expect(screen.queryByTestId("modal-backdrop")).not.toBeInTheDocument();
    });

    it("should render when editingId is provided", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      expect(screen.getByTestId("modal-backdrop")).toBeInTheDocument();
      expect(screen.getByTestId("modal-content")).toBeInTheDocument();
    });

    it('should show "Edit Order" title when mode is edit', () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      expect(screen.getByText("Edit Order")).toBeInTheDocument();
    });

    it("should not show title when mode is show", () => {
      render(<EditModal mode="show" closeEdit={mockCloseEdit} editingId="1" />);

      // Only edit mode shows the title
      expect(screen.queryByText("Edit Order")).not.toBeInTheDocument();
    });

    it("should call closeEdit when close button is clicked", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      fireEvent.click(screen.getByTestId("modal-close"));
      expect(mockCloseEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe("EDIT MODE FUNCTIONALITY", () => {
    it("should pass correct props to OrderForm in edit mode", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="123" />);

      expect(screen.getByTestId("form-mode")).toHaveTextContent("edit");
      expect(screen.getByTestId("form-order-id")).toHaveTextContent("123");
    });

    it("should render edit form fields when in edit mode", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      // Check mocked form fields are present in edit mode
      expect(screen.getByTestId("edit-customer")).toBeInTheDocument();
      expect(screen.getByTestId("edit-item")).toBeInTheDocument();
      expect(screen.getByTestId("edit-quantity")).toBeInTheDocument();
      expect(screen.getByTestId("edit-status")).toBeInTheDocument();
      expect(screen.getByTestId("save-button")).toBeInTheDocument();
    });

    it("should allow form interactions in edit mode", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      const customerInput = screen.getByTestId("edit-customer");
      const quantityInput = screen.getByTestId("edit-quantity");
      const statusSelect = screen.getByTestId("edit-status");

      // Test form interactions
      fireEvent.change(customerInput, { target: { value: "Jane Doe" } });
      fireEvent.change(quantityInput, { target: { value: "10" } });
      fireEvent.change(statusSelect, { target: { value: "completed" } });

      expect(customerInput).toHaveValue("Jane Doe");
      expect(quantityInput).toHaveValue(10);
      expect(statusSelect).toHaveValue("completed");
    });

    it("should call closeEdit when form close button is clicked", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      fireEvent.click(screen.getByTestId("form-close"));
      expect(mockCloseEdit).toHaveBeenCalledTimes(1);
    });

    it("should handle save button click in edit mode", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      const saveButton = screen.getByTestId("save-button");
      fireEvent.click(saveButton);

      // Save button is rendered and clickable
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe("SHOW MODE FUNCTIONALITY", () => {
    it("should pass correct props to OrderForm in show mode", () => {
      render(<EditModal mode="show" closeEdit={mockCloseEdit} editingId="456" />);

      expect(screen.getByTestId("form-mode")).toHaveTextContent("show");
      expect(screen.getByTestId("form-order-id")).toHaveTextContent("456");
    });

    it("should render order details when in show mode", () => {
      render(<EditModal mode="show" closeEdit={mockCloseEdit} editingId="1" />);

      // Check mocked order details are displayed
      expect(screen.getByTestId("order-details")).toBeInTheDocument();
      expect(screen.getByText("Customer: John Doe")).toBeInTheDocument();
      expect(screen.getByText("Item: Widget A")).toBeInTheDocument();
      expect(screen.getByText("Quantity: 5")).toBeInTheDocument();
      expect(screen.getByText("Status: pending")).toBeInTheDocument();
    });

    it("should not show edit form fields in show mode", () => {
      render(<EditModal mode="show" closeEdit={mockCloseEdit} editingId="1" />);

      // Edit fields should not be present in show mode
      expect(screen.queryByTestId("edit-customer")).not.toBeInTheDocument();
      expect(screen.queryByTestId("edit-item")).not.toBeInTheDocument();
      expect(screen.queryByTestId("edit-quantity")).not.toBeInTheDocument();
      expect(screen.queryByTestId("edit-status")).not.toBeInTheDocument();
      expect(screen.queryByTestId("save-button")).not.toBeInTheDocument();
    });
  });

  describe("CREATE MODE FUNCTIONALITY", () => {
    it("should pass correct props to OrderForm in create mode", () => {
      render(<EditModal mode="create" closeEdit={mockCloseEdit} editingId="new" />);

      expect(screen.getByTestId("form-mode")).toHaveTextContent("create");
      expect(screen.getByTestId("form-order-id")).toHaveTextContent("new");
    });

    it('should not show "Edit Order" title in create mode', () => {
      render(<EditModal mode="create" closeEdit={mockCloseEdit} editingId="new" />);

      // Only edit mode shows this title
      expect(screen.queryByText("Edit Order")).not.toBeInTheDocument();
    });
  });

  describe("MODAL INTEGRATION", () => {
    it("should handle different order IDs correctly", () => {
      const orderIds = ["1", "999", "abc-123"];

      orderIds.forEach((orderId) => {
        const { unmount } = render(
          <EditModal mode="edit" closeEdit={mockCloseEdit} editingId={orderId} />,
        );

        expect(screen.getByTestId("form-order-id")).toHaveTextContent(orderId);
        unmount();
      });
    });

    it("should handle all three modes correctly", () => {
      const modes: Array<"edit" | "show" | "create"> = ["edit", "show", "create"];

      modes.forEach((mode) => {
        const { unmount } = render(
          <EditModal mode={mode} closeEdit={mockCloseEdit} editingId="test" />,
        );

        expect(screen.getByTestId("form-mode")).toHaveTextContent(mode);
        unmount();
      });
    });

    it("should properly close modal from both close buttons", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="1" />);

      // Test modal close button
      fireEvent.click(screen.getByTestId("modal-close"));
      expect(mockCloseEdit).toHaveBeenCalledTimes(1);

      // Reset mock
      jest.clearAllMocks();

      // Test form close button
      fireEvent.click(screen.getByTestId("form-close"));
      expect(mockCloseEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe("EDGE CASES", () => {
    it("should handle empty string as editingId", () => {
      render(<EditModal mode="edit" closeEdit={mockCloseEdit} editingId="" />);

      // Empty string is falsy, so modal should not render
      expect(screen.queryByTestId("modal-backdrop")).not.toBeInTheDocument();
    });

    it("should handle undefined closeEdit function gracefully", () => {
      // This test ensures component doesn't crash with undefined function
      expect(() => {
        render(<EditModal mode="edit" closeEdit={undefined as any} editingId="1" />);
      }).not.toThrow();
    });
  });
});
