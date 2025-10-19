interface CardSectionProps {
  data: {
    total: number;
    total_pending: number;
    total_completed: number;
    total_cancelled: number;
  };
}

function CardSection({ data }: CardSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-normal font-bold text-gray-500">Total Orders</div>
        <div className="flex items-center justify-between">
          <div className="mt-2 rounded-full bg-blue-50 p-2 text-blue-600">
            <svg
              className="w-6 h-6 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h6M9 3v4a1 1 0 0 1-1 1H4m11 13a11.426 11.426 0 0 1-3.637-3.99A11.139 11.139 0 0 1 10 11.833L15 10l5 1.833a11.137 11.137 0 0 1-1.363 5.176A11.425 11.425 0 0 1 15.001 21Z"
              />
            </svg>
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600">{data.total}</div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-normal font-bold text-gray-500">Pending</div>
        <div className="flex items-center justify-between">
          <div className="mt-2 rounded-full bg-orange-50 p-2 text-orange-600">
            <svg
              className="w-6 h-6 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5.464V3.099m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C19 17.4 19 18 18.462 18H5.538C5 18 5 17.4 5 16.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.464ZM6 5 5 4M4 9H3m15-4 1-1m1 5h1M8.54 18a3.48 3.48 0 0 0 6.92 0H8.54Z"
              />
            </svg>
          </div>
          <div className="mt-2 text-2xl font-bold text-orange-600">{data.total_pending}</div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-normal font-bold text-gray-500">Completed</div>
        <div className="flex items-center justify-between">
          <div className="mt-2 rounded-full bg-green-50 p-2 text-green-600">
            <svg
              className="w-6 h-6 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <div className="mt-2 text-2xl font-bold text-green-600">{data.total_completed}</div>
        </div>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="text-normal font-bold text-gray-500">Cancelled</div>
        <div className="flex items-center justify-between">
          <div className="mt-2 rounded-full bg-red-50 p-2 text-red-600">
            <svg
              className="w-6 h-6 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <div className="mt-2 text-2xl font-bold text-red-600">{data.total_cancelled}</div>
        </div>
      </div>
    </div>
  );
}

export default CardSection;
