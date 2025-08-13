import { Recipe } from "@/utils/schemas/Recipe";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  recipe: Recipe;
}

export default function PlayRecipeFinishedPage({ recipe }: Props) {
  const [review, setReview] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(review);
    router.push(`/recipes/${recipe.id}`);
  }
  return (
    <div>
      <h1>Recipe Finished</h1>
      <form onSubmit={handleSubmit}>
        <textarea id="review" placeholder="review" value={review} onChange={(e) => setReview(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}