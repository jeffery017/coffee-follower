import { z } from 'zod';

export const RECIPE_COLLECTION_NAME = "recipes";

export enum Roast {
  "LIGHT",
  "MEDIUM",
  "DARK",
}

// Schema for preparation details
export const preparationSchema = z.object({ 
  notes: z.string().optional(),
});

export enum stepActionType {
  CENTER_POURING = "CENTER_POURING",
  SIDE_POURING = "SIDE_POURING",
  STIRRING = "STIRRING",
  WAITING = "WAITING",
}

// Schema for recipe steps
export const actionSchema = z.object({ 
  action: z.nativeEnum(stepActionType).optional(),
  instruction: z.string().optional(),
  duration: z.number().min(0, "Duration cannot be negative").optional(),
  imageUrl: z.string().url().optional(),
  targetQuantity: z.number().positive("Target quantity must be positive").optional(),
});

const stepSchema = z.object({
  actions: z.array(actionSchema).min(1, "At least one action is required"),
});

// Main recipe schema
export const recipeSchema = z.object({
  id: z.string().optional(),
  uid: z.string().min(1, "Author is required"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  roast: z.nativeEnum(Roast).optional(),
  dripper: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  preparation: preparationSchema,
  steps: z.array(stepSchema).min(1, "At least one step is required"),
});

// Types inferred from schemas
export type Recipe = z.infer<typeof recipeSchema>;
export type Preparation = z.infer<typeof preparationSchema>;
export type Step = z.infer<typeof stepSchema>;
export type RecipeAction = z.infer<typeof actionSchema>;

