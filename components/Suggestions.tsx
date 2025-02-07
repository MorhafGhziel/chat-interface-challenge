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
  // Show only 2 suggestions on mobile, 3 on desktop
  const displayedSuggestions = suggestions.slice(
    0,
    window.innerWidth < 640 ? 2 : 3
  );

  return (
    <div className="h-[54px] max-w-5xl mx-auto py-2 sm:py-4 px-2 flex items-center justify-center gap-3">
      {displayedSuggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 sm:px-6 py-1.5 sm:py-2 bg-gray-100 text-xs sm:text-sm text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 flex-1 sm:flex-initial shadow-sm hover:shadow-md max-w-[160px] sm:max-w-[300px] text-ellipsis overflow-hidden whitespace-nowrap"
          disabled={isLoading}
          title={suggestion}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
