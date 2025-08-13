import { Recipe } from "@/utils/schemas/Recipe";
import { useEffect, useState } from "react";

interface Props {
  recipe: Recipe;
  handleStart: () => void;
}

export default function PlayRecipePreparePage({ recipe, handleStart }: Props) {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(0);


 useEffect(() => {
  if (!isCountingDown) return;

  let currentCount = 0;

  const intervalId = setInterval(() => {
    currentCount++;
    setCountdown(currentCount);

    if (currentCount >= 3) {
      clearInterval(intervalId);
      setIsCountingDown(false);
      // ⚡ Defer `handleStart` to next tick to avoid the React warning
      setTimeout(() => {
        handleStart();
      }, 0);
    }
  }, 1000);

  return () => clearInterval(intervalId);
}, [isCountingDown, handleStart]);

  const handleStartClick = () => {
    setIsCountingDown(true); 
  };
 
 

  return (
    <div>
      <h1>Recipe Preparation</h1>
      <p>{recipe.preparation.notes || "No preparation notes"}</p>
      <button 
        onClick={handleStartClick}
        disabled={isCountingDown}
        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isCountingDown ? `Start in ${3 - countdown}...` : 'Start'}
      </button>
    </div>
  )
}