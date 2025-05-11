import { RecipeRepository } from "@/utils/firebase/RecipeRepository";

type Props = {
    params: Promise<{ recipeId: string }>;
};

export default async function Page({ params }: Props) {
    const { recipeId } = await params;
    const recipeRepository = new RecipeRepository();
    const recipe = await recipeRepository.get(recipeId);
    return (
        <div>
            <h1>{recipe?.title}</h1>
            <h2>{recipe?.subtitle}</h2>
        </div>
    );
}