import { CollectionReference, DocumentSnapshot, Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc } from "firebase/firestore";
import { Recipe, recipeSchema } from "../schemas/Recipe";
import { firestore } from "./app";

const RECIPE_COLLECTION_NAME = "recipes";

export interface PaginatedRecipes {
  recipes: Recipe[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
}

export class RecipeRepository {
  private firestore: Firestore;
  private recipesCollection: CollectionReference;

  constructor() {
    this.firestore = firestore;
    this.recipesCollection = collection(this.firestore, RECIPE_COLLECTION_NAME);
  }
  // CRUD operations
  async create(recipe: Recipe): Promise<string> { 
    try {
      recipe.createdAt = new Date().getTime();
      recipe.updatedAt = new Date().getTime();
      const docRef = await addDoc(this.recipesCollection, recipe);
      return docRef.id;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  async update(recipe: Recipe): Promise<void> {
    if (!recipe.id) {
      throw new Error("Recipe has no ID");
    }
    try {
      recipe.updatedAt = new Date().getTime();
      const docRef = doc(this.recipesCollection, recipe.id);
      if (!docRef) {
        throw new Error(`Recipe ${recipe.title} with id ${recipe.id} not found`);
      }
      await updateDoc(docRef, removeUndefined(recipe));
    } catch (error) {
      console.error(`Error updating recipe with id ${recipe.id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(this.recipesCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting recipe with id ${id}:`, error);
      throw error;
    }
  }

  async get(id: string): Promise<Recipe | null> {
    try {
      const docRef = doc(this.recipesCollection, id);
      const docSnap = await getDoc(docRef);
      const recipe = recipeSchema.parse({...docSnap.data(), id: docSnap.id}) as Recipe | null; 
      return recipe;
    } catch (error) {
      console.error(`Error getting recipe with id ${id}:`, error);
      throw error;
    }
  }

  async getAll(): Promise<Recipe[]> {
    try {
      const querySnapshot = await getDocs(this.recipesCollection);
      return querySnapshot.docs.map((doc) => {
        const recipe = doc.data() as Recipe;
        recipe.id = doc.id;
        return recipe;
      });
    } catch (error) {
      console.error('Error getting all recipes:', error);
      throw error;
    }
  }

  async getPaginated(pageSize: number = 10, lastDocSnapshot?: DocumentSnapshot): Promise<PaginatedRecipes> {
    try {
      // Create the base query with ordering and limit
      let q = query(
        this.recipesCollection,
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      // If we have a last document, start after it
      if (lastDocSnapshot) {
        q = query(q, startAfter(lastDocSnapshot));
      }

      const querySnapshot = await getDocs(q);
      
      // Get the recipes with their IDs
      const recipes = querySnapshot.docs.map((doc) => {
        const recipe = doc.data() as Recipe;
        recipe.id = doc.id;
        return recipe;
      });

      // Get the last document for next pagination
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      // Check if there are more documents
      const hasMore = querySnapshot.docs.length === pageSize;

      return {
        recipes,
        lastDoc,
        hasMore
      };
    } catch (error) {
      console.error('Error getting paginated recipes:', error);
      throw error;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)])
    );
  }
  return obj;
} 
