"use client";

import { useState, useEffect } from "react";

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
}

export default function Suggestions({
  suggestions,
  onSuggestionClick,
  isLoading,
}: SuggestionsProps) {
  const [displayedSuggestions, setDisplayedSuggestions] = useState<string[]>(
    []
  );

  useEffect(() => {
    // Update suggestions based on window width
    const updateSuggestions = () => {
      const count = window.innerWidth < 640 ? 2 : 3;
      setDisplayedSuggestions(suggestions.slice(0, count));
    };

    // Initial update
    updateSuggestions();

    // Add resize listener
    window.addEventListener("resize", updateSuggestions);

    // Cleanup
    return () => window.removeEventListener("resize", updateSuggestions);
  }, [suggestions]);

  return (
    <div className="h-[54px] max-w-5xl mx-auto py-2 sm:py-4 px-2 flex items-center justify-center gap-3">
      {displayedSuggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 sm:px-6 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 text-xs sm:text-sm text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-250 flex-1 sm:flex-initial shadow-sm hover:shadow-md max-w-[160px] sm:max-w-[300px] text-ellipsis overflow-hidden whitespace-nowrap"
          disabled={isLoading}
          title={suggestion}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
