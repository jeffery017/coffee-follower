'use client';

import { RecipeRepository } from '@/utils/firebase/RecipeRepository';
import { Recipe, RecipeStep, Roast, recipeSchema } from '@/utils/schemas';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PlusButton from '../common/PlusButton';
import FormField from './components/FormField';
import RecipeStepEntity from './components/RecipeStepEntity';
import TagInput from './components/TagInput';


interface Props {
  recipeId?: string;
  editMode: boolean;
}

export default function RecipeDetail({ recipeId, editMode = false }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [steps, setSteps] = useState<RecipeStep[]>([ ]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(!!recipeId);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const preparationRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

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
      setRecipe({
        id: '',
        uid: 'user123',
        title: '',
        subtitle: '',
        introduction: '',
        preparation: { notes: '' },
        steps: [{
          name: "Step 1",
          instruction: "",
          actions: []
        }],
        dripper: [],
        filter: [],
        tags: []
      });
      setSteps([
        {
          name: "Step 1",
          instruction: "",
          actions: []
        }
      ]);
    }
  }, [recipeId]);

  useEffect(() => {
    if (descriptionRef.current) {
      adjustTextareaHeight(descriptionRef.current);
    }
    if (preparationRef.current) {
      adjustTextareaHeight(preparationRef.current);
    }
  }, [recipe?.introduction, recipe?.preparation?.notes]);

  const addStep = () => {
    const newStep: RecipeStep = {
      name: `Step ${steps.length + 1}`,
      instruction: "",
      actions: []
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
        introduction: formData.get('introduction') as string || '',
        roast: formData.get('roast') as Roast || undefined,
        grindSize: formData.get('grindSize') as string || '',
        temperature: formData.get('temperature') ? Number(formData.get('temperature')) : undefined,
        coffeeWeight: formData.get('coffeeWeight') ? Number(formData.get('coffeeWeight')) : undefined,
        waterWeight: formData.get('waterWeight') ? Number(formData.get('waterWeight')) : undefined,
        tags: recipe?.tags || [],
        dripper: recipe?.dripper || [],
        filter: recipe?.filter || [],
        preparation: { notes: formData.get('preparation.notes') as string || '' },
        steps: steps.map(step => ({
          name: step.name,
          instruction: step.instruction || '',
          actions: step.actions.map(action => ({
            action: action.action,
            duration: action.duration,
            weight: action.weight, 
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

  const handleNavSubmit = () => {
    formRef.current?.requestSubmit();
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

  const handleTagsChange = (newTags: string[]) => {
    if (recipe) {
      setRecipe({
        ...recipe,
        tags: newTags
      });
    } else {
      // For new recipes
      setRecipe({
        id: '',
        uid: 'user123',
        title: '',
        subtitle: '',
        introduction: '',
        preparation: { notes: '' },
        steps: steps,
        tags: newTags
      });
    }
  };

  if (loading) {
    return <div className='w-full h-full flex items-center justify-center'>Loading...</div>;
  }

  return (
    <div className='container mx-auto' >  

      <form ref={formRef} onSubmit={handleSubmit} className="mt-4 w-full space-y-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info Section */}
        <div className="flex flex-col gap-8">
          <div className='space-y-4 p-4'>
            {/* Title */} 
            <div>
              <div className='flex items-center justify-between gap-2'>
                <input
                  type="text"
                  name="title"
                  id="title" 
                  required
                  disabled={!editMode}
                  className="form-input text-3xl md:text-4xl uppercase placeholder:text-primary/15"
                  defaultValue={recipe?.title || ""}
                  placeholder="recipe title"
                  onChange={(e) => e.target.value = e.target.value.toUpperCase()}
                />
                {recipeId && ( 
                  <Link href={`/recipes/${recipe?.id}/play`} >
                    <div className='px-4 py-2 bg-primary text-background flex items-center gap-2'> 
                        <span>Play</span>
                    </div>
                  </Link>
                )}

              </div>

              {/* Subtitle */}
              <input
                type="text"
                name="subtitle"
                id="subtitle"
                disabled={!editMode}
                className="form-input text-xl placeholder:text-primary/15"
                defaultValue={recipe?.subtitle || ""}
                placeholder="recipe subtitle"
              />
            </div>
              {/* Tags Section */}
              <TagInput
                tags={recipe?.tags || []}
                placeholder="Add Tag..."
                onChange={handleTagsChange}
                editMode={editMode}
              />  
            {/* Description */}
          </div> 
          

          {/* Brewing Properties */} 
          <div className='bg-card/30 p-4 space-y-4'>
            <div className='items-center gap-2'> 
              <label htmlFor="introduction" className="block text-xl font-medium text-primary">
                Introduction
              </label>
              <textarea
                ref={descriptionRef}
                name="introduction"
                id="introduction"
                rows={1}
                disabled={!editMode}
                className="form-input resize-none overflow-hidden placeholder:text-primary/15 border-b border-border"
                defaultValue={recipe?.introduction || ""}
                placeholder="Add introduction..."
                onInput={(e) => adjustTextareaHeight(e.currentTarget)}
              />
            </div> 
            <h1 className='text-xl'>Properties</h1>
            <div className='grid grid-cols-2 gap-4'>
             
              <FormField
                label="Coffee Weight (g)"
                name="coffeeWeight"
                id="coffeeWeight"
                type="number"
                required={true}
                disabled={!editMode}
                defaultValue={recipe?.coffeeWeight?.toString() || ""}
              />
              <FormField
                label="Water Weight (g)"
                name="waterWeight"
                id="waterWeight"
                type="number"
                required={true}
                disabled={!editMode}
                defaultValue={recipe?.waterWeight?.toString() || ""}
              />  
              <FormField
                label="Temperature (°C)"
                name="temperature"
                id="temperature"
                type="number"
                required={true}
                disabled={!editMode}
                defaultValue={recipe?.temperature?.toString() || ""}
              />
              <FormField
                label="Roast Level"
                name="roast"
                id="roast"
                type="select"
                required={true}
                disabled={!editMode}
                options={Object.entries(Roast)
                  .filter(([key]) => isNaN(Number(key)))
                  .map(([key]) => ({ value: key, label: key }))}
                defaultValue={recipe?.roast ? Object.keys(Roast).find(key => Roast[key as keyof typeof Roast] === recipe.roast) : ""}
              />
              {editMode || recipe?.grindSize && (
              <FormField
                label="Grind Size"
                name="grindSize"
                id="grindSize"
                placeholder='Optional'
                defaultValue={recipe?.grindSize || ""}
              /> 
              )}
              {(editMode || recipe?.dripper) && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary">Dripper</label>
                  <TagInput
                    tags={recipe?.dripper || []}
                    placeholder="Add dripper..."
                    onChange={(newDrippers) => {
                      if (recipe) {
                        setRecipe({
                          ...recipe,
                          dripper: newDrippers
                        });
                      }
                    }}
                    editMode={editMode}
                  />
                </div>
              )}
              {(editMode || recipe?.filter) && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary">Filter</label>
                  <TagInput
                    tags={recipe?.filter || []}
                    placeholder="Add filter..."
                    onChange={(newFilters) => {
                      if (recipe) {
                        setRecipe({
                          ...recipe,
                          filter: newFilters
                        });
                      }
                    }}
                    editMode={editMode}
                  />
                </div>
              )}
            </div>
          </div> 
        </div>

        


        

        {/* Steps Section */}
        <div className="flex flex-col grow w-full lg:overflow-y-scroll lg:h-[calc(100dvh-6rem)] lg:pr-4"> 
          <h2 className="text-2xl text-center p-2">Brewing Steps</h2>
          {/* Preparation Notes */}
          {editMode || recipe?.preparation?.notes && (
            <div className='items-center bg-card/70 p-4'>
            <label htmlFor="preparation" className="block text-sm font-medium text-secondary">
              Preparation Notes
            </label>
            <textarea
              ref={preparationRef}
              name="preparation.notes"
              id="preparation"
              rows={1}
              disabled={!editMode}
              className="form-input border-b border-primary resize-none overflow-hidden text-background placeholder:text-background/80"
              defaultValue={recipe?.preparation?.notes || ""}
              placeholder="Add notes..."
              onInput={(e) => adjustTextareaHeight(e.currentTarget)}
            /> 
          </div>
          )}

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
              {editMode && (
                <div className={`flex items-center justify-center text-background p-4 ${steps.length%2 === 0 ? 'bg-card' : 'bg-card/70'}`}>
                  <button type="button" onClick={addStep} className='flex items-center gap-2'>
                    <PlusButton size={32} /> 
                    <span className=''>Add Step</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div> 
      </form>

      {/* Submit Button */}
      {editMode && (
      <div className='flex items-center justify-center px-4 py-4'>
        <div className='flex flex-col items-center gap-2'>
        <button
          type="button"
          onClick={handleNavSubmit}
          disabled={isSubmitting}
          className="justify-center bg-primary hover:bg-primary/80 py-2 px-4 text-sm font-medium text-background shadow-sm disabled:opacity-50"
        >
          {isSubmitting
            ? (recipeId ? 'Updating...' : 'Creating...')
            : (recipeId ? 'Update Recipe' : 'Create Recipe')}
        </button>
        { recipeId && (
          <button className='text-red-500 px-4 py-2 rounded-md' onClick={handleDelete}>
            Delete Recipe
          </button> 
        )}  
        </div>
      </div>
      )}
    </div>
  );
} 