import { RecipeAction, Step } from '@/utils/schemas/Recipe';
import { useEffect, useState } from 'react';
import ActionForm from './ActionForm';
import RemoveButton from './RemoveButton';
import StepProgress from './StepProgress';

interface StepFormProps {
  step: Step;
  stepIndex: number;
  onAddAction: (stepIndex: number) => void;
  onUpdateAction: (stepIndex: number, actionIndex: number, action: RecipeAction) => void;
  onRemoveAction: (stepIndex: number, actionIndex: number) => void;
  onRemoveStep: (stepIndex: number) => void;
  onUpdateStep: (stepIndex: number, field: keyof Step, value: Step[keyof Step]) => void;
}

export default function StepForm({
  step,
  stepIndex,
  onAddAction,
  onUpdateAction,
  onRemoveAction,
  onRemoveStep,
  onUpdateStep,
}: StepFormProps) {
  const [selectedAction, setSelectedAction] = useState<number | undefined>(0);

  // Set default step title on mount if not set
  useEffect(() => {
    if (!step.title) {
      onUpdateStep(stepIndex, 'title', `Step ${stepIndex + 1}`);
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="flex flex-col border rounded-2xl gap-4 px-3 py-2 bg-white shadow-lg border-indigo-200 overflow-y-auto relative"
    onClick={() => setSelectedAction(undefined)}
    > 

      {/* Step Title and Description */}
      <div className="">
        <div className="flex flex-col gap-2"> 
          <div className='flex items-center gap-2 justify-between'>
            <input
              type="text"
              id={`step-title-${stepIndex}`}
              value={step.title || ''}
              onChange={(e) => onUpdateStep(stepIndex, 'title', e.target.value)}
              placeholder="Step Title"
              className="text-lg font-bold p-2 w-full outline-none focus:border-gray-400 "
            /> 
            <RemoveButton 
              onClick={() => onRemoveStep(stepIndex)} 
              title="Remove step"
              className=""
            />
          </div>
          <textarea
            id={`step-description-${stepIndex}`}
            value={step.description || ''}
            onChange={(e) => onUpdateStep(stepIndex, 'description', e.target.value)}
            placeholder="Description"
            rows={2}
            className="p-2 block w-full outline-none bg-neutral-100 rounded-md focus:border-gray-400"
          />
        </div>
        <div> 
        </div>
      </div>

      <div className="flex">
        <StepProgress step={step} vertical={true} selectedAction={selectedAction}/>
        <div className="flex flex-col gap-2 max-h-[50dvh] overflow-y-auto p-2 w-full">
          {step.actions.map((action, actionIndex) => (
            <div
              key={actionIndex} 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAction(actionIndex);
              }}
              className="cursor-pointer"
            >
              <ActionForm
                action={action}
                onUpdate={(updatedAction) => onUpdateAction(stepIndex, actionIndex, updatedAction)}
                onRemove={() => onRemoveAction(stepIndex, actionIndex)}
                isSelected={actionIndex === selectedAction}
              /> 
            </div>
          ))} 
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onAddAction(stepIndex);
        }}
        className="w-10 h-10 mx-auto inline-flex items-center justify-center rounded-full border-1 border-neutral-400 text-sm font-medium text-neutral-700 bg-white focus:outline-none shadow-md transition-colors duration-200"
        title="Add Action"
      >
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
} 