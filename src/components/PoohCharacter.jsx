import React, { useState } from 'react';

export default function PoohCharacter({ onClick }) {
  const [happy, setHappy] = useState(false);

  const handleClick = () => {
    setHappy(true);
    setTimeout(() => setHappy(false), 900);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      title="プー"
      style={{
        position: 'fixed',
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        right: '14px',
        zIndex: 50,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        className="cat-float"
        style={{
          transition: 'transform 0.15s ease',
          transform: happy ? 'scale(1.12)' : 'scale(1)',
        }}
      >
        <img
          src="/pooh.png"
          alt="プー"
          style={{
            width: '72px',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}
