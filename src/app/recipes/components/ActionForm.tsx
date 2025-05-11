"use client";
import { RecipeAction, stepActionType } from '@/utils/schemas/Recipe';
import RemoveButton from './RemoveButton';

interface ActionFormProps {
  action: RecipeAction;
  onUpdate: (action: RecipeAction) => void;
  onRemove: () => void;
  isSelected?: boolean;
}

const actionTypeDisplayNames = {
  [stepActionType.CENTER_POURING]: 'Center Pouring',
  [stepActionType.SIDE_POURING]: 'Side Pouring',
  [stepActionType.STIRRING]: 'Stirring',
  [stepActionType.WAITING]: 'Waiting',
} as const;

const actionBorderColors = {
  [stepActionType.CENTER_POURING]: 'border-blue-500',
  [stepActionType.SIDE_POURING]: 'border-green-500',
  [stepActionType.STIRRING]: 'border-yellow-500',
  [stepActionType.WAITING]: 'border-gray-500',
 
} as const;

export default function ActionForm({ action, onUpdate, onRemove, isSelected = false }: ActionFormProps) {
  const handleActionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newActionType = e.target.value ? (e.target.value as stepActionType) : undefined;
    onUpdate({ 
      ...action,
      action: newActionType,
      // Clear target quantity if the new action type doesn't support it
      targetQuantity: (newActionType === stepActionType.CENTER_POURING || newActionType === stepActionType.SIDE_POURING) 
        ? action.targetQuantity 
        : undefined 
    }); 
  };

  const isPouring = action.action === stepActionType.CENTER_POURING || action.action === stepActionType.SIDE_POURING;
  const actionSummary = action.action 
    ? `${actionTypeDisplayNames[action.action]}${isPouring && action.targetQuantity ? ` ${action.targetQuantity}g` : ''}${action.duration ? ` for ${action.duration}s` : ''}`
    : 'Select an Action';
  const borderColor = action.action ? actionBorderColors[action.action] : 'border-gray-300';

  if (!isSelected) {
    return (
      <div className={`rounded-xl p-2 border-2 bg-white ${borderColor} w-full`}>
        <div className="flex items-start justify-between">
          <div className="text-sm font-medium text-gray-700">
            <div className='font-bold'>
              {actionSummary}
            </div>
            <div className='text-sm text-gray-500'>
              {action.instruction}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-2 border-2 bg-white ${borderColor} w-full`}>
      <div className="flex items-start justify-between">
        <div className='font-bold text-sm'>Action</div>
        <RemoveButton onClick={onRemove} title="Remove action" />
      </div>

      <div className="w-full">
        <div className="flex flex-wrap gap-2 items-center w-full">
          {/* Action Type */}
          <select
            value={action.action || ''}
            onChange={handleActionTypeChange}
            className="p-2 block rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400 flex-shrink-0 min-w-[120px]"
          >
            <option value="">Select Action</option>
            {Object.entries(stepActionType)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <option key={key} value={value}>
                  {actionTypeDisplayNames[value as stepActionType]}
                </option>
              ))}
          </select>

          {/* Target Quantity */}
          {(action.action === stepActionType.CENTER_POURING || action.action === stepActionType.SIDE_POURING) && (
            <div className="relative flex-shrink w-[80px]">
              <input
                type="number"
                value={action.targetQuantity || ''}
                onChange={(e) => onUpdate({ 
                  ...action,
                  targetQuantity: e.target.value ? Number(e.target.value) : undefined 
                })}
                min="0"
                step="1"
                className="p-2 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400 pr-6"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <span className="text-gray-500 text-sm">g</span>
              </div>
            </div>
          )}

          {/* Duration */}
          <span className="flex-shrink-0">for</span>
          <div className="relative flex-shrink w-[80px]">
            <input
              type="number"
              value={action.duration || ''}
              onChange={(e) => onUpdate({ 
                ...action,
                duration: e.target.value ? Number(e.target.value) : undefined 
              })}
              min="0"
              className="p-2 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400 pr-8"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <span className="text-gray-500 text-sm">sec</span>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="mt-4">
          <label htmlFor="instruction" className="block text-sm font-bold text-gray-700">Instruction</label>
          <input
            type="text"
            value={action.instruction}
            onChange={(e) => onUpdate({ 
              ...action,
              instruction: e.target.value 
            })}
            placeholder="Add instruction..."
            className="p-2 block w-full rounded-md border border-gray-300 bg-white outline-none focus:border-gray-400"
          />
        </div>
      </div>
    </div>
  );
} 