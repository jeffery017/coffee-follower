"use client";
import MinusButton from '@/ui/common/MinusButton';
import PlusButton from '@/ui/common/PlusButton';
import { RecipeAction, RecipeStep, RecipeStepActionType } from '@/utils/schemas/Recipe';
import { useEffect, useRef, useState } from 'react';
import RecipeActionForm from './RecipeActionForm';

interface Props {
  step: RecipeStep;
  stepIndex: number;
  editMode?: boolean;
  onUpdate?: (step: RecipeStep) => void;
  onRemove?: () => void;
}

const actionTypeDisplayNames = {
  [RecipeStepActionType.CENTER_POURING]: 'Center Pouring',
  [RecipeStepActionType.CIRCLE_POURING]: 'Circle Pouring',
  [RecipeStepActionType.STIRRING]: 'Stirring',
  [RecipeStepActionType.WAITING]: 'Waiting', 
} as const;

export default function RecipeStepEntity({ step, stepIndex, onUpdate, onRemove, editMode = false }: Props) {
  const [localStep, setLocalStep] = useState<RecipeStep>(step);
  const [showActionOptions, setShowActionOptions] = useState(false);
  const instructionRef = useRef<HTMLTextAreaElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowActionOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (instructionRef.current) {
      adjustTextareaHeight(instructionRef.current);
    }
  }, [localStep.instruction]);

  const addAction = (actionType: RecipeStepActionType) => {
    const lastAction = localStep.actions[localStep.actions.length - 1];
    const newAction: RecipeAction = {
      action: actionType,
      duration: lastAction?.duration ? lastAction.duration + 10 : undefined,
      weight: lastAction?.weight,
    };
    setLocalStep(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
    onUpdate?.({
      ...localStep,
      actions: [...localStep.actions, newAction]
    });
  };

  const updateAction = (actionIndex: number, updatedAction: RecipeAction) => {
    const newActions = [...localStep.actions];
    const prevAction = actionIndex > 0 ? newActions[actionIndex - 1] : undefined;

    // Ensure targetTime is not less than previous action's targetTime
    if (updatedAction.duration !== undefined && prevAction?.duration !== undefined) {
      updatedAction.duration = Math.max(updatedAction.duration, prevAction.duration);
    }

    // Ensure targetQuantity is not less than previous action's targetQuantity
    if (updatedAction.weight !== undefined && prevAction?.weight !== undefined) {
      updatedAction.weight = Math.max(updatedAction.weight, prevAction.weight);
    }

    newActions[actionIndex] = updatedAction;
    setLocalStep(prev => ({ ...prev, actions: newActions }));
    onUpdate?.({ ...localStep, actions: newActions });
  };

  const removeAction = (actionIndex: number) => {
    const newActions = [...localStep.actions];
    newActions.splice(actionIndex, 1);
    setLocalStep(prev => ({ ...prev, actions: newActions }));
    onUpdate?.({ ...localStep, actions: newActions });
  };

  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const handleStepChange = (field: keyof RecipeStep, value: any) => {
    const updated = { ...localStep, [field]: value };
    setLocalStep(updated);
    onUpdate?.(updated);
  };

  return (
    <div className={`relative p-4 gap-4 flex flex-col items-center justify-between ${stepIndex % 2 === 0 ? 'bg-card' : 'bg-card/70'}`}>
        {editMode && stepIndex > 0 && (  
          <div className='absolute top-3 left-3 text-background'>
            <button onClick={onRemove ?? (() => {})}>
              <MinusButton  size={32} /> 
            </button>
          </div>
        )}  
        <h2 className="w-full text-2xl text-secondary font-light text-center">{stepIndex + 1}</h2>
        {/* Grid */}
        <div className="w-full grid grid-cols-12">
          {/* Headers */}
          <div className="col-span-6 font-light whitespace-nowrap px-2 border-r border-primary text-center">Action</div>
          <div className="col-span-3 font-light px-2 border-r border-primary text-center">Time</div>
          <div className="col-span-3 font-light px-4 text-center">Water</div>
            
          {/* Actions */}
          {localStep.actions.map((action, actionIndex) => (
            <RecipeActionForm
              key={actionIndex}
              action={action}
              onUpdate={(updatedAction) => updateAction(actionIndex, updatedAction)}
              onRemove={() => removeAction(actionIndex)}
              editMode={editMode}
            />
          ))} 
        </div>  
        {/* Add Action Button */}
        {editMode && (
        <>
        <div className='w-full border-t border-primary'></div>
        <div className="flex items-center justify-start w-full text-background gap-2">
          <div className="relative" ref={optionsRef}>
            <button
              type="button"
              onClick={() => setShowActionOptions(!showActionOptions)}
              className="flex items-center gap-2 sm:px-3 sm:py-1 sm:rounded-full sm:hover:bg-primary/10"
            >
              <PlusButton size={16} />
              <span>Add Action</span>
            </button>
            
            {showActionOptions && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-primary/20 shadow-md z-10">
                {Object.entries(actionTypeDisplayNames).map(([actionType, displayName]) => (
                  <button
                    key={actionType}
                    type="button"
                    onClick={() => {
                      addAction(actionType as RecipeStepActionType);
                      setShowActionOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-primary/10 flex items-center gap-2"
                  >
                    <PlusButton size={16} />
                    <span>{displayName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        </>
      )} 
      {/* Instruction */} 
        {(editMode || localStep.instruction) && (
          <> 
            <div className='w-full border-t border-primary'></div>
            <textarea
            ref={instructionRef}
            value={localStep.instruction || ''}
            onChange={(e) => handleStepChange('instruction', e.target.value)}
            onInput={(e) => adjustTextareaHeight(e.currentTarget)}
            placeholder="Add Instruction..."
            className="w-full p-2 border-b border-primary text-background placeholder:text-background outline-none resize-none overflow-hidden"
            rows={1}
            />
          </> 
        )}
      
    </div>
  );
} 