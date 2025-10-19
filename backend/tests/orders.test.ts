import request from "supertest";
import express from "express";
import cors from "cors";
import { errorHandler } from "../src/middlewares/errorHandler";
import ordersRouter from "../src/routes/orders";
import { Order } from "../src/models/order";
import { sequelize } from "../src/db";

const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/orders", ordersRouter);
  app.use(errorHandler);
  return app;
};

describe("Orders API - REAL INTEGRATION TESTS", () => {
  let app: express.Application;
  let testOrderIds: string[] = [];

  beforeAll(async () => {
    await sequelize.authenticate();
    app = createTestApp();
  });

  beforeEach(async () => {
    if (testOrderIds.length > 0) {
      await Order.destroy({ where: { id: testOrderIds }, force: true });
      testOrderIds = [];
    }
  });

  afterEach(async () => {
    if (testOrderIds.length > 0) {
      await Order.destroy({ where: { id: testOrderIds }, force: true });
      testOrderIds = [];
    }
  });

  describe("GET /orders", () => {
    beforeEach(async () => {
      const { randomUUID } = require("crypto");
      const testOrders = await Order.bulkCreate([
        {
          id: randomUUID(),
          customerName: "John Doe",
          item: "Widget A",
          quantity: 2,
          status: "pending",
        },
        {
          id: randomUUID(),
          customerName: "Jane Smith",
          item: "Widget B",
          quantity: 1,
          status: "completed",
        },
        {
          id: randomUUID(),
          customerName: "Bob Johnson",
          item: "Widget C",
          quantity: 3,
          status: "cancelled",
        },
        {
          id: randomUUID(),
          customerName: "Alice Brown",
          item: "Widget D",
          quantity: 1,
          status: "pending",
        },
        {
          id: randomUUID(),
          customerName: "Charlie Wilson",
          item: "Widget E",
          quantity: 5,
          status: "completed",
        },
      ]);

      testOrderIds = testOrders.map((order) => order.id);
    });

    it("should return all orders with pagination", async () => {
      const response = await request(app).get("/orders").expect(200);

      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("filtered_count");
      expect(response.body).toHaveProperty("page");
      expect(response.body).toHaveProperty("page_size");
      expect(response.body).toHaveProperty("total_cancelled");
      expect(response.body).toHaveProperty("total_completed");
      expect(response.body).toHaveProperty("total_pending");

      expect(response.body.data.length).toBeGreaterThanOrEqual(5);
      expect(response.body.total).toBeGreaterThanOrEqual(105);
      expect(response.body.filtered_count).toBeGreaterThanOrEqual(105);
      expect(response.body.page).toBe(1);
      expect(response.body.page_size).toBe(10);

      const testCustomers = [
        "John Doe",
        "Jane Smith",
        "Bob Johnson",
        "Alice Brown",
        "Charlie Wilson",
      ];
      const returnedCustomers = response.body.data.map((order: any) => order.customerName);
      const hasTestData = testCustomers.some((customer) => returnedCustomers.includes(customer));
      expect(hasTestData).toBe(true);
    });

    it("should handle pagination correctly", async () => {
      const response = await request(app).get("/orders?page=1&page_size=2").expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBeGreaterThanOrEqual(105);
      expect(response.body.filtered_count).toBeGreaterThanOrEqual(105);
      expect(response.body.page).toBe(1);
      expect(response.body.page_size).toBe(2);
    });

    it("should filter by single status", async () => {
      const response = await request(app).get("/orders?status=pending").expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.data.every((order: any) => order.status === "pending")).toBe(true);
      expect(response.body.filtered_count).toBeGreaterThanOrEqual(2);
      expect(response.body.total).toBeGreaterThanOrEqual(105);

      const pendingOrders = response.body.data;
      const testPendingCustomers = ["John Doe", "Alice Brown"];
      const returnedCustomers = pendingOrders.map((order: any) => order.customerName);
      const hasTestData = testPendingCustomers.some((customer) =>
        returnedCustomers.includes(customer),
      );
      expect(hasTestData).toBe(true);
    });

    it("should filter by multiple statuses", async () => {
      const response = await request(app).get("/orders?status=pending,completed").expect(200);

      expect(response.body.data.length).toBeGreaterThanOrEqual(4);
      expect(response.body.filtered_count).toBeGreaterThanOrEqual(4);
      expect(response.body.total).toBeGreaterThanOrEqual(105);

      const validStatuses = ["pending", "completed"];
      expect(response.body.data.every((order: any) => validStatuses.includes(order.status))).toBe(
        true,
      );
    });

    it("should return correct status counts", async () => {
      const response = await request(app).get("/orders").expect(200);

      expect(response.body.total_pending).toBeGreaterThanOrEqual(2);
      expect(response.body.total_completed).toBeGreaterThanOrEqual(2);
      expect(response.body.total_cancelled).toBeGreaterThanOrEqual(1);

      const totalFromCounts =
        response.body.total_pending + response.body.total_completed + response.body.total_cancelled;
      expect(totalFromCounts).toBe(response.body.total);
    });

    it("should handle invalid status gracefully", async () => {
      const response = await request(app).get("/orders?status=invalid").expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should handle invalid pagination parameters", async () => {
      const response = await request(app).get("/orders?page=-1&page_size=0").expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /orders", () => {
    it("should create a new order with valid data", async () => {
      const orderData = {
        customerName: "Test Customer",
        item: "Test Widget",
        quantity: 2,
        status: "pending",
      };

      const response = await request(app).post("/orders").send(orderData).expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.customerName).toBe(orderData.customerName);
      expect(response.body.item).toBe(orderData.item);
      expect(response.body.quantity).toBe(orderData.quantity);
      expect(response.body.status).toBe(orderData.status);

      testOrderIds.push(response.body.id);
    });

    it("should reject order with missing required fields", async () => {
      const invalidData = {
        customerName: "Test Customer",
      };

      const response = await request(app).post("/orders").send(invalidData).expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should reject order with invalid status", async () => {
      const invalidData = {
        customerName: "Test Customer",
        item: "Test Widget",
        quantity: 1,
        status: "invalid_status",
      };

      const response = await request(app).post("/orders").send(invalidData).expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should reject order with negative quantity", async () => {
      const invalidData = {
        customerName: "Test Customer",
        item: "Test Widget",
        quantity: -1,
        status: "pending",
      };

      const response = await request(app).post("/orders").send(invalidData).expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /orders/:id", () => {
    let orderId: string;

    beforeEach(async () => {
      const { randomUUID } = require("crypto");
      const order = await Order.create({
        id: randomUUID(),
        customerName: "Original Customer",
        item: "Original Widget",
        quantity: 1,
        status: "pending",
      });
      orderId = order.id;
      testOrderIds.push(orderId);
    });

    it("should update an existing order", async () => {
      const updateData = {
        customerName: "Updated Customer",
        item: "Updated Widget",
        quantity: 3,
        status: "completed",
      };

      const response = await request(app).put(`/orders/${orderId}`).send(updateData).expect(200);

      expect(response.body.customerName).toBe(updateData.customerName);
      expect(response.body.item).toBe(updateData.item);
      expect(response.body.quantity).toBe(updateData.quantity);
      expect(response.body.status).toBe(updateData.status);
    });

    it("should return 404 for non-existent order", async () => {
      const fakeId = "123e4567-e89b-12d3-a456-426614174000";
      const updateData = {
        customerName: "Updated Customer",
        item: "Updated Widget",
        quantity: 2,
        status: "completed",
      };

      const response = await request(app).put(`/orders/${fakeId}`).send(updateData).expect(404);

      expect(response.body).toHaveProperty("error");
    });

    it("should reject update with invalid data", async () => {
      const invalidData = {
        customerName: "",
        item: "",
        quantity: -1,
        status: "invalid_status",
      };

      const response = await request(app).put(`/orders/${orderId}`).send(invalidData).expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /orders/:id", () => {
    let orderId: string;

    beforeEach(async () => {
      const { randomUUID } = require("crypto");
      const order = await Order.create({
        id: randomUUID(),
        customerName: "To Be Deleted",
        item: "Delete Widget",
        quantity: 1,
        status: "pending",
      });
      orderId = order.id;
      testOrderIds.push(orderId);
    });

    it("should soft delete an existing order", async () => {
      const response = await request(app).delete(`/orders/${orderId}`).expect(204);

      expect(response.body).toEqual({});

      const getResponse = await request(app).get(`/orders/${orderId}`).expect(404);
      expect(getResponse.body).toHaveProperty("error");
    });

    it("should return 404 for non-existent order", async () => {
      const fakeId = "123e4567-e89b-12d3-a456-426614174000";

      const response = await request(app).delete(`/orders/${fakeId}`).expect(404);

      expect(response.body).toHaveProperty("error");
    });

    it("should return 404 when trying to delete already deleted order", async () => {
      await request(app).delete(`/orders/${orderId}`).expect(204);

      const response = await request(app).delete(`/orders/${orderId}`).expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });
});
