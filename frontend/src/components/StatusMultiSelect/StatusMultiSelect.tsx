import { useState, useRef, useEffect } from "react";
import { OrderStatus } from "../../api/orders";

interface StatusMultiSelectProps {
  selectedStatuses: OrderStatus[];
  onSelectionChange: (statuses: OrderStatus[]) => void;
}

const ALL_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function StatusMultiSelect({ selectedStatuses, onSelectionChange }: StatusMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusToggle = (status: OrderStatus) => {
    const isSelected = selectedStatuses.includes(status);
    if (isSelected) {
      onSelectionChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onSelectionChange([...selectedStatuses, status]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(ALL_STATUSES.map((s) => s.value));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const filteredStatuses = ALL_STATUSES.filter((status) =>
    status.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getDisplayText = () => {
    if (selectedStatuses.length === 0) {
      return "All Statuses";
    }
    if (selectedStatuses.length === ALL_STATUSES.length) {
      return "All Statuses";
    }
    if (selectedStatuses.length === 1) {
      const status = ALL_STATUSES.find((s) => s.value === selectedStatuses[0]);
      return status?.label || "";
    }
    return `${selectedStatuses.length} Selected`;
  };

  const getSelectedCount = () => {
    if (selectedStatuses.length === 0 || selectedStatuses.length === ALL_STATUSES.length) {
      return "";
    }
    return selectedStatuses.length;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearchTerm("");
          }
        }}
        className="flex items-center justify-between w-full min-w-[140px] px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">{getDisplayText()}</span>
          {getSelectedCount() && (
            <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
              {getSelectedCount()}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-[9999]">
          {/* Search box */}
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Select All / Clear All */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filteredStatuses.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No statuses found</div>
            ) : (
              filteredStatuses.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.includes(status.value)}
                    onChange={() => handleStatusToggle(status.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 capitalize font-normal">
                    {status.label}
                  </span>
                  {selectedStatuses.includes(status.value) && (
                    <svg
                      className="w-4 h-4 ml-auto text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusMultiSelect;
