import { render, screen, fireEvent } from "@testing-library/react";
import OrderTable from "./OrderTable";
import { PaginatedOrdersResponse } from "../../api/orders";

// Mock the Loading component
jest.mock("../Loading/Loading", () => {
  return function Loading() {
    return <div>Loading...</div>;
  };
});

// Mock the StatusBadge component
jest.mock("../StatusBadge/StatusBadge", () => {
  return function StatusBadge({ status }: { status: string }) {
    return <span data-testid={`status-${status}`}>{status}</span>;
  };
});

// Mock the StatusMultiSelect component
jest.mock("../StatusMultiSelect/StatusMultiSelect", () => {
  return function StatusMultiSelect({ selectedStatuses, onSelectionChange }: any) {
    return (
      <select data-testid="status-filter" onChange={(e) => onSelectionChange([e.target.value])}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    );
  };
});

describe("OrderTable Component - COMPREHENSIVE TESTS", () => {
  const mockOpenEdit = jest.fn();
  const mockConfirmDelete = jest.fn();
  const mockOnStatusFilterChange = jest.fn();

  const mockData: PaginatedOrdersResponse = {
    data: [
      {
        id: "1",
        customerName: "John Doe",
        item: "Widget A",
        quantity: 2,
        status: "pending",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "2",
        customerName: "Jane Smith",
        item: "Widget B",
        quantity: 1,
        status: "completed",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ],
    total: 2,
    filtered_count: 2,
    page: 1,
    page_size: 10,
    total_pending: 1,
    total_completed: 1,
    total_cancelled: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("BASIC RENDERING", () => {
    it("should show loading component when loading is true", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={true}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render order table with data when loading is false", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      // Check table headers are present
      expect(screen.getByText("Order ID")).toBeInTheDocument();
      expect(screen.getByText("Customer")).toBeInTheDocument();
      expect(screen.getByText("Item")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();

      // Check customer names are unique and present
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();

      // Check items are present
      expect(screen.getByText("Widget A")).toBeInTheDocument();
      expect(screen.getByText("Widget B")).toBeInTheDocument();

      // Check status badges are rendered
      expect(screen.getByTestId("status-pending")).toBeInTheDocument();
      expect(screen.getByTestId("status-completed")).toBeInTheDocument();
    });

    it("should render empty table when no data", () => {
      const emptyData: PaginatedOrdersResponse = {
        ...mockData,
        data: [],
        total: 0,
        filtered_count: 0,
      };

      render(
        <OrderTable
          data={emptyData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      // Table headers should still be there
      expect(screen.getByText("Order ID")).toBeInTheDocument();
      // But no order data
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  describe("SHOW ORDER FUNCTIONALITY", () => {
    it('should call openEdit with "show" mode when order ID is clicked', () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const orderIdLinks = screen.getAllByText("1");
      // Click the first one (which should be the clickable order ID)
      fireEvent.click(orderIdLinks[0]);

      expect(mockOpenEdit).toHaveBeenCalledWith("1", "show");
    });

    it("should make order IDs clickable for viewing details", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      // Both order IDs should be clickable
      const orderIdLinks = screen.getAllByText(/^[12]$/);
      expect(orderIdLinks.length).toBeGreaterThan(0);

      // Test that order IDs are clickable
      const firstOrderId = screen.getAllByText("1")[0];
      fireEvent.click(firstOrderId);
      expect(mockOpenEdit).toHaveBeenCalledWith("1", "show");
    });
  });

  describe("EDIT ORDER FUNCTIONALITY", () => {
    it("should render edit buttons for each order", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const editButtons = screen.getAllByTitle("Edit");
      expect(editButtons).toHaveLength(2); // One for each order
    });

    it('should call openEdit with "edit" mode when edit button is clicked', () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const editButtons = screen.getAllByTitle("Edit");
      fireEvent.click(editButtons[0]); // Click edit button for first order

      expect(mockOpenEdit).toHaveBeenCalledWith("1", "edit");
    });

    it("should trigger edit for correct order when multiple orders present", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const editButtons = screen.getAllByTitle("Edit");

      // Click edit on first order
      fireEvent.click(editButtons[0]);
      expect(mockOpenEdit).toHaveBeenCalledWith("1", "edit");

      // Click edit on second order
      fireEvent.click(editButtons[1]);
      expect(mockOpenEdit).toHaveBeenCalledWith("2", "edit");

      expect(mockOpenEdit).toHaveBeenCalledTimes(2);
    });

    it("should have correct edit button styling", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const editButtons = screen.getAllByTitle("Edit");
      editButtons.forEach((button) => {
        expect(button).toHaveClass("bg-white", "border", "text-gray-600");
      });
    });

    it("should not show edit buttons when no orders exist", () => {
      const emptyData: PaginatedOrdersResponse = {
        ...mockData,
        data: [],
        total: 0,
        filtered_count: 0,
      };

      render(
        <OrderTable
          data={emptyData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      expect(screen.queryByTitle("Edit")).not.toBeInTheDocument();
    });
  });

  describe("DELETE ORDER FUNCTIONALITY", () => {
    it("should render delete buttons for each order", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const deleteButtons = screen.getAllByTitle("Delete");
      expect(deleteButtons).toHaveLength(2); // One for each order
    });

    it("should call confirmDelete when delete button is clicked", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const deleteButtons = screen.getAllByTitle("Delete");
      fireEvent.click(deleteButtons[0]); // Click delete button for first order

      expect(mockConfirmDelete).toHaveBeenCalledWith("1");
    });

    it("should trigger delete confirmation for correct order ID", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const deleteButtons = screen.getAllByTitle("Delete");

      // Click delete on first order
      fireEvent.click(deleteButtons[0]);
      expect(mockConfirmDelete).toHaveBeenCalledWith("1");

      // Click delete on second order
      fireEvent.click(deleteButtons[1]);
      expect(mockConfirmDelete).toHaveBeenCalledWith("2");

      expect(mockConfirmDelete).toHaveBeenCalledTimes(2);
    });

    it("should have correct delete button styling (red background)", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      const deleteButtons = screen.getAllByTitle("Delete");
      deleteButtons.forEach((button) => {
        expect(button).toHaveClass("bg-red-600", "text-white");
      });
    });
  });

  describe("STATUS FILTER FUNCTIONALITY", () => {
    it("should render status filter component", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={["pending"]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      expect(screen.getByTestId("status-filter")).toBeInTheDocument();
    });
  });

  describe("COMPLETE CRUD WORKFLOW", () => {
    it("should support all CRUD operations through UI interactions", () => {
      render(
        <OrderTable
          data={mockData}
          openEdit={mockOpenEdit}
          confirmDelete={mockConfirmDelete}
          loading={false}
          selectedStatuses={[]}
          onStatusFilterChange={mockOnStatusFilterChange}
        />,
      );

      // READ - Order data is displayed
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();

      // SHOW - Click order ID to view details
      const orderIdLinks = screen.getAllByText("1");
      fireEvent.click(orderIdLinks[0]);
      expect(mockOpenEdit).toHaveBeenCalledWith("1", "show");

      // EDIT - Click edit button
      const editButtons = screen.getAllByTitle("Edit");
      fireEvent.click(editButtons[0]);
      expect(mockOpenEdit).toHaveBeenCalledWith("1", "edit");

      // DELETE - Click delete button
      const deleteButtons = screen.getAllByTitle("Delete");
      fireEvent.click(deleteButtons[0]);
      expect(mockConfirmDelete).toHaveBeenCalledWith("1");

      // Verify all interactions were called correctly
      expect(mockOpenEdit).toHaveBeenCalledTimes(2); // show + edit
      expect(mockConfirmDelete).toHaveBeenCalledTimes(1); // delete
    });
  });
});
