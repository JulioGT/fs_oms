import { deleteOrder } from "./orders";
import api from "./client";

// Mock the API client
jest.mock("./client", () => ({
  delete: jest.fn(),
}));

const mockApi = api as jest.Mocked<typeof api>;

describe("Orders API - DELETE & DESTROY TESTS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("DELETE ORDER API", () => {
    it("should call DELETE endpoint with correct order ID", async () => {
      const orderId = "order-123";
      mockApi.delete.mockResolvedValue(undefined);

      await deleteOrder(orderId);

      expect(mockApi.delete).toHaveBeenCalledWith("/orders/order-123");
      expect(mockApi.delete).toHaveBeenCalledTimes(1);
    });

    it("should handle successful deletion (204 No Content)", async () => {
      const orderId = "order-456";
      mockApi.delete.mockResolvedValue(undefined);

      await expect(deleteOrder(orderId)).resolves.toBeUndefined();
      expect(mockApi.delete).toHaveBeenCalledWith("/orders/order-456");
    });

    it("should throw error when delete fails (404 Not Found)", async () => {
      const orderId = "non-existent-order";
      const deleteError = new Error("Order not found");
      mockApi.delete.mockRejectedValue(deleteError);

      await expect(deleteOrder(orderId)).rejects.toThrow("Order not found");
      expect(mockApi.delete).toHaveBeenCalledWith("/orders/non-existent-order");
    });

    it("should throw error when delete fails (500 Server Error)", async () => {
      const orderId = "order-789";
      const serverError = new Error("Internal server error");
      mockApi.delete.mockRejectedValue(serverError);

      await expect(deleteOrder(orderId)).rejects.toThrow("Internal server error");
    });

    it("should handle network errors during deletion", async () => {
      const orderId = "order-network-fail";
      const networkError = new Error("Network Error");
      mockApi.delete.mockRejectedValue(networkError);

      await expect(deleteOrder(orderId)).rejects.toThrow("Network Error");
      expect(mockApi.delete).toHaveBeenCalledWith("/orders/order-network-fail");
    });

    it("should work with UUID format order IDs", async () => {
      const uuidOrderId = "550e8400-e29b-41d4-a716-446655440000";
      mockApi.delete.mockResolvedValue(undefined);

      await deleteOrder(uuidOrderId);

      expect(mockApi.delete).toHaveBeenCalledWith("/orders/550e8400-e29b-41d4-a716-446655440000");
    });

    it("should work with string format order IDs", async () => {
      const stringOrderId = "ORD-2024-001";
      mockApi.delete.mockResolvedValue(undefined);

      await deleteOrder(stringOrderId);

      expect(mockApi.delete).toHaveBeenCalledWith("/orders/ORD-2024-001");
    });
  });

  describe("DELETE API ERROR SCENARIOS", () => {
    it("should handle authorization errors", async () => {
      const orderId = "protected-order";
      const authError = new Error("Unauthorized");
      mockApi.delete.mockRejectedValue(authError);

      await expect(deleteOrder(orderId)).rejects.toThrow("Unauthorized");
    });

    it("should handle already deleted order (soft delete scenario)", async () => {
      const orderId = "already-deleted-order";
      const alreadyDeletedError = new Error("Order already deleted");
      mockApi.delete.mockRejectedValue(alreadyDeletedError);

      await expect(deleteOrder(orderId)).rejects.toThrow("Order already deleted");
    });

    it("should handle timeout errors", async () => {
      const orderId = "timeout-order";
      const timeoutError = new Error("Request timeout");
      mockApi.delete.mockRejectedValue(timeoutError);

      await expect(deleteOrder(orderId)).rejects.toThrow("Request timeout");
    });
  });
});
