import { Recipe, Roast } from '@/utils/schemas/Recipe';

interface Props {
  recipe: Recipe;
}

const RoastDisplayNames = {
  [Roast.LIGHT]: 'Light Roast',
  [Roast.MEDIUM]: 'Medium Roast',
  [Roast.DARK]: 'Dark Roast',
}

export default function RecipeCardEntity({ recipe }: Props) {
  return (
    <div className="max-w-64 aspect-square flex flex-col justify-between bg-card shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium text-gray-900">{recipe.title}</h3>
      {recipe.subtitle && (
        <p className="text-sm text-gray-500 mt-1">{recipe.subtitle}</p>
      )} 
      <div className='grow'></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {recipe.roast && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {RoastDisplayNames[recipe.roast]}
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
    </div>
  );
} 