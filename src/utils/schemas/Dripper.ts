import { z } from "zod";

export const dripperSchema = z.object({
  id: z.string().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
});

export type Dripper = z.infer<typeof dripperSchema>;