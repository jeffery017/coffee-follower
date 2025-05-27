"use client";
import CancelButton from '@/components/common/CancelButton';
import PlusButton from '@/components/common/PlusButton';
import { RecipeAction, RecipeStep } from '@/utils/schemas/Recipe';
import { useState } from 'react';
import RecipeActionForm from './RecipeActionForm';

interface Props {
  step: RecipeStep;
  stepIndex: number;
  editMode?: boolean;
  onUpdate?: (step: RecipeStep) => void;
  onRemove?: () => void;
}

export default function RecipeStepEntity({ step, stepIndex, onUpdate, onRemove, editMode = false }: Props) {
  const [localStep, setLocalStep] = useState<RecipeStep>(step);

  const addAction = () => {
    const lastAction = localStep.actions[localStep.actions.length - 1];
    const newAction: RecipeAction = {
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
    if (localStep.actions.length === 1) return; // Don't remove the last action
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
    <div className={`relative p-4 flex flex-col gap-4 items-center justify-center ${stepIndex % 2 === 0 ? 'bg-card' : 'bg-card/70'}`}>
        {editMode && (  
          <div className='absolute top-3 right-3'>
            <CancelButton onClick={onRemove ?? (() => {})} title="Remove step" /> 
          </div>
        )}  
        <h2 className="text-xl font-semibold">{stepIndex + 1}</h2>
        {/* Grid */}
        <div className="w-full grid grid-cols-3">
          {/* Headers */}
          <div className="col-span-1 font-light whitespace-nowrap px-2 border-r border-primary text-center">Select Action</div>
          <div className="col-span-1 font-light whitespace-nowrap px-2 border-r border-primary text-center">Target Time</div>
          <div className="col-span-1 font-light whitespace-nowrap px-4 text-center">Target Gram</div>
            
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
        <div className="flex items-center justify-start w-full text-background gap-2"
        >
          <PlusButton size={16} onClick={addAction} />
          <span className=''>[add action]</span>
        </div>
      )} 
<div className='w-full border-t border-primary'></div>
        {editMode ? (
          <textarea
          value={localStep.instruction || ''}
          onChange={(e) => handleStepChange('instruction', e.target.value)}
          placeholder="Step Instruction"
          className="w-full p-2 text-background placeholder:text-background/50 focus:bg-black/5 outline-none resize-none"
          rows={2}
          />
        ) : (
          <p>{localStep.instruction}</p>
        ) }
      
    </div>
  );
} 