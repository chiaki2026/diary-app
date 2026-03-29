import React, { useState } from 'react';

export default function NyanskyCat({ onClick }) {
  const [happy, setHappy] = useState(false);

  const handleClick = () => {
    setHappy(true);
    setTimeout(() => setHappy(false), 900);
    onClick?.();
  };

  return (
    <div
      onClick={handleClick}
      title="ニャンスキー"
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
      <div className="cat-float">
        <svg width="72" height="82" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(93,64,55,0.22))' }}>

          {/* Tail */}
          <g className="cat-tail" style={{ transformOrigin: '22px 68px' }}>
            <path d="M22 68 Q6 62 9 50 Q11 41 19 44"
              stroke="#c97a2f" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
          </g>

          {/* Body */}
          <ellipse cx="40" cy="65" rx="24" ry="20" fill="#e8953a"/>
          <ellipse cx="40" cy="68" rx="14" ry="13" fill="#f5c97e"/>

          {/* Body stripes */}
          <path d="M30 55 Q34 60 30 66" stroke="#c97a2f" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5"/>
          <path d="M50 55 Q46 60 50 66" stroke="#c97a2f" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5"/>

          {/* Head */}
          <ellipse cx="40" cy="38" rx="22" ry="20" fill="#e8953a"/>

          {/* Left ear */}
          <polygon points="18,25 13,8 26,20" fill="#e8953a"/>
          <polygon points="19,24 15,12 25,20" fill="#f4a0a0"/>
          {/* Right ear */}
          <polygon points="62,25 67,8 54,20" fill="#e8953a"/>
          <polygon points="61,24 65,12 55,20" fill="#f4a0a0"/>

          {/* Forehead stripes */}
          <path d="M33 22 Q40 18 47 22" stroke="#c97a2f" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.45"/>

          {/* Eyes */}
          {happy ? (
            <>
              {/* Happy ^_^ eyes */}
              <path d="M28 38 Q32 33 36 38" stroke="#2d5a1b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              <path d="M44 38 Q48 33 52 38" stroke="#2d5a1b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </>
          ) : (
            <>
              <g className="cat-eye" style={{ transformOrigin: '32px 38px' }}>
                <ellipse cx="32" cy="38" rx="5" ry="5.5" fill="#2d5a1b"/>
                <ellipse cx="32" cy="38" rx="3" ry="4" fill="#1a3a0f"/>
                <circle cx="34" cy="36" r="1.5" fill="white"/>
              </g>
              <g className="cat-eye" style={{ transformOrigin: '48px 38px' }}>
                <ellipse cx="48" cy="38" rx="5" ry="5.5" fill="#2d5a1b"/>
                <ellipse cx="48" cy="38" rx="3" ry="4" fill="#1a3a0f"/>
                <circle cx="50" cy="36" r="1.5" fill="white"/>
              </g>
            </>
          )}

          {/* Nose */}
          <polygon points="37,45 40,42 43,45" fill="#f4a0a0"/>
          {/* Mouth */}
          {happy
            ? <path d="M36 47 Q40 53 44 47" stroke="#c97a2f" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            : <path d="M37 47 Q40 50 43 47" stroke="#c97a2f" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
          }

          {/* Whiskers */}
          <line x1="17" y1="43" x2="33" y2="45" stroke="#5d4037" strokeWidth="0.9" strokeLinecap="round" opacity="0.65"/>
          <line x1="15" y1="47" x2="33" y2="47" stroke="#5d4037" strokeWidth="0.9" strokeLinecap="round" opacity="0.65"/>
          <line x1="63" y1="43" x2="47" y2="45" stroke="#5d4037" strokeWidth="0.9" strokeLinecap="round" opacity="0.65"/>
          <line x1="65" y1="47" x2="47" y2="47" stroke="#5d4037" strokeWidth="0.9" strokeLinecap="round" opacity="0.65"/>

          {/* Front paws */}
          <ellipse cx="28" cy="83" rx="9" ry="5.5" fill="#e8953a"/>
          <ellipse cx="52" cy="83" rx="9" ry="5.5" fill="#e8953a"/>
          {/* Left toes */}
          {[23,27,31].map((x,i) => (
            <ellipse key={i} cx={x} cy="86.5" rx="2" ry="1.8" fill="#c97a2f" opacity="0.65"/>
          ))}
          {/* Right toes */}
          {[47,51,55].map((x,i) => (
            <ellipse key={i} cx={x} cy="86.5" rx="2" ry="1.8" fill="#c97a2f" opacity="0.65"/>
          ))}

          {/* Sparkles when happy */}
          {happy && (
            <>
              <text x="60" y="18" fontSize="11" fill="#f4c261">✨</text>
              <text x="3"  y="18" fontSize="11" fill="#f4c261">✨</text>
            </>
          )}
        </svg>
      </div>

      <div style={{
        textAlign: 'center', fontSize: '10px',
        padding: '2px 8px', borderRadius: '10px',
        background: 'rgba(232,149,58,0.15)', color: '#8d6035',
        marginTop: '2px',
      }}>
        ニャンスキー
      </div>
    </div>
  );
}
