import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OrdersList from "./pages/OrdersList";
import OrderDetails from "./pages/OrderDetails";
import OrderForm from "./pages/OrderForm";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-5xl p-6">
          <Routes>
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/orders/new" element={<OrderForm mode="create" />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/orders/:id/edit" element={<OrderForm mode="edit" />} />
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
