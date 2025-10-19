import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { getOrder, putOrder, createOrder } from "../api/orders";
import OrderForm from "./OrderForm";

// Mock the API functions
jest.mock("../api/orders", () => ({
  getOrder: jest.fn(),
  putOrder: jest.fn(),
  createOrder: jest.fn(),
}));

// Mock react-router-dom module completely to avoid Jest module resolution issues
jest.mock(
  "react-router-dom",
  () => ({
    __esModule: true,
    useNavigate: () => jest.fn(),
    useParams: () => ({}),
    Link: ({ children }: { children: any }) => children,
  }),
  { virtual: true },
);

const mockGetOrder = getOrder as jest.MockedFunction<typeof getOrder>;
const mockPutOrder = putOrder as jest.MockedFunction<typeof putOrder>;
const mockCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>;

describe("OrderForm Component - COMPREHENSIVE EDIT & CRUD TESTS", () => {
  const mockOnClose = jest.fn();

  const mockOrderData = {
    id: "1",
    customerName: "John Doe",
    item: "Widget A",
    quantity: 5,
    status: "pending" as const,
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOrder.mockResolvedValue(mockOrderData);
    mockPutOrder.mockResolvedValue(mockOrderData);
    mockCreateOrder.mockResolvedValue(mockOrderData);
  });

  describe("CREATE MODE FUNCTIONALITY", () => {
    it("should render create form with empty fields", async () => {
      render(<OrderForm mode="create" orderId={undefined} onClose={mockOnClose} />);

      // Check that form renders with initial state
      await waitFor(() => {
        expect(screen.getByText("New Order")).toBeInTheDocument();
      });

      // Check specific fields using getAllBy to handle multiple empty inputs
      const textInputs = screen.getAllByRole("textbox");
      expect(textInputs[0]).toHaveValue("");
      expect(textInputs[1]).toHaveValue("");
      expect(screen.getByDisplayValue("1")).toBeInTheDocument();
      expect(screen.getByDisplayValue("pending")).toBeInTheDocument();
    });

    it('should show "New Order" title in create mode', async () => {
      render(<OrderForm mode="create" orderId={undefined} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText("New Order")).toBeInTheDocument();
      });
    });

    it("should call createOrder when submitting new order", async () => {
      render(<OrderForm mode="create" orderId={undefined} onClose={mockOnClose} />);

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByText("New Order")).toBeInTheDocument();
      });

      // Get inputs by their position/value since labels aren't associated
      const inputs = screen.getAllByRole("textbox");
      const customerInput = inputs[0];
      const itemInput = inputs[1];
      const quantityInput = screen.getByRole("spinbutton");

      fireEvent.change(customerInput, { target: { value: "Jane Smith" } });
      fireEvent.change(itemInput, { target: { value: "Widget B" } });
      fireEvent.change(quantityInput, { target: { value: "3" } });

      const submitButton = screen.getByRole("button", { name: "Create" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateOrder).toHaveBeenCalledWith({
          customerName: "Jane Smith",
          item: "Widget B",
          quantity: 3,
          status: "pending",
        });
      });
    });
  });

  describe("EDIT MODE FUNCTIONALITY", () => {
    it("should load order data in edit mode", async () => {
      render(<OrderForm mode="edit" orderId="1" onClose={mockOnClose} />);

      await waitFor(() => {
        expect(mockGetOrder).toHaveBeenCalledWith("1");
      });

      // Wait for first field to load
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      });

      // Check other form fields are populated with order data
      expect(screen.getByDisplayValue("Widget A")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("pending")).toBeInTheDocument();
    });

    it("should show order ID as title in edit mode", async () => {
      render(<OrderForm mode="edit" orderId="1" onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText("1")).toBeInTheDocument();
      });
    });

    it("should call updateOrder when saving edited order", async () => {
      render(<OrderForm mode="edit" orderId="1" onClose={mockOnClose} />);

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      });

      const customerInput = screen.getByDisplayValue("John Doe");
      fireEvent.change(customerInput, { target: { value: "Jane Doe" } });

      const quantityInput = screen.getByDisplayValue("5");
      fireEvent.change(quantityInput, { target: { value: "10" } });

      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockPutOrder).toHaveBeenCalledWith("1", {
          customerName: "Jane Doe",
          item: "Widget A",
          quantity: 10,
          status: "pending",
        });
      });
    });

    it("should call onClose after successful update", async () => {
      render(<OrderForm mode="edit" orderId="1" onClose={mockOnClose} />);

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      });

      const customerInput = screen.getByDisplayValue("John Doe");
      fireEvent.change(customerInput, { target: { value: "Updated Name" } });

      const saveButton = screen.getByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("SHOW MODE FUNCTIONALITY", () => {
    it("should load and display order data in show mode", async () => {
      render(<OrderForm mode="show" orderId="1" onClose={mockOnClose} />);

      await waitFor(() => {
        expect(mockGetOrder).toHaveBeenCalledWith("1");
      });

      // Wait for data to load - in show mode, data is still displayed in input fields
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      });

      // Check other order information is displayed in input fields
      expect(screen.getByDisplayValue("Widget A")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("pending")).toBeInTheDocument();
    });

    it("should show order ID as title in show mode", async () => {
      render(<OrderForm mode="show" orderId="1" onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText("1")).toBeInTheDocument();
      });
    });

    it("should not show save/edit buttons in show mode", async () => {
      render(<OrderForm mode="show" orderId="1" onClose={mockOnClose} />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.queryByRole("button", { name: "Save" })).not.toBeInTheDocument();
      });

      expect(screen.queryByRole("button", { name: "Create" })).not.toBeInTheDocument();
    });
  });

  describe("FORM VALIDATION", () => {
    it("should validate required fields in create mode", async () => {
      render(<OrderForm mode="create" orderId={undefined} onClose={mockOnClose} />);

      // Clear the default values to test validation
      const inputs = screen.getAllByRole("textbox");
      const customerInput = inputs[0];
      const itemInput = inputs[1];

      fireEvent.change(customerInput, { target: { value: "" } });
      fireEvent.change(itemInput, { target: { value: "" } });

      // Try to submit without filling required fields
      const submitButton = screen.getByRole("button", { name: "Create" });
      fireEvent.click(submitButton);

      // Should show validation errors and not call createOrder
      await waitFor(() => {
        expect(mockCreateOrder).not.toHaveBeenCalled();
      });

      // Should show validation error message
      await waitFor(() => {
        expect(screen.getByText(/Too small.*characters/)).toBeInTheDocument();
      });
    });
  });

  describe("ERROR HANDLING", () => {
    it("should handle API errors during order loading", async () => {
      mockGetOrder.mockRejectedValue(new Error("Order not found"));

      render(<OrderForm mode="edit" orderId="1" onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText(/error.*loading|loading.*error|not.*found/i)).toBeInTheDocument();
      });
    });

    it("should handle API errors during order update", async () => {
      mockPutOrder.mockRejectedValue(new Error("Update failed"));

      render(<OrderForm mode="edit" orderId="1" onClose={mockOnClose} />);

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      });

      const customerInput = screen.getByDisplayValue("John Doe");
      fireEvent.change(customerInput, { target: { value: "Updated Name" } });

      const saveButton = screen.getByRole("button", { name: /save.*changes|update|save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/error.*saving|saving.*error|update.*failed/i)).toBeInTheDocument();
      });
    });

    it("should handle API errors during order creation", async () => {
      mockCreateOrder.mockRejectedValue(new Error("Creation failed"));

      render(<OrderForm mode="create" orderId={undefined} onClose={mockOnClose} />);

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByText("New Order")).toBeInTheDocument();
      });

      const inputs = screen.getAllByRole("textbox");
      const customerInput = inputs[0];
      const itemInput = inputs[1];
      const quantityInput = screen.getByRole("spinbutton");

      fireEvent.change(customerInput, { target: { value: "John Doe" } });
      fireEvent.change(itemInput, { target: { value: "Widget" } });
      fireEvent.change(quantityInput, { target: { value: "1" } });

      const submitButton = screen.getByRole("button", { name: "Create" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Creation failed|Request failed/i)).toBeInTheDocument();
      });
    });
  });

  describe("COMPLETE EDIT WORKFLOW", () => {
    it("should support complete edit workflow from load to save", async () => {
      render(<OrderForm mode="edit" orderId="1" onClose={mockOnClose} />);

      // 1. Load order data
      await waitFor(() => {
        expect(mockGetOrder).toHaveBeenCalledWith("1");
      });

      // 2. Verify data is loaded
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      });

      // 3. Edit multiple fields
      const customerInput = screen.getByDisplayValue("John Doe");
      const itemInput = screen.getByDisplayValue("Widget A");
      const quantityInput = screen.getByDisplayValue("5");
      const statusSelect = screen.getByDisplayValue("pending");

      fireEvent.change(customerInput, { target: { value: "Jane Doe" } });
      fireEvent.change(itemInput, { target: { value: "Widget B" } });
      fireEvent.change(quantityInput, { target: { value: "10" } });
      fireEvent.change(statusSelect, { target: { value: "completed" } });

      // 4. Save changes
      const saveButton = screen.getByRole("button", { name: /save.*changes|update|save/i });
      fireEvent.click(saveButton);

      // 5. Verify API call with updated data
      await waitFor(() => {
        expect(mockPutOrder).toHaveBeenCalledWith("1", {
          customerName: "Jane Doe",
          item: "Widget B",
          quantity: 10,
          status: "completed",
        });
      });

      // 6. Verify form closes
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });
  });
});
