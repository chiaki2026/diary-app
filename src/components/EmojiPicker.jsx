import React from 'react';

export const WEATHER_OPTIONS = [
  { value: 'sunny',   emoji: '☀️',  label: '晴れ' },
  { value: 'cloudy',  emoji: '☁️',  label: '曇り' },
  { value: 'rainy',   emoji: '🌧️', label: '雨' },
  { value: 'snowy',   emoji: '❄️',  label: '雪' },
  { value: 'storm',   emoji: '⛈️', label: '嵐' },
  { value: 'rainbow', emoji: '🌈',  label: '虹' },
];

export const MOOD_OPTIONS = [
  { value: 'happy',     emoji: '😊', label: '嬉しい' },
  { value: 'excited',   emoji: '🥰', label: 'ときめき' },
  { value: 'calm',      emoji: '😌', label: 'おだやか' },
  { value: 'tired',     emoji: '😴', label: '眠い' },
  { value: 'sad',       emoji: '😢', label: '悲しい' },
  { value: 'angry',     emoji: '😤', label: 'もやもや' },
  { value: 'surprised', emoji: '😲', label: 'びっくり' },
  { value: 'thinking',  emoji: '🤔', label: '考え中' },
];

export default function EmojiPicker({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        fontSize: '11px', fontWeight: 500, marginBottom: '6px',
        color: '#8d6035', fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            title={opt.label}
            onClick={() => onChange(value === opt.value ? '' : opt.value)}
            className={`emoji-opt${value === opt.value ? ' selected' : ''}`}
            style={{ fontSize: '20px' }}
          >
            {opt.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
