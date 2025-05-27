"use client";
import MinusButton from '@/components/common/MinusButton';
import { RecipeAction, stepActionType } from '@/utils/schemas/Recipe';
import { useEffect, useState } from 'react';
 

interface Props {
  action: RecipeAction;
  onUpdate: (action: RecipeAction) => void;
  onRemove: () => void; 
  editMode: boolean;
}

const actionTypeDisplayNames = {
  [stepActionType.CENTER_POURING]: 'Center Pouring',
  [stepActionType.CIRCLE_POURING]: 'Circle Pouring',
  [stepActionType.STIRRING]: 'Stirring',
  [stepActionType.WAITING]: 'Waiting', 
} as const;



export default function RecipeActionForm({ action, onUpdate, onRemove, editMode = false }: Props) { 

  // Local state for editing
  const [localAction, setLocalAction] = useState<RecipeAction>(action);
  const [minutesInput, setMinutesInput] = useState(
    localAction.targetTime ? Math.floor(localAction.targetTime / 60).toString() : ''
  );
  const [secondsInput, setSecondsInput] = useState(
    localAction.targetTime ? (localAction.targetTime % 60).toString() : ''
  );
  const [gramInput, setGramInput] = useState(
    localAction.targetGram !== undefined ? localAction.targetGram.toString() : ''
  );

  // Keep local state in sync with prop changes
  useEffect(() => {
    setLocalAction(action);
    setMinutesInput(localAction.targetTime ? Math.floor(localAction.targetTime / 60).toString() : '');
    setSecondsInput(localAction.targetTime ? (localAction.targetTime % 60).toString() : '');
    setGramInput(localAction.targetGram !== undefined ? localAction.targetGram.toString() : '');
  }, [action]);

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? e.target.value as stepActionType : undefined;
    setLocalAction(prev => ({ ...prev, action: value }));
    onUpdate({ ...localAction, action: value });
  };

  const isPourAction = localAction.action === stepActionType.CENTER_POURING || localAction.action === stepActionType.CIRCLE_POURING;

  // Handler for minutes input
  const handleMinutesBlur = () => {
    const minutes = minutesInput ? parseInt(minutesInput) : 0;
    const seconds = localAction.targetTime ? localAction.targetTime % 60 : 0;
    const totalSeconds = minutes * 60 + seconds;
    setLocalAction(prev => ({ ...prev, targetTime: totalSeconds }));
    onUpdate({ ...localAction, targetTime: totalSeconds });
  };

  // Handler for seconds input
  const handleSecondsBlur = () => {
    const seconds = secondsInput ? parseInt(secondsInput) : 0;
    if (seconds >= 60) return;
    const minutes = localAction.targetTime ? Math.floor(localAction.targetTime / 60) : 0;
    const totalSeconds = minutes * 60 + seconds;
    setLocalAction(prev => ({ ...prev, targetTime: totalSeconds }));
    onUpdate({ ...localAction, targetTime: totalSeconds });
  };

  // Handler for gram input
  const handleGramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGramInput(e.target.value);
  };

  const handleGramBlur = () => {
    const value = gramInput ? Number(gramInput) : undefined;
    setLocalAction(prev => ({ ...prev, targetGram: value }));
    onUpdate({ ...localAction, targetGram: value });
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutesInput(e.target.value);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondsInput(e.target.value);
  };

  return (
    <> 
      <div className="border-r border-primary flex items-center justify-start text-background placeholder:text-background/50 gap-4"> 
      {/* Remove Action */}
        <MinusButton onClick={onRemove} />
        {/* Action */}
        {editMode ? (
          <select 
          value={localAction.action ?? ''} 
            className="text-background text-center w-full rounded-full mr-2 md:mr-8"
            onChange={handleActionChange}
          >
            <option value="">[Select action]</option>
            {Object.entries(actionTypeDisplayNames).map(([actionType, displayName]) => (
              <option key={actionType} value={actionType}>
                {displayName}
              </option>
            ))}
          </select>
        ) : (
          <div>{actionTypeDisplayNames[action.action as stepActionType] || '-'}</div>
        )}
      </div>
      {/* Target Time */}
      <div className="border-r border-primary text-background"> 
        {editMode ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="59"
              step="1"
              placeholder="mm"
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
              className="form-input placeholder:text-background"
              value={secondsInput}
              onChange={handleSecondsChange}
              onBlur={handleSecondsBlur}
            />
          </div>
        ) : (
          <div className="text-primary">
            {localAction.targetTime ? `${Math.floor(localAction.targetTime / 60)}:${String(localAction.targetTime % 60).padStart(2, '0')}` : '-'}
          </div>
        )}
      </div> 
      {/* Target Gram */}
      <div className="flex items-center justify-center">
        { isPourAction && (
        <div className="flex items-center gap-1 w-10 text-background placeholder:text-background/50">
            
            {editMode ? (
                <input
                  type="number"
                  value={gramInput}
                  onChange={handleGramChange}
                  onBlur={handleGramBlur}
                  className="form-input text-end "
                  min="0"
                  max="999"
                  step="1"
                  placeholder="___"
                />
              ) : (
                <div className="text-primary">{localAction.targetGram ?? '-'}</div>
              )}
              <span>g</span>


        </div>
          )
        }
      </div>
    </>
  );
} 
 