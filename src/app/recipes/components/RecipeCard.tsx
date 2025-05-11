import { Recipe } from '@/utils/schemas/Recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium text-gray-900">{recipe.title}</h3>
      {recipe.subtitle && (
        <p className="text-sm text-gray-500 mt-1">{recipe.subtitle}</p>
      )}
      {recipe.description && (
        <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {recipe.roast && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {recipe.roast}
          </span>
        )}
        {recipe.dripper && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {recipe.dripper}
          </span>
        )}
        {recipe.tags?.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-500">
        {new Date(recipe.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
} 