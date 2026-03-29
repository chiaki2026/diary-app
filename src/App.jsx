import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WeeklyView from './components/WeeklyView';
import DayDetail from './components/DayDetail';
import PoohCharacter from './components/PoohCharacter';
import { useDiary } from './hooks/useDiary';
import { formatDateKey } from './utils/dateUtils';

// ページをめくる音 (外部 mp3)
const PAGE_TURN_SFX = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

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
  const [selectedDate, setSelectedDate]     = useState(null);
  const [poohMessage, setPoohMessage]       = useState('');
  const [audioUnlocked, setAudioUnlocked]   = useState(false);
  const audioRef = useRef(null);

  /* ── Audio unlock (requires user gesture) ── */
  const unlockAudio = useCallback(() => {
    if (audioUnlocked) return;
    const audio = new Audio(PAGE_TURN_SFX);
    audio.volume = 0.55;
    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audioRef.current = audio;
        setAudioUnlocked(true);
        console.log('🔊 音が有効になりました');
      })
      .catch(e => console.error('音の有効化に失敗しました:', e));
  }, [audioUnlocked]);

  /* ── Play page-turn sound ── */
  const playPageTurn = useCallback(() => {
    if (!audioUnlocked || !audioRef.current) return;
    console.log('音を再生します');
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => console.error('再生エラー:', e));
  }, [audioUnlocked]);

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
        <WeeklyView
          diary={diary}
          getEntry={getEntry}
          onDayClick={setSelectedDate}
          onPageTurn={playPageTurn}
        />
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

      {/* 🍯 音を有効にするボタン (未解除時のみ表示) */}
      <AnimatePresence>
        {!audioUnlocked && (
          <motion.button
            key="audio-unlock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            onClick={unlockAudio}
            style={{
              position: 'fixed',
              bottom: 'calc(96px + env(safe-area-inset-bottom))',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 20px',
              borderRadius: '999px',
              background: '#e8953a',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: '"Hiragino Maru Gothic Pro", "M PLUS Rounded 1c", sans-serif',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(232,149,58,0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            🍯 音をONにする
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pooh character */}
      <PoohCharacter onClick={handlePoohClick} />
    </div>
  );
}
