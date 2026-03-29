import React, { useState } from 'react';

export default function PawButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
}) {
  const [pressed, setPressed] = useState(false);

  const base =
    'paw-btn inline-flex items-center gap-1.5 font-rounded font-medium transition-all duration-150 select-none rounded-full border';

  const variants = {
    primary:
      'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-md hover:shadow-lg active:shadow-sm',
    secondary:
      'bg-ivory-100 hover:bg-ivory-200 text-brown-700 border-brown-300 shadow-sm hover:shadow active:shadow-none',
    ghost:
      'bg-transparent hover:bg-amber-50 text-brown-600 border-transparent hover:border-amber-200',
    danger:
      'bg-red-400 hover:bg-red-500 text-white border-red-500 shadow-md hover:shadow-lg',
  };

  const sizes = 'px-4 py-2 text-sm';

  const handleClick = (e) => {
    if (disabled) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 300);
    onClick?.(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`${base} ${variants[variant]} ${sizes} ${className} ${
        pressed ? 'scale-95' : 'scale-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif' }}
    >
      {/* Small paw accent */}
      <span className="text-xs opacity-70">🐾</span>
      {children}
    </button>
  );
}
