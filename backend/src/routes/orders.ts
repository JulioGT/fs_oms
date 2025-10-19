import { randomUUID } from "crypto";
import { Router, Request, Response } from "express";
import { QueryTypes } from "sequelize";
import Order from "../models/order";
import sequelize from "../db";
import { validateBody, validateQuery } from "../middlewares/validate";
import {
  createOrderSchema,
  putOrderSchema,
  patchOrderSchema,
  listOrdersQuerySchema,
} from "../validation/orderSchemas";

const router = Router();

// Create
router.post("/", validateBody(createOrderSchema), async (req: Request, res: Response) => {
  const { customerName, item, quantity, status } = req.body;
  const order = await Order.create({
    id: randomUUID(),
    customerName,
    item,
    quantity,
    status,
  });
  return res.status(201).json(order);
});

// Get by id
router.get("/:id", async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: { message: "Order not found" } });
  return res.json(order);
});

router.get("/", validateQuery(listOrdersQuerySchema), async (req: Request, res: Response) => {
  const { page, page_size, status } = (res.locals.query || {}) as {
    page: number;
    page_size: number;
    status?: string;
  };
  const limit = Number(page_size);
  const offset = (Number(page) - 1) * limit;

  const whereClause: Record<string, unknown> = {};
  if (status) {
    const statusArray = status.split(",").map((s) => s.trim());
    whereClause.status = statusArray;
  }

  const { rows, count } = await Order.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [["created_at", "DESC"]],
    paranoid: true,
  });

  // Get total counts efficiently with a single query
  const statusCountsQuery = `
    SELECT 
      status,
      COUNT(*) as count
    FROM orders 
    WHERE deleted_at IS NULL 
    GROUP BY status
  `;

  const statusCounts = (await sequelize.query(statusCountsQuery, {
    type: QueryTypes.SELECT,
  })) as Array<{ status: string; count: string }>;

  let totalCancelled = 0;
  let totalCompleted = 0;
  let totalPending = 0;

  statusCounts.forEach((item) => {
    const count = parseInt(item.count, 10);
    switch (item.status) {
      case "cancelled":
        totalCancelled = count;
        break;
      case "completed":
        totalCompleted = count;
        break;
      case "pending":
        totalPending = count;
        break;
    }
  });

  const totalOrders = totalCancelled + totalCompleted + totalPending;

  return res.json({
    data: rows,
    total: totalOrders,
    filtered_count: count,
    page: Number(page),
    page_size: limit,
    total_cancelled: totalCancelled,
    total_completed: totalCompleted,
    total_pending: totalPending,
  });
});

// Full replace
router.put("/:id", validateBody(putOrderSchema), async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: { message: "Order not found" } });
  const { customerName, item, quantity, status } = req.body;
  await order.update({ customerName, item, quantity, status });
  return res.json(order);
});

// Partial update
router.patch("/:id", validateBody(patchOrderSchema), async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: { message: "Order not found" } });
  await order.update(req.body);
  return res.json(order);
});

// Soft delete
router.delete("/:id", async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: { message: "Order not found" } });
  await order.destroy();
  return res.status(204).send();
});

export default router;
