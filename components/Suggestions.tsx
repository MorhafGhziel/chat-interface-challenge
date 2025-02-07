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
  return (
    <div className="h-[54px] max-w-5xl mx-auto py-4 px-2 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-6 py-2 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 flex items-center shadow-sm hover:shadow-md min-w-fit max-w-[300px] truncate"
          disabled={isLoading}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
