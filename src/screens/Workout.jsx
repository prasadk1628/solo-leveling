import React, { useState, useEffect, useRef } from 'react';
import { getExercisesByPhase, addXP, getUser } from '../db/storage';

const muscleColor = { Chest:'var(--blue)', Legs:'var(--success)', Core:'var(--purple)', 'Full Body':'var(--gold)', Glutes:'var(--danger)' };
const muscleIcon = { Chest:'&#128170;', Legs:'&#129470;', Core:'&#127962;', 'Full Body':'&#9889;', Glutes:'&#127939;' };

const PHASE_UNLOCK = { 1: 0, 2: 5, 3: 10 };
const PHASE_LABEL = { 1:'Week 1-2 - 3x/week', 2:'Week 3-4 - 4x/week', 3:'Week 5-6 - 4-5x/week' };

export default function Workout() {
  const [phase, setPhase] = useState(1);
  const [exercises, setExercises] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [done, setDone] = useState({});
  const [timer, setTimer] = useState({});
  const [running, setRunning] = useState({});
  const [user, setUser] = useState(null);
  const intervals = useRef({});

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setExercises(getExercisesByPhase(phase));
    setExpanded(null);
    setDone({});
  }, [phase]);

  const isPhaseUnlocked = (p) => {
    if (!user) return p === 1;
    return user.level >= PHASE_UNLOCK[p];
  };

  const startTimer = (id, seconds) => {
    setTimer(t => ({...t, [id]:seconds}));
    setRunning(r => ({...r, [id]:true}));
    intervals.current[id] = setInterval(() => {
      setTimer(t => {
        if (t[id] <= 1) {
          clearInterval(intervals.current[id]);
          setRunning(r => ({...r, [id]:false}));
          return {...t, [id]:0};
        }
        return {...t, [id]:t[id]-1};
      });
    }, 1000);
  };

  const markDone = (ex) => {
    setDone(d => ({...d, [ex.id]:true}));
    addXP(ex.xp_reward, 'Exercise: '+ex.name);
    setUser(getUser());
    if (intervals.current[ex.id]) clearInterval(intervals.current[ex.id]);
  };

  const doneCount = Object.values(done).filter(Boolean).length;

  return (
    <div style={{ padding:16 }}>
      <h2 style={{ color:'var(--gold)', letterSpacing:2, marginBottom:4, fontSize:18 }}>TRAINING GROUND</h2>
      <p style={{ color:'var(--text2)', fontSize:12, marginBottom:16 }}>Higher phases unlock as you level up</p>

      {/* Phase tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[1,2,3].map(p => {
          const unlocked = isPhaseUnlocked(p);
          const active = phase === p;
          return (
            <button key={p} onClick={() => unlocked && setPhase(p)} style={{
              flex:1, padding:'10px 0', borderRadius:8, fontWeight:700, fontSize:12, letterSpacing:1,
              background: active ? 'var(--blue)' : unlocked ? 'var(--card)' : 'var(--surface)',
              color: active ? '#fff' : unlocked ? 'var(--text)' : 'var(--text2)',
              border: active ? '1px solid var(--blue)' : unlocked ? '1px solid var(--border)' : '1px solid var(--border)',
              opacity: unlocked ? 1 : 0.5,
              cursor: unlocked ? 'pointer' : 'not-allowed',
              position:'relative'
            }}>
              {unlocked ? 'PHASE '+p : (
                <span>
                  PHASE {p}
                  <span style={{ display:'block', fontSize:9, color:'var(--gold)', marginTop:2 }}>
                    LV.{PHASE_UNLOCK[p]}+ to unlock
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Phase info */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:12, marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:'var(--text2)', fontSize:12 }}>{PHASE_LABEL[phase]}</span>
        <span style={{ color:'var(--success)', fontSize:12, fontWeight:700 }}>{doneCount}/{exercises.length} done</span>
      </div>

      {/* Exercise cards */}
      {exercises.map(ex => (
        <div key={ex.id} style={{ background:done[ex.id]?'#0d1a14':'var(--card)', border:done[ex.id]?'1px solid var(--success)':'1px solid var(--border)', borderRadius:10, marginBottom:10, overflow:'hidden' }}>
          <div onClick={() => setExpanded(expanded===ex.id ? null : ex.id)} style={{ padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}>
            <div>
              <div style={{ fontWeight:700, marginBottom:4 }}>{ex.name}</div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ background:(muscleColor[ex.muscle_group]||'var(--blue)')+'22', color:muscleColor[ex.muscle_group]||'var(--blue)', fontSize:10, padding:'2px 8px', borderRadius:99, fontWeight:700, display:'flex', alignItems:'center', gap:3 }}>
                  <span dangerouslySetInnerHTML={{ __html: muscleIcon[ex.muscle_group]||'&#128170;' }} />
                  {ex.muscle_group}
                </span>
                <span style={{ color:'var(--text2)', fontSize:11 }}>{ex.reps}</span>
                {ex.has_timer && <span style={{ color:'var(--purple)', fontSize:10 }}>&#9201; {ex.timer_sec}s</span>}
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {done[ex.id] && <span style={{ color:'var(--success)', fontSize:16 }}>&#10003;</span>}
              <span style={{ color:'var(--gold)', fontSize:12, fontWeight:700 }}>+{ex.xp_reward}XP</span>
              <span style={{ color:'var(--text2)', fontSize:12 }}>{expanded===ex.id ? '&#9650;' : '&#9660;'}</span>
            </div>
          </div>

          {expanded===ex.id && (
            <div style={{ padding:'0 14px 14px', borderTop:'1px solid var(--border)' }}>
              <p style={{ color:'var(--text2)', fontSize:13, marginBottom:12, marginTop:10 }}>{ex.description}</p>
              {ex.has_timer && (
                <div style={{ marginBottom:12, textAlign:'center', background:'var(--surface)', borderRadius:8, padding:12 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:1, marginBottom:4 }}>HOLD TIME</div>
                  <div style={{ fontSize:40, fontWeight:900, color: timer[ex.id]===0 ? 'var(--success)' : 'var(--blue)', fontFamily:'monospace' }}>
                    {timer[ex.id] !== undefined ? timer[ex.id] : ex.timer_sec}s
                  </div>
                  {!running[ex.id] && (
                    <button onClick={() => startTimer(ex.id, ex.timer_sec)} style={{ background:'var(--blue)', color:'#fff', padding:'6px 20px', borderRadius:6, fontWeight:700, marginTop:8, fontSize:13 }}>
                      START TIMER
                    </button>
                  )}
                  {running[ex.id] && <div style={{ color:'var(--text2)', fontSize:12, marginTop:6 }}>Timer running... stay strong!</div>}
                  {timer[ex.id]===0 && !running[ex.id] && timer[ex.id]!==undefined && <div style={{ color:'var(--success)', fontWeight:700, marginTop:6 }}>Time complete!</div>}
                </div>
              )}
              {!done[ex.id] ? (
                <button onClick={() => markDone(ex)} style={{ width:'100%', background:'var(--success)', color:'#000', padding:'10px 0', borderRadius:8, fontWeight:700, fontSize:14 }}>
                  MARK COMPLETE +{ex.xp_reward}XP
                </button>
              ) : (
                <div style={{ textAlign:'center', color:'var(--success)', fontWeight:700, fontSize:15 }}>&#10003; COMPLETED</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
