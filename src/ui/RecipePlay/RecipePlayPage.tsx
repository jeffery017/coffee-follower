"use client";
import { Recipe } from "@/utils/schemas/Recipe";
import { useEffect, useState } from "react";
import PlayRecipeFinishedPage from "./pages/PlayRecipeFinishedPage";
import PlayRecipePreparePage from "./pages/PlayRecipePreparePage";
import PlayRecipeProgressPage from "./pages/PlayRecipeProgressPage";

/*
  PlayState:
    PREPARE: 
      - Show the recipe preparation note
      - Start Button
    PLAYING: 
      - Action instruction
      - Current/Target Time
      - Current/Target gram 
      - Continue Button
    FINISHED:
      - Review Form
 */

interface Props {
    recipe: Recipe;
}

export enum PlayState {
  PREPARE,
  PROGRESS,
  FINISHED,
}

export default function RecipePlayPage({ recipe }: Props) { 
  const [time, setTime] = useState<number>(0);
  const [playState, setPlayState] = useState<PlayState>(PlayState.PREPARE);
  
 


  const handleStart = () => {
    setPlayState(PlayState.PROGRESS);
  };

  const handleFinish = () => { 
    setPlayState(PlayState.FINISHED);
    
  };

  // use effect to handle the timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (playState === PlayState.PROGRESS) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 0.1);
      }, 100);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [playState]);

  return (
    <div> 
      {playState === PlayState.PREPARE && (
        <PlayRecipePreparePage 
        recipe={recipe} 
        handleStart={handleStart}
      />
      )}
      {playState === PlayState.PROGRESS && (
        <PlayRecipeProgressPage 
          recipe={recipe} 
          currentTime={time}
          handleFinish={handleFinish}
        />
      )}
      {playState === PlayState.FINISHED && (
        <PlayRecipeFinishedPage 
          recipe={recipe} 
        />
      )}
    </div>
  );
}
