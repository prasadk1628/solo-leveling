import React, { useEffect, useState } from 'react';
import { getRankColor } from '../db/storage';

export default function LevelUpAnimation({ data, onDone }) {
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 2800);
    const t3 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const rankColor = getRankColor(data.rank);
  const isRankUp = data.rankChanged;

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
      background: phase === 'show' ? '#000c' : 'transparent',
      transition:'background 0.3s',
      pointerEvents:'none',
    }}>
      <div style={{
        textAlign:'center', padding:40,
        transform: phase === 'enter' ? 'scale(0.5)' : phase === 'exit' ? 'scale(1.1)' : 'scale(1)',
        opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
        transition:'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Glow ring */}
        <div style={{
          width:140, height:140, borderRadius:'50%', margin:'0 auto 20px',
          border:'3px solid '+rankColor,
          boxShadow:'0 0 40px '+rankColor+', 0 0 80px '+rankColor+'44',
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'#0a0c14',
          animation: phase === 'show' ? 'pulse 0.6s ease-in-out infinite alternate' : 'none',
        }}>
          <div style={{ fontSize:56, fontWeight:900, color:rankColor }}>
            {data.level}
          </div>
        </div>

        <div style={{ color:'#fff', fontSize:14, letterSpacing:3, marginBottom:8, opacity:0.7 }}>
          LEVEL UP
        </div>
        <div style={{ color:rankColor, fontSize:32, fontWeight:900, letterSpacing:2, marginBottom:8 }}>
          LEVEL {data.level}
        </div>

        {isRankUp && (
          <div style={{
            background:rankColor+'22', border:'1px solid '+rankColor,
            borderRadius:10, padding:'10px 24px', marginTop:12, display:'inline-block'
          }}>
            <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2 }}>RANK UP</div>
            <div style={{ color:rankColor, fontSize:22, fontWeight:900 }}>RANK {data.rank}</div>
          </div>
        )}

        <div style={{ color:'var(--text2)', fontSize:13, marginTop:16 }}>
          {isRankUp ? 'You have grown stronger, Hunter.' : 'Keep pushing your limits.'}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          from { box-shadow: 0 0 30px ${rankColor}, 0 0 60px ${rankColor}44; }
          to   { box-shadow: 0 0 60px ${rankColor}, 0 0 120px ${rankColor}66; }
        }
      `}</style>
    </div>
  );
}
