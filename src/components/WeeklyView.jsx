import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayRow from './DayRow';
import {
  getWeekStart, getWeekDays, formatDateKey, formatWeekRange, isToday,
} from '../utils/dateUtils';

const variants = {
  next: {
    initial:  { rotateY: 80, opacity: 0, x: 30 },
    animate:  { rotateY: 0,  opacity: 1, x: 0  },
    exit:     { rotateY: -80, opacity: 0, x: -30 },
  },
  prev: {
    initial:  { rotateY: -80, opacity: 0, x: -30 },
    animate:  { rotateY: 0,   opacity: 1, x: 0   },
    exit:     { rotateY: 80,  opacity: 0, x: 30  },
  },
};

export default function WeeklyView({ getEntry, onDayClick }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [dir, setDir] = useState('next');
  const [key, setKey] = useState(0);
  const touchStartX = useRef(null);

  const weekDays = getWeekDays(weekStart);

  const goNext = () => {
    const d = new Date(weekStart); d.setDate(d.getDate() + 7);
    setDir('next'); setKey(k => k + 1); setWeekStart(d);
  };
  const goPrev = () => {
    const d = new Date(weekStart); d.setDate(d.getDate() - 7);
    setDir('prev'); setKey(k => k + 1); setWeekStart(d);
  };
  const goToday = () => {
    const t = getWeekStart(new Date());
    setDir(t > weekStart ? 'next' : 'prev');
    setKey(k => k + 1); setWeekStart(t);
  };

  /* Swipe support */
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  };

  const v = variants[dir];

  return (
    <div className="w-full max-w-lg mx-auto" style={{ perspective: '1400px' }}>

      {/* Title row */}
      {/* Notebook card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ boxShadow: '4px 8px 28px rgba(93,64,55,0.18)' }}
      >
        {/* Page */}
        <div style={{ background: '#fdfaf5' }}>

          {/* Week nav */}
          <div
            style={{
              display: 'flex', flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'nowrap',
              padding: '4px 12px', borderBottom: '1.5px solid rgba(212,167,106,0.4)',
            }}
          >
            <button
              onClick={goPrev}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '2px',
                fontSize: '13px', color: '#8d6035', whiteSpace: 'nowrap',
                padding: '6px 10px', borderRadius: '10px',
                fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
                minHeight: '44px', background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              <ChevronLeft size={15} />前週
            </button>

            <div
              style={{
                fontFamily: '"Caveat", cursive',
                fontSize: '17px',
                color: '#5d4037',
                textAlign: 'center',
                flex: 1,
              }}
            >
              {formatWeekRange(weekStart)}
            </div>

            <button
              onClick={goNext}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '2px',
                fontSize: '13px', color: '#8d6035', whiteSpace: 'nowrap',
                padding: '6px 10px', borderRadius: '10px',
                fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
                minHeight: '44px', background: 'transparent', border: 'none', cursor: 'pointer',
              }}
            >
              次週<ChevronRight size={15} />
            </button>
          </div>

          {/* Days — swipeable */}
          <div
            className="swipe-zone"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ overflowX: 'hidden' }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={key}
                initial={v.initial}
                animate={v.animate}
                exit={v.exit}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.7 }}
                style={{ transformPerspective: 1400, transformOrigin: 'center center' }}
              >
                {weekDays.map((day, i) => {
                  const dk = formatDateKey(day);
                  return (
                    <DayRow
                      key={dk}
                      date={day}
                      entry={getEntry(dk)}
                      isToday={isToday(day)}
                      onClick={() => onDayClick(day)}
                      index={i}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer hint */}
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{ borderTop: '1px solid rgba(212,167,106,0.2)' }}
          >
            <span style={{ fontSize: '11px', color: '#b8834a', opacity: 0.7 }}>
              タップして日記を書こう 🍯
            </span>
            <span style={{ fontSize: '14px' }}>🐾</span>
          </div>
        </div>
      </div>
    </div>
  );
}
