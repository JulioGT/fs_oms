import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component - SIMPLE TESTS", () => {
  const mockSetPage = jest.fn();

  beforeEach(() => {
    mockSetPage.mockClear();
  });

  it("should render current page and total pages", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={true} canNext={true} page={3} totalPages={10} />,
    );

    expect(screen.getByText("Page 3 of 10")).toBeInTheDocument();
  });

  it("should disable previous buttons when canPrev is false", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={false} canNext={true} page={1} totalPages={10} />,
    );

    const firstButton = screen.getByLabelText("First page");
    const prevButton = screen.getByLabelText("Previous page");

    expect(firstButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
  });

  it("should disable next buttons when canNext is false", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={true} canNext={false} page={10} totalPages={10} />,
    );

    const nextButton = screen.getByLabelText("Next page");
    const lastButton = screen.getByLabelText("Last page");

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  it("should call setPage with 1 when first button is clicked", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={true} canNext={true} page={5} totalPages={10} />,
    );

    const firstButton = screen.getByLabelText("First page");
    fireEvent.click(firstButton);

    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it("should call setPage with totalPages when last button is clicked", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={true} canNext={true} page={5} totalPages={10} />,
    );

    const lastButton = screen.getByLabelText("Last page");
    fireEvent.click(lastButton);

    expect(mockSetPage).toHaveBeenCalledWith(10);
  });

  it("should call setPage with function when previous button is clicked", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={true} canNext={true} page={5} totalPages={10} />,
    );

    const prevButton = screen.getByLabelText("Previous page");
    fireEvent.click(prevButton);

    expect(mockSetPage).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should call setPage with function when next button is clicked", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={true} canNext={true} page={5} totalPages={10} />,
    );

    const nextButton = screen.getByLabelText("Next page");
    fireEvent.click(nextButton);

    expect(mockSetPage).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should show page 1 of 1 when there is only one page", () => {
    render(
      <Pagination setPage={mockSetPage} canPrev={false} canNext={false} page={1} totalPages={1} />,
    );

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });
});
