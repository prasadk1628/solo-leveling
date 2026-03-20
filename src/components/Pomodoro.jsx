import React, { useState, useEffect, useRef } from 'react';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function Pomodoro({ subjectName, onComplete, onClose }) {
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [done, setDone] = useState(false);
  const interval = useRef(null);

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(interval.current);
            setRunning(false);
            if (mode === 'work') {
              setSessions(s => s + 1);
              setMode('break');
              setTimeLeft(BREAK_TIME);
              setDone(true);
            } else {
              setMode('work');
              setTimeLeft(WORK_TIME);
              setDone(false);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval.current);
  }, [running, mode]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const total = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const pct = ((total - timeLeft) / total) * 100;
  const color = mode === 'work' ? 'var(--blue)' : 'var(--success)';

  const reset = () => {
    clearInterval(interval.current);
    setRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
    setDone(false);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'#000d', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:28, width:'100%', maxWidth:360, textAlign:'center' }} onClick={e => e.stopPropagation()}>

        <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:4 }}>POMODORO TIMER</div>
        <div style={{ color:'var(--gold)', fontWeight:700, fontSize:14, marginBottom:20 }}>{subjectName}</div>

        {/* Mode badge */}
        <div style={{ display:'inline-block', background:color+'22', border:'1px solid '+color, borderRadius:99, padding:'4px 16px', marginBottom:20 }}>
          <span style={{ color, fontWeight:700, fontSize:12 }}>{mode === 'work' ? 'FOCUS SESSION' : 'BREAK TIME'}</span>
        </div>

        {/* Circular progress */}
        <div style={{ position:'relative', width:160, height:160, margin:'0 auto 20px' }}>
          <svg width="160" height="160" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="var(--card)" strokeWidth="8" />
            <circle cx="80" cy="80" r="70" fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - pct/100)}`}
              strokeLinecap="round"
              style={{ transition:'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:36, fontWeight:900, fontFamily:'monospace', color }}>{mins}:{secs}</div>
            <div style={{ color:'var(--text2)', fontSize:11 }}>{mode === 'work' ? 'focus' : 'rest'}</div>
          </div>
        </div>

        {/* Sessions */}
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:20 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ width:12, height:12, borderRadius:'50%', background: i <= sessions ? 'var(--gold)' : 'var(--card)', border:'1px solid var(--border)' }} />
          ))}
        </div>
        <div style={{ color:'var(--text2)', fontSize:11, marginBottom:20 }}>{sessions} session{sessions !== 1 ? 's' : ''} completed</div>

        {/* Controls */}
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <button onClick={() => setRunning(r => !r)} style={{ flex:2, background:color, color:'#000', padding:'12px 0', borderRadius:8, fontWeight:700, fontSize:15, cursor:'pointer' }}>
            {running ? 'PAUSE' : timeLeft === (mode==='work'?WORK_TIME:BREAK_TIME) ? 'START' : 'RESUME'}
          </button>
          <button onClick={reset} style={{ flex:1, background:'var(--card)', color:'var(--text2)', padding:'12px 0', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', border:'1px solid var(--border)' }}>
            RESET
          </button>
        </div>

        {done && mode === 'break' && (
          <button onClick={() => { onComplete(sessions); onClose(); }} style={{ width:'100%', background:'var(--success)', color:'#000', padding:'12px 0', borderRadius:8, fontWeight:700, fontSize:14, cursor:'pointer', marginBottom:8 }}>
            MARK QUEST COMPLETE +XP
          </button>
        )}

        {sessions >= 1 && !done && (
          <button onClick={() => { onComplete(sessions); onClose(); }} style={{ width:'100%', background:'var(--success)', color:'#000', padding:'10px 0', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:8 }}>
            COMPLETE EARLY (+{sessions * 15} XP)
          </button>
        )}

        <button onClick={onClose} style={{ width:'100%', background:'transparent', color:'var(--text2)', padding:'8px 0', borderRadius:8, fontSize:12, cursor:'pointer' }}>
          CLOSE
        </button>
      </div>
    </div>
  );
}
