import { z } from "zod";

export const orderStatusEnum = z.enum(["pending", "completed", "cancelled"]);

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  item: z.string().min(1).max(100),
  quantity: z.number().int().min(1),
  status: orderStatusEnum,
});

export const putOrderSchema = createOrderSchema; // full replace

export const patchOrderSchema = z
  .object({
    customerName: z.string().trim().min(1).max(100).optional(),
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

export const filterSchema = z.object({
  status: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const statuses = val.split(",").map((s) => s.trim());
        return statuses.every((s) => ["pending", "completed", "cancelled"].includes(s));
      },
      { message: "Invalid status values. Must be: pending, completed, or cancelled" },
    ),
});

export const listOrdersQuerySchema = paginationSchema.merge(filterSchema);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type PutOrderInput = z.infer<typeof putOrderSchema>;
export type PatchOrderInput = z.infer<typeof patchOrderSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type FilterInput = z.infer<typeof filterSchema>;
export type ListOrdersQueryInput = z.infer<typeof listOrdersQuerySchema>;
