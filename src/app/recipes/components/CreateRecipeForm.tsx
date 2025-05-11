'use client';

import { RecipeRepository } from '@/utils/firebase/RecipeRepository';
import { RecipeAction, recipeSchema, Roast, Step } from '@/utils/schemas/Recipe';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import StepForm from './StepForm';

export default function CreateRecipeForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [steps, setSteps] = useState<Step[]>([{actions: [{}]}]);

  const addStep = () => {
    setSteps([...steps, { actions: [{}] }]);
  };

  const addAction = (stepIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].actions.push({});
    setSteps(newSteps);
  };

  const updateAction = (stepIndex: number, actionIndex: number, updatedAction: RecipeAction) => {
    const newSteps = [...steps];
    newSteps[stepIndex].actions[actionIndex] = updatedAction;
    setSteps(newSteps);
  };

  const updateStep = (stepIndex: number, field: keyof Step, value: Step[keyof Step]) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      [field]: value
    };
    setSteps(newSteps);
  };

  const removeAction = (stepIndex: number, actionIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].actions.splice(actionIndex, 1);
    setSteps(newSteps);
  };

  const removeStep = (stepIndex: number) => {
    if (steps.length === 1) {
      return;
    }
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
        uid: 'user123', // TODO: Replace with actual user ID
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string || '',
        description: formData.get('description') as string || '',
        roast: formData.get('roast') ? Roast[formData.get('roast') as keyof typeof Roast] : undefined,
        dripper: formData.get('dripper') as string || '',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        preparation: { 
          notes: '',
        },
        steps: steps.map(step => ({
          actions: step.actions.map(action => ({
            action: action.action,
            instruction: action.instruction || '',
            duration: action.duration || undefined,
            targetQuantity: action.targetQuantity || undefined,
          }))
        })),
      });

      const recipeRepository = new RecipeRepository();
      await recipeRepository.create(recipeData);
      router.refresh();
      router.push('/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-4">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="p-2 mt-1 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            id="subtitle"
            className="p-2 mt-1 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            className="p-2 mt-1 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400"
          />
        </div>

        <div>
          <label htmlFor="roast" className="block text-sm font-medium text-gray-700">
            Roast Level
          </label>
          <select
            name="roast"
            id="roast"
            className="p-2 mt-1 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400"
          >
            <option value="">Select roast level</option>
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
          <label htmlFor="dripper" className="block text-sm font-medium text-gray-700">
            Dripper
          </label>
          <input
            type="text"
            name="dripper"
            id="dripper"
            className="p-2 mt-1 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400"
          />
        </div>
      </div>

      {/* Steps Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Brewing Steps</h2>

        <div className="space-y-4">
          {steps.map((step, stepIndex) => (
            <StepForm
              key={stepIndex}
              step={step}
              stepIndex={stepIndex}
              onAddAction={addAction}
              onUpdateAction={updateAction}
              onRemoveAction={removeAction}
              onRemoveStep={removeStep}
              onUpdateStep={updateStep}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addStep}
          className="w-full inline-flex items-center justify-center px-3 py-1.5 border text-sm font-medium rounded-2xl border-indigo-200 text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Step
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
} 