import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayRow from './DayRow';
import {
  getWeekStart, getWeekDays, formatDateKey, formatWeekRange, isToday,
} from '../utils/dateUtils';

export default function WeeklyView({ getEntry, onDayClick }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [dir, setDir]             = useState('next');
  const [key, setKey]             = useState(0);
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

      {/* Notebook card */}
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '4px 8px 28px rgba(93,64,55,0.18)',
          marginTop: '10px', marginBottom: '10px',
          background: '#fdfaf5',
          position: 'relative',
        }}
      >
        {/* Week nav */}
        <div
          style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'nowrap',
            padding: '4px 12px',
            borderBottom: '1.5px solid rgba(212,167,106,0.4)',
            flexShrink: 0,
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

          <div style={{ fontFamily: '"Caveat", cursive', fontSize: '17px', color: '#5d4037', textAlign: 'center', flex: 1 }}>
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

        {/* Days */}
        <div
          style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={key}
              custom={dir}
              initial={{ opacity: 0, x: dir === 'next' ? 40 : -40 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
              exit={{ opacity: 0, x: dir === 'next' ? -40 : 40, transition: { duration: 0.2, ease: 'easeIn' } }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
            >
              {weekDays.map((day, i) => (
                <DayRow
                  key={`${weekStart.getTime()}-${formatDateKey(day)}`}
                  date={day}
                  entry={getEntry(formatDateKey(day))}
                  isToday={isToday(day)}
                  onClick={() => onDayClick(day)}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
