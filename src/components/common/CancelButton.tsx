interface RemoveButtonProps {
  title?: string;
  size?: number | string; // Accepts a number (pixels) or a string (e.g. '2rem', '24px')
  className?: string;
}

export default function RemoveButton({ title = "Remove", size = 16, className = "" }: RemoveButtonProps) {
  const style = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
  };
  const iconSize = typeof size === 'number' ? size * 0.6 : '60%';

  return (
    <div
      className={`border-gray-200 text-gray-500 ${className}`}
      title={title}
      style={style}
    >
      <svg 
        width={iconSize}
        height={iconSize}
        viewBox="0 0 20 20" 
        fill="currentColor"
        style={{ display: 'block' }}
      >
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  );
} 