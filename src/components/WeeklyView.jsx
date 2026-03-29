import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayRow from './DayRow';
import {
  getWeekStart, getWeekDays, formatDateKey, formatWeekRange, isToday,
} from '../utils/dateUtils';

/*
 * mode="wait" → exit が完全に終わってから enter が始まる
 * → 「パタン」とめくれる 2 フェーズが明確に見える
 *
 * perspective: 600px (小さいほど遠近感が強くなる)
 * rotateY ±90° → ページが真横を向いてから入れ替わる
 * opacity は 0.7 (透明にしすぎず回転を見せる)
 */
const pageVariants = {
  initial: (dir) => ({
    rotateY: dir === 'next' ? 90 : -90,
    opacity: 0.7,
  }),
  animate: {
    rotateY: 0,
    opacity: 1,
    transition: {
      rotateY: { duration: 0.52, ease: [0.215, 0.61, 0.355, 1] }, // easeOutCubic — やわらかく着地
      opacity:  { duration: 0.25 },
    },
  },
  exit: (dir) => ({
    rotateY: dir === 'next' ? -90 : 90,
    opacity: 0.7,
    transition: {
      rotateY: { duration: 0.38, ease: [0.55, 0.055, 0.675, 0.19] }, // easeInCubic — 最初重く後半スナップ
      opacity:  { duration: 0.22, delay: 0.12 },
    },
  }),
};

export default function WeeklyView({ getEntry, onDayClick, onPageTurn }) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [dir, setDir]             = useState('next');
  const [key, setKey]             = useState(0);
  const [flipping, setFlipping]   = useState(false);
  const [navHover, setNavHover]   = useState(null);
  const touchStartX               = useRef(null);
  const flipTimer                 = useRef(null);

  const weekDays = getWeekDays(weekStart);

  // ── 共通ナビ処理 ──
  const navigate = (fn) => {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    setFlipping(true);
    fn();
    onPageTurn?.();
    // exit (0.38s + 0.12s delay) + enter (0.52s) ≈ 1.0s
    flipTimer.current = setTimeout(() => setFlipping(false), 1050);
  };

  const goNext = () => navigate(() => {
    const d = new Date(weekStart); d.setDate(d.getDate() + 7);
    setDir('next'); setKey(k => k + 1); setWeekStart(d);
  });
  const goPrev = () => navigate(() => {
    const d = new Date(weekStart); d.setDate(d.getDate() - 7);
    setDir('prev'); setKey(k => k + 1); setWeekStart(d);
  });

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  };

  return (
    <div
      style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        /* ↓ 遠近感: 600px は画面の幅程度 → 3D が強調される */
        perspective: '600px',
        perspectiveOrigin: 'center 40%',
      }}
    >
      {/* Notebook card */}
      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          borderRadius: '16px',
          boxShadow: '4px 8px 32px rgba(93,64,55,0.22), 0 1px 0 rgba(212,167,106,0.4)',
          marginTop: '10px', marginBottom: '10px',
          background: '#fdfaf5',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── 週ナビ (フリップしない) ── */}
        <div
          style={{
            display: 'flex', flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'nowrap',
            padding: '4px 12px',
            borderBottom: '1.5px solid rgba(212,167,106,0.4)',
            background: '#fdfaf5',
            flexShrink: 0, position: 'relative', zIndex: 10,
          }}
        >
          <motion.button
            onClick={goPrev}
            onHoverStart={() => setNavHover('prev')}
            onHoverEnd={() => setNavHover(null)}
            whileTap={{ scale: 0.88 }}
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

          <motion.button
            onClick={goNext}
            onHoverStart={() => setNavHover('next')}
            onHoverEnd={() => setNavHover(null)}
            whileTap={{ scale: 0.88 }}
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

        {/* ── 3-D フリップステージ ── */}
        <div
          style={{ flex: 1, position: 'relative' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/*
           * mode="wait" → exit が終わってから next の initial → animate が走る
           * これにより「パタン」の 2 フェーズが視覚的に明確になる
           */}
          <AnimatePresence mode="wait" custom={dir} initial={false}>
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
                /* transformOrigin を左 or 右に寄せるとより「本」らしくなる */
                transformOrigin: dir === 'next' ? 'left center' : 'right center',
                /* ↓ 子要素まで 3D を継承 */
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Day rows */}
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

              {/* ページ裏面の影 (回転中にページ端が暗くなる) */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background:
                    dir === 'next'
                      ? 'linear-gradient(to left,  rgba(93,64,55,0.18) 0%, transparent 30%)'
                      : 'linear-gradient(to right, rgba(93,64,55,0.18) 0%, transparent 30%)',
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* ── フリップ中の折り目シャドウ ──
               ページがめくれているときだけ中央に暗い線が走る */}
          <AnimatePresence>
            {flipping && (
              <motion.div
                key="fold-shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, times: [0, 0.4, 1], ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none',
                  background:
                    'radial-gradient(ellipse 12% 100% at 50% 50%, rgba(93,64,55,0.35) 0%, transparent 100%)',
                }}
              />
            )}
          </AnimatePresence>

          {/* ── コーナーカール (ホバー時) ── */}
          <AnimatePresence>
            {navHover === 'prev' && (
              <motion.div key="curl-l"
                initial={{ width: 0, height: 0 }} animate={{ width: 32, height: 32 }} exit={{ width: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 20, pointerEvents: 'none',
                  background: 'linear-gradient(135deg, #c8994a 50%, transparent 50%)',
                  boxShadow: '3px -3px 6px rgba(93,64,55,0.2)' }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {navHover === 'next' && (
              <motion.div key="curl-r"
                initial={{ width: 0, height: 0 }} animate={{ width: 32, height: 32 }} exit={{ width: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20, pointerEvents: 'none',
                  background: 'linear-gradient(225deg, #c8994a 50%, transparent 50%)',
                  boxShadow: '-3px -3px 6px rgba(93,64,55,0.2)' }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
