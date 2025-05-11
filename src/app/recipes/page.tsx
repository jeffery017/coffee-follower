'use client';

import { RecipeRepository } from "@/utils/firebase/RecipeRepository";
import { Recipe } from "@/utils/schemas/Recipe";
import { DocumentSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import RecipeCard from "./components/RecipeCard";

export default function Page() {
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
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Recipe
                </Link>
            </div>
            
            {/* Recipes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
}