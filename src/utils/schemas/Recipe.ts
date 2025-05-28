import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export const RECIPE_COLLECTION_NAME = "recipes";

export enum Roast {
  LIGHT = "LIGHT",
  MEDIUM = "MEDIUM",
  DARK = "DARK",
}


// Schema for preparation details
export const preparationSchema = z.object({ 
  notes: z.string().optional(),
});

export enum stepActionType {
  CENTER_POURING = "CENTER_POURING",
  CIRCLE_POURING = "CIRCLE_POURING",
  STIRRING = "STIRRING",
  WAITING = "WAITING",
}

// Schema for recipe actions
export const actionSchema = z.object({ 
  action: z.nativeEnum(stepActionType).optional(),
  targetTime: z.number().min(0, "Target time cannot be negative").optional(),
  targetGram: z.number().positive("Target quantity must be positive").optional(),
});

// Schema for recipe steps
export const stepSchema = z.object({
  name: z.string().min(1, "Step name is required"),
  actions: z.array(actionSchema).min(1, "At least one action is required"), 
  instruction: z.string().optional(),
});

// Main recipe schema
export const recipeSchema = z.object({
  id: z.string().optional(),
  uid: z.string().min(1, "Author is required"),
  createdAt: z.instanceof(Timestamp).optional(),
  updatedAt: z.instanceof(Timestamp).optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  introduction: z.string().optional(),
  preparation: preparationSchema,
  // Properties
  temperature: z.number().positive("Temperature must be positive").optional(),
  time: z.number().positive("Time must be positive").optional(),
  coffeeWeight: z.number().positive("Coffee weight must be positive").optional(),
  waterWeight: z.number().positive("Water weight must be positive").optional(),
  coffeeToWaterRatio: z.number().positive("Coffee to water ratio must be positive").optional(),
  roast: z.nativeEnum(Roast).optional(),
  grindSize: z.string().optional(),
  dripper: z.string().optional(),
  filter: z.string().optional(),
  // Tags 
  flavors: z.array(z.string()).optional(),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
});

// Types inferred from schemas
export type Recipe = z.infer<typeof recipeSchema>;
export type Preparation = z.infer<typeof preparationSchema>;
export type RecipeAction = z.infer<typeof actionSchema>;
export type RecipeStep = z.infer<typeof stepSchema>;

