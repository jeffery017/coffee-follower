'use client';

import CreateRecipeForm from "../components/CreateRecipeForm";

export default function CreateRecipePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Create New Recipe</h1>
                <CreateRecipeForm />
            </div>
        </div>
    );
} 