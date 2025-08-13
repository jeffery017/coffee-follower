import { Recipe } from "@/utils/schemas/Recipe";
import { useEffect, useState } from "react";

interface Props {
  recipe: Recipe; 
  currentTime: number;
  handleFinish: () => void;
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60); 
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


export default function PlayRecipeProgressPage({ recipe, currentTime, handleFinish }: Props) {
  const [targetTime, setTargetTime] = useState(currentTime+30);
  const [startTimer, setStartTimer] = useState(currentTime); 
  const [targetGram, setTargetGram] = useState(0);
  const [startGram, setStartGram] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [actionIndex, setActionIndex] = useState(0);


  const progressRatio = (currentTime - startTimer) / (targetTime - startTimer);
  const idealGram = (recipe.steps[stepIndex].actions[actionIndex].weight ?? 0) * progressRatio + startGram;

  
  const nextAction = () => {
    
    if (actionIndex < recipe.steps[stepIndex].actions.length - 1) {
      setActionIndex(actionIndex + 1);
    } else {
      if (stepIndex < recipe.steps.length - 1) {
        setStepIndex(stepIndex + 1);
        setActionIndex(0);
      } else {
        handleFinish();
        return;
      }
    }
  }


  useEffect(() => {
    if (progressRatio >= 1) {
      nextAction();
    } else {
      setStartTimer(currentTime);
      setTargetTime(currentTime + (recipe.steps[stepIndex].actions[actionIndex].duration ?? 0));
      setStartGram(targetGram);
      setTargetGram(targetGram + (recipe.steps[stepIndex].actions[actionIndex].weight ?? 0));
    }
  }, [progressRatio, stepIndex, actionIndex]);


  const actionProgressRatio = (actionIndex: number) => {
    if (actionIndex < stepIndex) {
      return 1;
    } else if (actionIndex > stepIndex) {
      return 0;
    } else {
      return progressRatio;
    }
  }
 

  return (
    <div>
      <h1>Recipe Progress</h1>
      <p>Step {stepIndex + 1} of {recipe.steps.length} / Action {actionIndex + 1} of {recipe.steps[stepIndex].actions.length}</p>
      <p>Current Time: {formatTime( currentTime)}</p> 
      <p>Target Time: {formatTime(targetTime)}</p>
      
      {
        recipe.steps[stepIndex].actions.map((action, index) => (
          <div key={index}>
            <p>Action {index + 1} of {recipe.steps[stepIndex].actions.length}</p>
            <div className="flex w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: `${actionProgressRatio(index) * 100}%` }}></div>
            </div>
          </div>
        ))
      }
      <p>Progress Ratio: {(progressRatio*100).toFixed(2)}%</p>
      <p>{recipe.steps[stepIndex].instruction}</p>
      <p>Gram: {idealGram.toFixed(0)} / {(targetGram).toFixed(0)}</p>
      <button 
        onClick={nextAction}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
      >
        Continue
      </button>
    </div>
  )
}