import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WeeklyView from './components/WeeklyView';
import DayDetail from './components/DayDetail';
import PoohCharacter from './components/PoohCharacter';
import { useDiary } from './hooks/useDiary';
import { formatDateKey } from './utils/dateUtils';

const POOH_MESSAGES = [
  'おなかがすいたな... でも日記も書こう🍯',
  'ずっとここにいるよ。書いてみて✨',
  'ハチミツのことを書いてもいいんだよ🐝',
  'きょうはどんな一日だったの？',
  'ぼくと一緒に思い出を残そう📝',
  'おいしいものを食べたかい？🍯',
  'そっと、思ったことを書けばいいんだ',
];

export default function App() {
  const { diary, getEntry, setEntry } = useDiary();
  const [selectedDate, setSelectedDate] = useState(null);
  const [poohMessage, setPoohMessage]   = useState('');

  const handlePoohClick = () => {
    const msg = POOH_MESSAGES[Math.floor(Math.random() * POOH_MESSAGES.length)];
    setPoohMessage(msg);
    setTimeout(() => setPoohMessage(''), 3000);
  };

  return (
    <div
      className="paper-bg relative"
      style={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        overflow: 'hidden',
      }}
    >
      {/* Top accent stripe */}
      <div aria-hidden="true" style={{
        height: '3px',
        background: 'linear-gradient(90deg,#d4a76a,#e8c261,#e8953a,#e8c261,#d4a76a)',
        flexShrink: 0,
      }} />

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 12px', overflow: 'hidden' }}>
        <WeeklyView diary={diary} getEntry={getEntry} onDayClick={setSelectedDate} />
      </main>

      {/* Bottom accent stripe */}
      <div aria-hidden="true" style={{
        height: '3px',
        background: 'linear-gradient(90deg,#d4a76a,#e8c261,#e8953a,#e8c261,#d4a76a)',
        flexShrink: 0,
      }} />

      {/* Day detail modal */}
      <AnimatePresence>
        {selectedDate && (
          <DayDetail
            key={formatDateKey(selectedDate)}
            date={selectedDate}
            entry={getEntry(formatDateKey(selectedDate))}
            onSave={setEntry}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>

      {/* Pooh speech bubble */}
      <AnimatePresence>
        {poohMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            style={{
              position: 'fixed',
              bottom: 'calc(130px + env(safe-area-inset-bottom))',
              right: '16px',
              zIndex: 50,
              maxWidth: '200px',
              fontSize: '13px',
              padding: '10px 14px',
              borderRadius: '18px 18px 4px 18px',
              background: '#fffef8',
              border: '1.5px solid rgba(245,200,66,0.6)',
              color: '#5d4037',
              boxShadow: '0 4px 12px rgba(93,64,55,0.12)',
              lineHeight: 1.5,
            }}
          >
            {poohMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pooh character */}
      <PoohCharacter onClick={handlePoohClick} />
    </div>
  );
}
