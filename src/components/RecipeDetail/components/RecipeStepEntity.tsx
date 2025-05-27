"use client";
import MinusButton from '@/components/common/MinusButton';
import PlusButton from '@/components/common/PlusButton';
import { RecipeAction, RecipeStep, stepActionType } from '@/utils/schemas/Recipe';
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
  [stepActionType.CENTER_POURING]: 'Center Pouring',
  [stepActionType.CIRCLE_POURING]: 'Circle Pouring',
  [stepActionType.STIRRING]: 'Stirring',
  [stepActionType.WAITING]: 'Waiting', 
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

  const addAction = (actionType: stepActionType) => {
    const lastAction = localStep.actions[localStep.actions.length - 1];
    const newAction: RecipeAction = {
      action: actionType,
      targetTime: lastAction?.targetTime ? lastAction.targetTime + 10 : undefined,
      targetGram: lastAction?.targetGram,
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
    if (updatedAction.targetTime !== undefined && prevAction?.targetTime !== undefined) {
      updatedAction.targetTime = Math.max(updatedAction.targetTime, prevAction.targetTime);
    }

    // Ensure targetQuantity is not less than previous action's targetQuantity
    if (updatedAction.targetGram !== undefined && prevAction?.targetGram !== undefined) {
      updatedAction.targetGram = Math.max(updatedAction.targetGram, prevAction.targetGram);
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
    <div className={`relative p-4 flex flex-col gap-4 items-center justify-between ${stepIndex % 2 === 0 ? 'bg-card' : 'bg-card/70'}`}>
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
        <div className='w-full border-t border-primary'></div>
        {editMode && (
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
                      addAction(actionType as stepActionType);
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
      )} 
      <div className='w-full border-t border-primary'></div>
        {editMode ? (
          <textarea
            ref={instructionRef}
            value={localStep.instruction || ''}
            onChange={(e) => handleStepChange('instruction', e.target.value)}
            onInput={(e) => adjustTextareaHeight(e.currentTarget)}
            placeholder="Add Instruction..."
            className="w-full p-2 border-b border-primary text-background placeholder:text-background outline-none resize-none overflow-hidden"
            rows={1}
          />
        ) : (
          <p>{localStep.instruction}</p>
        )}
      
    </div>
  );
} 