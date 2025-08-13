import { z } from 'zod';
import { Roast } from './Roast';

export const RECIPE_COLLECTION_NAME = "recipes";



// Schema for preparation details
export const recipePreparationSchema = z.object({ 
  notes: z.string().optional(),
});

export enum RecipeStepActionType {
  CENTER_POURING = "CENTER_POURING",
  CIRCLE_POURING = "CIRCLE_POURING",
  STIRRING = "STIRRING",
  WAITING = "WAITING",
}

// Schema for recipe actions
export const recipeActionSchema = z.object({ 
  action: z.nativeEnum(RecipeStepActionType).optional(),
  duration: z.number().min(0, "Target time cannot be negative").optional(),
  weight: z.number().positive("Target quantity must be positive").optional(),
});

// Schema for recipe steps
export const recipeStepSchema = z.object({
  name: z.string().min(1, "Step name is required"),
  actions: z.array(recipeActionSchema).min(1, "At least one action is required"), 
  instruction: z.string().optional(),
});

// Main recipe schema
export const recipeSchema = z.object({
  id: z.string().optional(),
  uid: z.string().min(1, "Author is required"),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  introduction: z.string().optional(),
  preparation: recipePreparationSchema,
  // Properties
  temperature: z.number().positive("Temperature must be positive").optional(),
  time: z.number().positive("Time must be positive").optional(),
  coffeeWeight: z.number().positive("Coffee weight must be positive").optional(),
  waterWeight: z.number().positive("Water weight must be positive").optional(),
  coffeeToWaterRatio: z.number().positive("Coffee to water ratio must be positive").optional(),
  roast: z.nativeEnum(Roast).optional(),
  grindSize: z.string().optional(),
  dripper: z.array(z.string()).optional(),
  filter: z.array(z.string()).optional(),
  // Tags 
  tags: z.array(z.string()).optional(),
  steps: z.array(recipeStepSchema).min(1, "At least one step is required"),
});

// Types inferred from schemas
export type Recipe = z.infer<typeof recipeSchema>;
export type Preparation = z.infer<typeof recipePreparationSchema>;
export type RecipeAction = z.infer<typeof recipeActionSchema>;
export type RecipeStep = z.infer<typeof recipeStepSchema>;

