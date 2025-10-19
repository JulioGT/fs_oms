import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";

describe("StatusBadge Component - SIMPLE TESTS", () => {
  it("should render completed status with correct styling", () => {
    render(<StatusBadge status="completed" />);

    const badge = screen.getByText("completed");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-green-50", "text-green-800", "border-green-100");
  });

  it("should render cancelled status with correct styling", () => {
    render(<StatusBadge status="cancelled" />);

    const badge = screen.getByText("cancelled");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-50", "text-red-800", "border-red-100");
  });

  it("should render pending status with correct styling", () => {
    render(<StatusBadge status="pending" />);

    const badge = screen.getByText("pending");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-orange-50", "text-orange-800", "border-orange-100");
  });

  it("should have common base classes for all statuses", () => {
    render(<StatusBadge status="completed" />);

    const badge = screen.getByText("completed");
    expect(badge).toHaveClass(
      "inline-flex",
      "items-center",
      "rounded-full",
      "px-2",
      "py-0.5",
      "text-xs",
      "font-semibold",
      "capitalize",
    );
  });
});
