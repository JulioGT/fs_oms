interface PaginationProps {
  setPage: (value: number | ((prev: number) => number)) => void;
  canPrev: boolean;
  canNext: boolean;
  page: number;
  totalPages: number;
}

function Pagination({ setPage, canPrev, canNext, page, totalPages }: PaginationProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex items-center gap-4 bg-blue-50 px-4 py-2 rounded-md">
        <div className="flex items-center gap-2">
          <button
            aria-label="First page"
            title="First"
            onClick={() => setPage(1)}
            disabled={!canPrev}
            className="inline-flex items-center justify-center rounded border bg-white px-3 py-1 text-sm text-blue-600 font-semibold disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M11 17l-5-5 5-5" />
              <path d="M18 17l-5-5 5-5" />
            </svg>
          </button>
          <button
            aria-label="Previous page"
            title="Previous"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
            className="inline-flex items-center justify-center rounded border bg-white px-3 py-1 text-sm text-blue-600 font-semibold disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="text-sm text-blue-600 font-bold">
          Page {page} of {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Next page"
            title="Next"
            onClick={() => setPage((p) => (canNext ? p + 1 : p))}
            disabled={!canNext}
            className="inline-flex items-center justify-center rounded border bg-white px-3 py-1 text-sm text-blue-600 font-semibold disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            aria-label="Last page"
            title="Last"
            onClick={() => setPage(totalPages)}
            disabled={!canNext}
            className="inline-flex items-center justify-center rounded border bg-white px-3 py-1 text-sm text-blue-600 font-semibold disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M6 17l5-5-5-5" />
              <path d="M13 17l5-5-5-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
