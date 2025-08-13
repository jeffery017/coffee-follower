import RecipePlayPage from "@/ui/RecipePlay/RecipePlayPage";
import { RecipeRepository } from "@/utils/firebase/RecipeRepository";

type Props = {
    params: Promise<{ recipeId: string }>;
};
export default async function Page({ params }: Props) {
    const { recipeId } = await params;
    const recipeRepository = new RecipeRepository();
    const recipe = await recipeRepository.get(recipeId);
    if (!recipe) {
        return <div>Recipe not found</div>;
    }
    return (
        <div>
            <h1>Play</h1>
            <p>Recipe ID: {recipeId}</p>
            <RecipePlayPage recipe={recipe} />
        </div>
    );
}