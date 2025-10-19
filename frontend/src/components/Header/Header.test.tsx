import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";

describe("Header Component - CREATE NEW ORDER TESTS", () => {
  const mockSetEditingId = jest.fn();
  const mockSetMode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render header with title and description", () => {
    render(<Header setEditingId={mockSetEditingId} setMode={mockSetMode} />);

    expect(screen.getByText("Orders Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Overview of recent orders and quick actions")).toBeInTheDocument();
  });

  it('should render "New Order" button', () => {
    render(<Header setEditingId={mockSetEditingId} setMode={mockSetMode} />);

    const newOrderButton = screen.getByRole("button", { name: /new order/i });
    expect(newOrderButton).toBeInTheDocument();
  });

  it('should call setEditingId and setMode when "New Order" button is clicked', () => {
    render(<Header setEditingId={mockSetEditingId} setMode={mockSetMode} />);

    const newOrderButton = screen.getByRole("button", { name: /new order/i });
    fireEvent.click(newOrderButton);

    expect(mockSetEditingId).toHaveBeenCalledWith("1");
    expect(mockSetMode).toHaveBeenCalledWith("create");
  });

  it("should have proper styling classes for the new order button", () => {
    render(<Header setEditingId={mockSetEditingId} setMode={mockSetMode} />);

    const newOrderButton = screen.getByRole("button", { name: /new order/i });
    expect(newOrderButton).toHaveClass("bg-gradient-to-r", "from-blue-600", "to-indigo-600");
  });
});
