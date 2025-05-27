interface Props { 
  size?: number | string; // Accepts a number (pixels) or a string (e.g. '2rem', '24px')
  className?: string;
}

export default function MinusButton({  size = 16, className }: Props) {
  const style = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
  };
  const iconSize = typeof size === 'number' ? size * 0.6 : '60%';

  return (
    <div
      className={`shrink-0 flex items-center justify-center border border-background rounded-full ${className}`}
      style={style} 
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block' }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  );
}