import OrdersList from "./pages/OrdersList";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl p-6">
          <Routes>
            <Route path="/orders" element={<OrdersList />} />
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
