interface RemoveButtonProps {
  onClick: () => void;
  title?: string;
  className?: string;
}

export default function RemoveButton({ onClick, title = "Remove", className = "" }: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-gray-200 text-gray-500 ${className}`}
      title={title}
    >
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  );
} 