import React from 'react';
import { motion } from 'framer-motion';
import { DAYS_JA } from '../utils/dateUtils';

const DAY_COLORS = { 0: '#e05252', 6: '#4a7fd4' };

export default function DayRow({ date, entry, isToday, onClick, index }) {
  const dow = date.getDay();
  const color = DAY_COLORS[dow] || '#5d4037';
  const preview = entry?.text?.trim().slice(0, 38) || '';
  const hasContent = preview.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        flex: 1,
        minHeight: '52px',
        borderBottom: '1px solid rgba(212,167,106,0.28)',
        cursor: 'pointer',
        position: 'relative',
        WebkitTapHighlightColor: 'transparent',
      }}
      className="active:bg-amber-50"
    >
      {/* Today indicator */}
      {isToday && (
        <div style={{
          position: 'absolute', left: '4px', top: '50%',
          transform: 'translateY(-50%)',
          width: '3px', height: '32px',
          borderRadius: '2px', background: '#e8953a',
        }} />
      )}

      {/* Date column */}
      <div style={{
        width: '56px', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingTop: '6px', paddingBottom: '6px',
      }}>
        <span style={{
          fontFamily: '"Caveat", cursive',
          fontSize: '22px', fontWeight: 600,
          color, lineHeight: 1,
        }}>
          {date.getDate()}
        </span>
        <span style={{ fontSize: '11px', color, opacity: 0.8, marginTop: '1px' }}>
          {DAYS_JA[dow]}
        </span>
        {isToday && (
          <span style={{
            fontSize: '9px', marginTop: '2px',
            padding: '1px 5px', borderRadius: '10px',
            background: '#e8953a', color: 'white',
          }}>
            今日
          </span>
        )}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', margin: '8px 0', background: 'rgba(212,167,106,0.35)' }} />

      {/* Content */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        gap: '6px', padding: '8px 10px', minWidth: 0,
      }}>
        <p style={{
          flex: 1, fontSize: '13px', minWidth: 0,
          color: hasContent ? '#5d4037' : '#b8834a',
          opacity: hasContent ? 0.88 : 0.5,
          fontStyle: hasContent ? 'normal' : 'italic',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {hasContent
            ? preview + (entry.text.trim().length > 38 ? '…' : '')
            : 'まだ書いていないよ...'}
        </p>
        {hasContent && (
          <div style={{
            flexShrink: 0, width: '7px', height: '7px',
            borderRadius: '50%', background: '#e8953a', opacity: 0.6,
          }} />
        )}
      </div>
    </motion.div>
  );
}
