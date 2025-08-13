'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { KeyboardEvent, useState } from 'react';

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  editMode?: boolean;
  placeholder?: string;
}

export default function TagInput({ tags = [], onChange, editMode = true, placeholder = 'Add tag...' }: Props) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().toUpperCase();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };
 

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary uppercase"
        >
          {tag}
          {editMode && (
            <button
              type="button"
              onClick={() => removeTag(tag)} 
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </span>
      ))} 
        {editMode && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="px-2 py-1 w-auto rounded-full bg-gray-100 border-none outline-none uppercase placeholder:text-primary/15 text-sm"
            // @ts-ignore
            style={{ fieldSizing: 'content' }}
          /> 
        )}  
    </div>
  );
} 