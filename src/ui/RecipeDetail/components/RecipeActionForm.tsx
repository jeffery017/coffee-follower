"use client";
import MinusButton from '@/ui/common/MinusButton';
import { RecipeAction, RecipeStepActionType } from '@/utils/schemas/Recipe';
import { useEffect, useState } from 'react';
 

interface Props {
  action: RecipeAction; 
  onUpdate: (action: RecipeAction) => void;
  onRemove: () => void; 
  editMode: boolean;
}

const actionTypeDisplayNames = {
  [RecipeStepActionType.CENTER_POURING]: 'Center Pouring',
  [RecipeStepActionType.CIRCLE_POURING]: 'Circle Pouring',
  [RecipeStepActionType.STIRRING]: 'Stirring',
  [RecipeStepActionType.WAITING]: 'Waiting', 
} as const;



export default function RecipeActionForm({ action, onUpdate, onRemove, editMode = false }: Props) { 

  // Local state for editing
  const [localAction, setLocalAction] = useState<RecipeAction>(action);
  const [minutesInput, setMinutesInput] = useState(
    localAction.duration ? Math.floor(localAction.duration / 60).toString() : ''
  );
  const [secondsInput, setSecondsInput] = useState(
    localAction.duration ? (localAction.duration % 60).toString() : ''
  );
  const [gramInput, setGramInput] = useState(
    localAction.weight !== undefined ? localAction.weight.toString() : ''
  );

  // Keep local state in sync with prop changes
  useEffect(() => {
    setLocalAction(action);
    setMinutesInput(localAction.duration ? Math.floor(localAction.duration / 60).toString() : '');
    setSecondsInput(localAction.duration ? (localAction.duration % 60).toString() : '');
    setGramInput(localAction.weight !== undefined ? localAction.weight.toString() : '');
  }, [action]);

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? e.target.value as RecipeStepActionType : undefined;
    setLocalAction(prev => ({ ...prev, action: value }));
    onUpdate({ ...localAction, action: value });
  };

  const isPourAction = localAction.action === RecipeStepActionType.CENTER_POURING || localAction.action === RecipeStepActionType.CIRCLE_POURING;

  // Handler for minutes input
  const handleMinutesBlur = () => {
    const minutes = minutesInput ? parseInt(minutesInput) : 0;
    const seconds = localAction.duration ? localAction.duration % 60 : 0;
    const totalSeconds = minutes * 60 + seconds;
    setLocalAction(prev => ({ ...prev, duration: totalSeconds }));
    onUpdate({ ...localAction, duration: totalSeconds });
  };

  // Handler for seconds input
  const handleSecondsBlur = () => {
    const seconds = secondsInput ? parseInt(secondsInput) : 0;
    if (seconds >= 60) return;
    const minutes = localAction.duration ? Math.floor(localAction.duration / 60) : 0;
    const totalSeconds = minutes * 60 + seconds;
    setLocalAction(prev => ({ ...prev, duration: totalSeconds }));
    onUpdate({ ...localAction, duration: totalSeconds });
  };

  // Handler for gram input
  const handleGramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGramInput(e.target.value);
  };

  const handleGramBlur = () => {
    const value = gramInput ? Number(gramInput) : undefined;
    setLocalAction(prev => ({ ...prev, weight: value }));
    onUpdate({ ...localAction, weight: value });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutesInput(e.target.value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondsInput(e.target.value);
  };

  return (
    <> 
      <div className="col-span-6 border-r border-primary flex items-center justify-start text-background placeholder:text-background/50 gap-4"> 
          
        <div>
          {editMode && (
            <button type="button" onClick={onRemove}> 
              <MinusButton />  
            </button>
          )}
        </div> 
        <select 
          value={localAction.action ?? ''} 
          className="text-background text-center w-full mr-2 md:mr-8 outline-none focus:outline-none focus:ring-0 focus:border-none"
          onChange={handleActionChange}
          disabled={!editMode}
        >
          {Object.entries(actionTypeDisplayNames).map(([actionType, displayName]) => (
            <option key={actionType} value={actionType}>
              {displayName}
            </option>
          ))}
        </select> 
         
      </div>
      <div className="col-span-3 border-r border-primary text-background"> 
        
          <div className="flex items-center gap-1 ml-2">
            <input
              type="number"
              min="0"
              max="59"
              step="1"
              placeholder="mm"
              disabled={!editMode}
              className="form-input text-end placeholder:text-background"
              value={minutesInput ?? ''}
              onChange={handleMinutesChange}
              onBlur={handleMinutesBlur}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              step="1"
              placeholder="ss"
              disabled={!editMode}
              className="form-input placeholder:text-background"
              value={secondsInput}
              onChange={handleSecondsChange}
              onBlur={handleSecondsBlur}
            />
          </div>
         
      </div> 
      <div className="col-span-3 flex items-center justify-center">
        {isPourAction && (
          <div className="flex items-center gap-1 w-10 text-background placeholder:text-background/50">
           
            <input
              type="number"
              value={gramInput}
              onChange={handleGramChange}
              onBlur={handleGramBlur}
              className="form-input text-end"
              min="0"
              max="999"
              step="1"
              placeholder="___"
              disabled={!editMode}
            />
            <span>g</span>
          </div>
        )}
      </div>
    </>
  );
} 
 