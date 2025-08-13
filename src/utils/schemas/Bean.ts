import { z } from "zod";

export const beanSchema = z.object({
  id: z.string().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  brand: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  roast: z.string().optional(),
  origin: z.string().optional(),
  processing: z.string().optional(),
  elevation: z.number().optional(),
  notes: z.string().optional(), 
});

export type Bean = z.infer<typeof beanSchema>;