import { Step, stepActionType } from '@/utils/schemas/Recipe';

interface StepProgressProps {
  step: Step;
  vertical?: boolean;
  selectedAction?: number;
  width?: number;
  selectedWidth?: number;
}

const actionColors: Record<stepActionType, string> = {
  CENTER_POURING: 'bg-blue-500',
  SIDE_POURING: 'bg-green-500',
  STIRRING: 'bg-yellow-500',
  WAITING: 'bg-gray-500',
};


export default function StepProgress({ 
  step, 
  vertical = false, 
  selectedAction,
  width = 2,
  selectedWidth = 6
}: StepProgressProps) {
  // Calculate total duration
  const totalDuration = step.actions.reduce((sum, action) => {
    return sum + (action.duration || 0);
  }, 0);

  // If no duration data, show a gray progress bar
  if (totalDuration === 0) {
    if (vertical) {
      return (
        <div className="flex items-center gap-2">
          <div className="relative h-full w-4 flex">
            <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
              <div className="absolute top-0">
                <div className="w-1 h-px bg-gray-300" />
                <div className="text-[10px] text-gray-500 ml-1 whitespace-nowrap">0s</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full" style={{ width: `${width}px` }}>
            <div className="bg-gray-200 h-full" />
          </div>
        </div>
      );
    }
    return (
      <div className="w-full">
        <div className="flex rounded-full overflow-visible" style={{ height: `${width}px` }}>
          <div className="bg-gray-200 w-full" />
        </div>
        <div className="relative mt-1">
          <div className="absolute top-0 left-0">
            <div className="h-1 w-px bg-gray-300" />
            <div className="text-[10px] text-gray-500 mt-0.5">0s</div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate cumulative timestamps for each action
  let currentTime = 0;
  const timestamps = step.actions.map(action => {
    const timestamp = currentTime;
    currentTime += action.duration || 0;
    return timestamp;
  });
  // Add the final timestamp
  timestamps.push(totalDuration);

  if (vertical) {
    return (
      <div className="flex items-center gap-2">
        {/* Timestamp markers */}
        <div className="relative h-full w-4 flex">
          {/* Action breakpoint markers */}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
            {timestamps.map((timestamp, index) => {
              const percentage = (timestamp / totalDuration) * 100;
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{ top: `${percentage}%`, transform: 'translateY(-50%)' }}
                >
                  <div className="w-1 h-px bg-gray-300" />
                  <div className="text-[10px] text-gray-500 ml-1 whitespace-nowrap">
                    {timestamp}s
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col h-full overflow-visible" style={{ width: `${width}px` }}>
          {step.actions.map((action, index) => {
            if (!action.duration || !action.action) return null;
            
            const percentage = (action.duration / totalDuration) * 100;
            const isSelected = index === selectedAction;
            const color = actionColors[action.action];
            const currentWidth = isSelected ? selectedWidth : width;

            return (
              <div
                key={index}
                className={`${color} transition-all duration-300`}
                style={{ 
                  height: `${percentage}%`,
                  width: `${currentWidth}px`,
                  marginLeft: isSelected ? `-${(selectedWidth - width) / 2}px` : '0',
                }}
                title={`${action.action}: ${action.duration}s (${percentage.toFixed(1)}%)`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex rounded-full overflow-visible" style={{ height: `${width}px` }}>
        {step.actions.map((action, index) => {
          if (!action.duration || !action.action) return null;
          
          const percentage = (action.duration / totalDuration) * 100;
          const isSelected = index === selectedAction;
          const color = actionColors[action.action];
          const currentHeight = isSelected ? selectedWidth : width;

          return (
            <div
              key={index}
              className={`${color} transition-all duration-300`}
              style={{ 
                width: `${percentage}%`,
                height: `${currentHeight}px`,
                marginTop: isSelected ? `-${(selectedWidth - width) / 2}px` : '0',
              }}
              title={`${action.action}: ${action.duration}s (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      
      {/* Timestamp markers */}
      <div className="relative mt-1">
        {/* Action breakpoint markers */}
        <div className="absolute top-0 left-0 right-0 flex">
          {timestamps.map((timestamp, index) => {
            const percentage = (timestamp / totalDuration) * 100;
            return (
              <div
                key={index}
                className="absolute"
                style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
              >
                <div className="h-1 w-px bg-gray-300" />
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {timestamp}s
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 