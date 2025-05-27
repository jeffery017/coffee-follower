'use client';
import { RecipeRepository } from "@/utils/firebase/RecipeRepository";
import { Recipe } from "@/utils/schemas/Recipe";
import { DocumentSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import RecipeCardEntity from "./RecipeCard";

export default function RecipeList() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const recipeRepository = new RecipeRepository();

    const loadRecipes = async (lastDocSnapshot?: DocumentSnapshot) => {
        try {
            setIsLoading(true);
            const result = await recipeRepository.getPaginated(6, lastDocSnapshot);
            setRecipes(prev => lastDocSnapshot ? [...prev, ...result.recipes] : result.recipes);
            setLastDoc(result.lastDoc);
            setHasMore(result.hasMore);
        } catch (error) {
            console.error('Error loading recipes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    const handleLoadMore = () => {
        if (lastDoc && hasMore) {
            loadRecipes(lastDoc);
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header with Create Button */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Coffee Recipes</h1>
                <Link 
                    href="/recipes/create"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white border bg-primary hover:bg-primary/80"
                >
                    Create Recipe
                </Link>
            </div>
            
            {/* Recipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                    <Link href={`/recipes/${recipe.id}`} key={recipe.id}>
                        <RecipeCardEntity recipe={recipe} />
                    </Link>
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
}