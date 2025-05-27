'use client';

import { RecipeRepository } from '@/utils/firebase/RecipeRepository';
import { Recipe, recipeSchema, RecipeStep, Roast } from '@/utils/schemas/Recipe';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PlusButton from '../common/PlusButton';
import RecipeStepEntity from './components/RecipeStepEntity';


interface Props {
  recipeId?: string;
  editMode: boolean;
}

export default function RecipeSettings({ recipeId, editMode = false }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [steps, setSteps] = useState<RecipeStep[]>([ ]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(!!recipeId);

  useEffect(() => {
    if (recipeId) {
      setLoading(true);
      const repo = new RecipeRepository();
      repo.get(recipeId)
        .then((data) => {
          setRecipe(data);
          setSteps(data?.steps || []);
        })
        .finally(() => setLoading(false));
    }
    else {
      setSteps([
        {
          name: "Step 1",
          instruction: "",
          actions: [{}]
        }
      ]);
    }
  }, [recipeId]);

  const addStep = () => {
    const newStep: RecipeStep = {
      name: `Step ${steps.length + 1}`,
      instruction: "",
      actions: [{}]
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (stepIndex: number, updatedStep: RecipeStep) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = updatedStep;
    setSteps(newSteps);
  };

  const removeStep = (stepIndex: number) => {
    if (steps.length === 1) return; // Don't remove the last step
    const newSteps = [...steps];
    newSteps.splice(stepIndex, 1);
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const recipeData = recipeSchema.parse({
        ...(recipe && recipe.id ? { id: recipe.id } : {}),
        uid: 'user123', // TODO: Replace with actual user ID
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string || '',
        description: formData.get('description') as string || '',
        roast: formData.get('roast') ? Roast[formData.get('roast') as keyof typeof Roast] : undefined,
        dripper: formData.get('dripper') as string || '',
        preparation: { notes: '' },
        steps: steps.map(step => ({
          name: step.name,
          instruction: step.instruction || '',
          actions: step.actions.map(action => ({
            action: action.action,
            targetTime: action.targetTime,
            targetGram: action.targetGram, 
          })).filter(action => action.action !== undefined),
        }))
      });

      const validatedData = recipeSchema.parse(recipeData);
      const recipeRepository = new RecipeRepository();

      if (recipe && recipe.id) {
        await recipeRepository.update(validatedData);
      } else {
        await recipeRepository.create(validatedData);
      }
      router.refresh();
      router.push('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe?.id) return;
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      const repo = new RecipeRepository();
      await repo.delete(recipe.id);
      router.push('/recipes');
    } catch (error) {
      alert('Failed to delete recipe.');
      console.error(error);
    }
  };

  const submitButton = (
    <button
      type="submit"
      disabled={isSubmitting}
      className="justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-background shadow-sm  disabled:opacity-50"
    >
      {isSubmitting
        ? (recipeId ? 'Updating...' : 'Creating...')
        : (recipeId ? 'Update Recipe' : 'Create Recipe')}
    </button>
  )

  if (loading) {
    return <div className='w-full h-full flex items-center justify-center'>Loading...</div>;
  }

  return (
    <div className='container mx-auto' > 
      <div className='flex items-center justify-between px-4 py-4'>
      {/* Title */}
        <h2 className="text-xl font-semibold">Recipe Information</h2>
        {/* Save Recipe Button */}
        {submitButton}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 w-full space-y-8 grid grid-cols-1 lg:grid-cols-2">
        
        {/* Basic Info Section */}
        <div className="space-y-4 mx-4">
          <div className='items-center gap-2 '>
            <label htmlFor="title" className="block text-sm font-medium text-secondary">
              Title:
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="form-input border-b border-border"
              defaultValue={recipe?.title || ""}
            />
          </div>

          <div className='items-center gap-2'>
            <label htmlFor="subtitle" className="block text-sm font-medium text-secondary">
              Subtitle:
            </label>
            <input
              type="text"
              name="subtitle"
              id="subtitle"
              className="form-input border-b border-border"
              defaultValue={recipe?.subtitle || ""}
            />
          </div>

          <div className='items-center gap-2'>
            <label htmlFor="description" className="block text-sm font-medium text-secondary">
              Description:
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="form-input border border-border"
              defaultValue={recipe?.description || ""}
            />
          </div>

          <div className='flex items-center gap-2'>
            <label htmlFor="roast" className="block text-sm font-medium text-secondary whitespace-nowrap">
              Roast Level:
            </label>
            <select
              name="roast"
              id="roast"
              className="form-input"
              defaultValue={recipe?.roast ? Object.keys(Roast).find(key => Roast[key as keyof typeof Roast] === recipe.roast) : ""}
            >
              <option value="">[Select Roast Level]</option>
              {Object.entries(Roast)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="dripper" className="block text-sm font-medium text-secondary whitespace-nowrap">
              Dripper:
            </label>
            <input
              type="text"
              name="dripper"
              id="dripper"
              className="form-input border-b border-border"
              defaultValue={recipe?.dripper || ""}
            />
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-4 grow w-full lg:overflow-y-scroll lg:h-[calc(100dvh-6rem)] lg:pr-4"> 
          <h2 className="text-xl font-semibold px-4">Brewing Steps</h2>

          <div className="space-y-4">
            <div className="flex flex-col">
              {steps.map((step: RecipeStep, stepIndex: number) => (
                <RecipeStepEntity
                  key={stepIndex}
                  step={step}
                  onUpdate={(updatedStep) => updateStep(stepIndex, updatedStep)}
                  onRemove={() => removeStep(stepIndex)}
                  stepIndex={stepIndex}
                  editMode={editMode}
                />
              ))}
              <div className={`w-full flex items-center justify-center text-background p-4 ${steps.length%2 === 0 ? 'bg-card' : 'bg-card/70'}`}>
                {editMode && (
                  <PlusButton 
                    onClick={addStep}
                    size={32}
                    /> 
                  )}
              </div>
            </div>
          </div>
        </div> 
      </form>

      <div className='flex items-center justify-end px-4 py-4'>
        <button className='bg-red-500 text-background px-4 py-2 rounded-md' onClick={handleDelete}>
          Delete Recipe
        </button> 
      </div>
      
    </div>
  );
} 