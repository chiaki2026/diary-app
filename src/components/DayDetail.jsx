import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { DAYS_JA, formatDateKey } from '../utils/dateUtils';

export default function DayDetail({ date, entry, onSave, onClose }) {
  const [text, setText]   = useState(entry?.text || '');
  const [saved, setSaved] = useState(false);
  const textRef = useRef(null);

  /* Auto-save on unmount */
  const textRef2 = useRef(text);
  useEffect(() => { textRef2.current = text; }, [text]);
  useEffect(() => () => {
    onSave(formatDateKey(date), { text: textRef2.current });
  }, []); // eslint-disable-line

  const handleSave = useCallback(() => {
    onSave(formatDateKey(date), { text });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [date, text, onSave]);

  useEffect(() => {
    const t = setTimeout(() => textRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const dayLabel = `${date.getMonth() + 1}月${date.getDate()}日（${DAYS_JA[date.getDay()]}）`;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(93,64,55,0.32)', backdropFilter: 'blur(3px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Notebook panel — slides up from bottom */}
      <motion.div
        className="fixed z-50"
        style={{
          left: 0, right: 0, bottom: 0,
          maxHeight: '92dvh',
          paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex',
          flexDirection: 'column',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >
        <div
          style={{
            background: '#fdfaf5',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -6px 32px rgba(93,64,55,0.22)',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
            <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(212,167,106,0.5)' }} />
          </div>

          {/* Content */}
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: '12px', paddingBottom: '10px',
              borderBottom: '1px solid rgba(212,167,106,0.35)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={17} color="#b8834a" />
                <h2 style={{
                  fontFamily: '"Caveat", cursive', fontSize: '22px',
                  fontWeight: 600, color: '#5d4037', lineHeight: 1,
                }}>
                  {dayLabel}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  borderRadius: '50%', padding: '6px', color: '#8d6035',
                  background: 'transparent',
                  minWidth: '36px', minHeight: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', paddingTop: '12px', paddingBottom: '8px' }}>
              <div>
                <div style={{
                  borderRadius: '14px', overflow: 'hidden',
                  border: '1px solid rgba(212,167,106,0.4)', background: '#fffef8',
                }}>
                  <textarea
                    ref={textRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={'今日はどんな一日でしたか？\n\nプーが聞いているよ... 🍯'}
                    rows={11}
                    className="lined-paper"
                    style={{
                      padding: '14px', width: '100%',
                      fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
                      color: '#5d4037', fontSize: '15px',
                      lineHeight: '32px', minHeight: '355px',
                    }}
                  />
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#b8834a', marginTop: '4px' }}>
                  {text.length} 文字
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0 12px',
              borderTop: '1px solid rgba(212,167,106,0.28)',
              flexShrink: 0,
            }}>
              <button
                onClick={onClose}
                style={{
                  fontSize: '14px', padding: '8px 16px', borderRadius: '20px',
                  color: '#8d6035', background: 'transparent',
                  fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
                  minHeight: '44px',
                }}
              >
                閉じる
              </button>
              <button
                onClick={handleSave}
                className="paw-btn"
                style={{
                  fontSize: '14px', fontWeight: 500,
                  padding: '10px 22px', borderRadius: '22px',
                  background: saved ? '#6aaa64' : '#e8953a',
                  color: 'white',
                  fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
                  border: 'none', boxShadow: '0 3px 10px rgba(232,149,58,0.35)',
                  minHeight: '44px',
                  transition: 'background 0.25s',
                }}
              >
                🍯 {saved ? '保存しました ✓' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
