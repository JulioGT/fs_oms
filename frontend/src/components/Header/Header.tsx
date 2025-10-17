interface HeaderProps {
  setEditingId: (value: string) => void;
  setMode: (value: "create") => void;
}

function Header({ setEditingId, setMode }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Orders Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of recent orders and quick actions</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setEditingId("1");
            setMode("create");
          }}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-white shadow-lg hover:opacity-95 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Order
        </button>
      </div>
    </div>
  );
}

export default Header;
