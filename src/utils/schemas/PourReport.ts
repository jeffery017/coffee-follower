import { z } from "zod";

export const pourReportSchema = z.object({
  id: z.string().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  recipeId: z.string().optional(),
  dripperId: z.string().optional(),
  filterId: z.string().optional(),
  beanId: z.string().optional(),
});

export type PourReport = z.infer<typeof pourReportSchema>;