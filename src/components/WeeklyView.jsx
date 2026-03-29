import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayRow from './DayRow';
import {
  getWeekStart, getWeekDays, formatDateKey, formatWeekRange, isToday,
} from '../utils/dateUtils';

// Direction-aware variants using custom prop
const pageVariants = {
  initial: (dir) => ({
    rotateY: dir === 'next' ? 72 : -72,
    opacity: 0,
    scale: 0.96,
    x: dir === 'next' ? 16 : -16,
  }),
  animate: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      rotateY: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },   // easeOutExpo — paper settles gently
      opacity:  { duration: 0.25 },
      scale:    { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
      x:        { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
    },
  },
  exit: (dir) => ({
    rotateY: dir === 'next' ? -72 : 72,
    opacity: 0,
    scale: 0.96,
    x: dir === 'next' ? -16 : 16,
    transition: {
      rotateY: { duration: 0.38, ease: [0.4, 0, 0.9, 0.6] },  // resists at first, then snaps
      opacity:  { duration: 0.22, delay: 0.1 },
      scale:    { duration: 0.38 },
      x:        { duration: 0.35 },
    },
  }),
};

export default function WeeklyView({ getEntry, onDayClick }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [dir, setDir]             = useState('next');
  const [key, setKey]             = useState(0);
  const [navHover, setNavHover]   = useState(null); // 'next' | 'prev' | null
  const touchStartX               = useRef(null);

  const weekDays = getWeekDays(weekStart);

  const goNext = () => {
    const d = new Date(weekStart); d.setDate(d.getDate() + 7);
    setDir('next'); setKey(k => k + 1); setWeekStart(d);
  };
  const goPrev = () => {
    const d = new Date(weekStart); d.setDate(d.getDate() - 7);
    setDir('prev'); setKey(k => k + 1); setWeekStart(d);
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', perspective: '1200px' }}>

      {/* Notebook card */}
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          borderRadius: '16px',
          boxShadow: '4px 8px 32px rgba(93,64,55,0.20), 0 1px 0 rgba(212,167,106,0.4)',
          marginTop: '10px', marginBottom: '10px',
          background: '#fdfaf5',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Week nav (stays fixed, does NOT flip) ── */}
        <div
          style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'nowrap',
            padding: '4px 12px',
            borderBottom: '1.5px solid rgba(212,167,106,0.4)',
            background: '#fdfaf5',
            flexShrink: 0,
            position: 'relative', zIndex: 10,
          }}
        >
          {/* 前週 button */}
          <motion.button
            onClick={goPrev}
            onHoverStart={() => setNavHover('prev')}
            onHoverEnd={() => setNavHover(null)}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '2px',
              fontSize: '13px', color: '#8d6035', whiteSpace: 'nowrap',
              padding: '6px 10px', borderRadius: '10px',
              fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
              minHeight: '44px', background: 'transparent', border: 'none', cursor: 'pointer',
            }}
          >
            <ChevronLeft size={15} />前週
          </motion.button>

          <div style={{ fontFamily: '"Caveat", cursive', fontSize: '17px', color: '#5d4037', textAlign: 'center', flex: 1 }}>
            {formatWeekRange(weekStart)}
          </div>

          {/* 次週 button */}
          <motion.button
            onClick={goNext}
            onHoverStart={() => setNavHover('next')}
            onHoverEnd={() => setNavHover(null)}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '2px',
              fontSize: '13px', color: '#8d6035', whiteSpace: 'nowrap',
              padding: '6px 10px', borderRadius: '10px',
              fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
              minHeight: '44px', background: 'transparent', border: 'none', cursor: 'pointer',
            }}
          >
            次週<ChevronRight size={15} />
          </motion.button>
        </div>

        {/* ── 3-D flip stage ── */}
        <div
          style={{ flex: 1, position: 'relative', transformStyle: 'preserve-3d' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Concurrent flip: old exits while new enters */}
          <AnimatePresence custom={dir} initial={false}>
            <motion.div
              key={key}
              custom={dir}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                background: '#fdfaf5',
                transformOrigin: 'center center',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Day rows */}
              {weekDays.map((day, i) => (
                <DayRow
                  key={formatDateKey(day)}
                  date={day}
                  entry={getEntry(formatDateKey(day))}
                  isToday={isToday(day)}
                  onClick={() => onDayClick(day)}
                  index={i}
                />
              ))}

              {/* Paper-edge depth shadow (spine side) */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background:
                    'linear-gradient(to right, rgba(93,64,55,0.07) 0%, transparent 6%, transparent 94%, rgba(93,64,55,0.05) 100%)',
                }}
              />

              {/* Back-face tint (visible mid-rotation via preserve-3d) */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #f0e3c0 0%, #e8d5a8 100%)',
                  transform: 'rotateY(180deg)',
                  borderRadius: 'inherit',
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* ── Corner curl — left (前週 hover) ── */}
          <AnimatePresence>
            {navHover === 'prev' && (
              <motion.div
                key="curl-left"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: 30, height: 30, opacity: 1 }}
                exit={{ width: 0, height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, zIndex: 20,
                  pointerEvents: 'none',
                  background: 'linear-gradient(135deg, #c8994a 50%, transparent 50%)',
                  transformOrigin: 'bottom left',
                  boxShadow: '2px -2px 5px rgba(93,64,55,0.18)',
                }}
              />
            )}
          </AnimatePresence>

          {/* ── Corner curl — right (次週 hover) ── */}
          <AnimatePresence>
            {navHover === 'next' && (
              <motion.div
                key="curl-right"
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{ width: 30, height: 30, opacity: 1 }}
                exit={{ width: 0, height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                style={{
                  position: 'absolute', bottom: 0, right: 0, zIndex: 20,
                  pointerEvents: 'none',
                  background: 'linear-gradient(225deg, #c8994a 50%, transparent 50%)',
                  transformOrigin: 'bottom right',
                  boxShadow: '-2px -2px 5px rgba(93,64,55,0.18)',
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
