import { z } from "zod";

export const orderStatusEnum = z.enum(["pending", "completed", "cancelled"]);

export const createOrderSchema = z.object({
  customerName: z.string().min(1).max(100),
  item: z.string().min(1).max(100),
  quantity: z.number().int().min(1),
  status: orderStatusEnum,
});

export const putOrderSchema = createOrderSchema; // full replace

export const patchOrderSchema = z
  .object({
    customerName: z.string().min(1).max(100).optional(),
    item: z.string().min(1).max(100).optional(),
    quantity: z.number().int().min(1).optional(),
    status: orderStatusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Body must include at least one updatable field",
  });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type PutOrderInput = z.infer<typeof putOrderSchema>;
export type PatchOrderInput = z.infer<typeof patchOrderSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
