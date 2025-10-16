import { randomUUID } from "crypto";
import { Router, Request, Response } from "express";
import Order from "../models/order";
import { validateBody, validateQuery } from "../middlewares/validate";
import {
  createOrderSchema,
  putOrderSchema,
  patchOrderSchema,
  paginationSchema,
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

// List with pagination
router.get("/", validateQuery(paginationSchema), async (req: Request, res: Response) => {
  const { page, page_size } = (res.locals.query || {}) as {
    page: number;
    page_size: number;
  };
  const limit = Number(page_size);
  const offset = (Number(page) - 1) * limit;

  const { rows, count } = await Order.findAndCountAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
    paranoid: true, // exclude soft-deleted
  });

  return res.json({
    data: rows,
    total: count,
    page: Number(page),
    page_size: limit,
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
