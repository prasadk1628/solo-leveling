import React, { useState, useEffect } from 'react';
import { getTodayQuests, getAllQuests, completeQuest, failQuest } from '../db/storage';
import Pomodoro from '../components/Pomodoro';

const diffColor = { easy:'var(--success)', medium:'var(--blue)', hard:'var(--danger)' };
const typeIcon = { daily:'&#128197;', main:'&#9876;', dungeon:'&#127984;', training:'&#127939;' };
const typeDesc = {
  daily: 'Daily habits build long-term discipline.',
  main: 'Main quests push your core limits.',
  dungeon: 'Dungeon quests are intense full-body challenges.',
  training: 'Training quests improve speed and endurance.',
};

const staticDetails = {
  1: { steps:['Wake up before 7 AM','Complete your Phase workout','Cool down with 5 min stretching'], tip:'Even a 15-minute session counts. Consistency beats intensity.' },
  2: { steps:['Find a quiet space','Put your phone away','Study for 60 minutes with breaks every 25 min'], tip:'Use flashcards or practice problems, not just reading.' },
  3: { steps:['Keep a water bottle nearby','Drink a glass every 2 hours','Track with marks on your bottle'], tip:'Add lemon or mint if plain water is boring.' },
  4: { steps:['Pick any book or article','Read 20 full pages','Write one sentence summary'], tip:'Even 10 pages twice a day works.' },
  5: { steps:['No chips, sweets, or fast food','Replace with fruits, nuts, or home food','Plan meals in advance'], tip:'If it comes in a packet, skip it.' },
  6: { steps:['Do push-ups in sets throughout the day','Example: 10 sets of 10','Rest 2-3 minutes between sets'], tip:'You have all day. No need to do them all at once.' },
  7: { steps:['Wall Push-ups x15','Bodyweight Squats x20','Plank Hold 30s','Jumping Jacks x30','Repeat 3 times with no rest'], tip:'This is meant to be tough. Push through the burn.' },
  8: { steps:['Jog, cycle, jump rope, or do jumping jacks','Keep heart rate elevated for 20 minutes','Maintain a pace where talking is hard'], tip:'Put on music and the time flies.' },
};

const resolveQuest = (uq, allQuests) => {
  if (uq.is_dynamic) {
    return { id:uq.id, title:uq.title, description:uq.description, difficulty:uq.difficulty||'medium', type:uq.type||'daily', xp_reward:uq.xp_reward||25, is_penalty:false, is_dynamic:true, dynamic_type:uq.dynamic_type };
  }
  const q = allQuests.find(q => q.id === uq.quest_id);
  if (!q) return null;
  return { ...q, is_dynamic:false };
};

export default function Quests() {
  const [todayQuests, setTodayQuests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [pomodoroQuest, setPomodoroQuest] = useState(null);
  const allQuests = getAllQuests();

  const load = () => setTodayQuests(getTodayQuests());
  useEffect(() => { load(); }, []);

  const handleComplete = (id) => {
    const result = completeQuest(id);
    load();
    if (result && result.levelChanged) {
      window.dispatchEvent(new CustomEvent('levelup', { detail: result.user }));
    }
  };
  const handleFail = (id) => { failQuest(id); load(); };
  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const filtered = todayQuests.filter(uq => {
    const quest = resolveQuest(uq, allQuests);
    if (!quest) return false;
    if (filter === 'all') return true;
    return quest.type === filter;
  });

  const completed = todayQuests.filter(q => q.status === 'completed').length;
  const pct = todayQuests.length ? Math.round((completed/todayQuests.length)*100) : 0;

  return (
    <div style={{ padding:16, paddingBottom:80 }}>
      <h2 style={{ color:'var(--gold)', letterSpacing:2, marginBottom:4, fontSize:18 }}>QUEST BOARD</h2>
      <p style={{ color:'var(--text2)', fontSize:12, marginBottom:14 }}>Tap any quest to see details</p>

      <div style={{ background:'var(--surface)', borderRadius:10, padding:14, marginBottom:12, border:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ color:'var(--text2)', fontSize:12 }}>Daily Progress</span>
          <span style={{ color:'var(--blue)', fontWeight:700 }}>{completed}/{todayQuests.length}</span>
        </div>
        <div style={{ background:'var(--card)', borderRadius:99, height:8, overflow:'hidden' }}>
          <div style={{ background:'linear-gradient(90deg, var(--blue), var(--purple))', height:'100%', width:pct+'%', borderRadius:99, transition:'width 0.4s' }} />
        </div>
        {pct === 100 && todayQuests.length > 0 && (
          <div style={{ color:'var(--success)', fontSize:12, fontWeight:700, marginTop:8, textAlign:'center' }}>ALL QUESTS COMPLETE! Great work Hunter!</div>
        )}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:12, overflowX:'auto', paddingBottom:4 }}>
        {['all','daily','main','dungeon','training'].map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ padding:'6px 14px', borderRadius:99, fontSize:11, fontWeight:700, letterSpacing:1, background:filter===t?'var(--blue)':'var(--card)', color:filter===t?'#fff':'var(--text2)', border:'1px solid var(--border)', whiteSpace:'nowrap', cursor:'pointer' }}>
            {t !== 'all' && <span dangerouslySetInnerHTML={{ __html:typeIcon[t]+' ' }} />}
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ color:'var(--text2)', textAlign:'center', padding:40, fontSize:13 }}>No quests in this category today</div>
      )}

      {filtered.map(uq => {
        const quest = resolveQuest(uq, allQuests);
        if (!quest) return null;
        const isPending = uq.status === 'pending';
        const isExpanded = expanded === uq.id;
        const details = !quest.is_dynamic ? staticDetails[uq.quest_id] : null;

        return (
          <div key={uq.id} style={{ background:'var(--card)', border:quest.is_penalty?'1px solid var(--danger)':uq.status==='completed'?'1px solid var(--success)':quest.is_dynamic?'1px solid var(--purple)':'1px solid var(--border)', borderRadius:12, marginBottom:10, overflow:'hidden' }}>
            <div onClick={() => toggle(uq.id)} style={{ padding:'14px', cursor:'pointer', userSelect:'none' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4, flexWrap:'wrap' }}>
                    <span dangerouslySetInnerHTML={{ __html:typeIcon[quest.type]||'&#128203;' }} style={{ fontSize:14 }} />
                    {quest.is_dynamic && quest.dynamic_type==='subject' && <span style={{ background:'var(--purple)22', color:'var(--purple)', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700 }}>STUDY</span>}
                    {quest.is_dynamic && quest.dynamic_type==='project' && <span style={{ background:'var(--blue)22', color:'var(--blue)', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700 }}>PROJECT</span>}
                    {quest.is_penalty && <span style={{ background:'var(--danger)22', color:'var(--danger)', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700 }}>PENALTY</span>}
                    <span style={{ background:diffColor[quest.difficulty]+'22', color:diffColor[quest.difficulty], fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700 }}>{quest.difficulty.toUpperCase()}</span>
                  </div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:2 }}>{quest.title}</div>
                  <div style={{ color:'var(--text2)', fontSize:12 }}>{quest.description}</div>
                </div>
                <div style={{ textAlign:'right', marginLeft:12, flexShrink:0 }}>
                  <div style={{ color:'var(--gold)', fontSize:14, fontWeight:700 }}>+{quest.xp_reward} XP</div>
                  <div style={{ color:uq.status==='completed'?'var(--success)':uq.status==='failed'?'var(--danger)':'var(--text2)', fontSize:10, fontWeight:700, textTransform:'uppercase', marginTop:2 }}>{uq.status}</div>
                  <div style={{ color:'var(--text2)', fontSize:12, marginTop:4 }}>{isExpanded ? '▲' : '▼'}</div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div style={{ borderTop:'1px solid var(--border)', padding:'14px' }}>
                <div style={{ background:'var(--surface)', borderRadius:8, padding:'10px 12px', marginBottom:12 }}>
                  <span style={{ color:'var(--text2)', fontSize:12 }}>
                    {quest.is_dynamic && quest.dynamic_type==='subject' ? 'Focus on this subject for 1 hour. Use active recall and practice problems for best results.' :
                     quest.is_dynamic && quest.dynamic_type==='project' ? 'Dedicate 1 focused hour to your project. Write code, plan features, or fix bugs.' :
                     typeDesc[quest.type]}
                  </span>
                </div>

                {details && (
                  <div style={{ marginBottom:12 }}>
                    <div style={{ color:'var(--blue)', fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:8 }}>HOW TO COMPLETE</div>
                    {details.steps.map((step, i) => (
                      <div key={i} style={{ display:'flex', gap:10, marginBottom:6, alignItems:'flex-start' }}>
                        <div style={{ background:'var(--blue)', color:'#fff', borderRadius:99, width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}</div>
                        <span style={{ color:'var(--text)', fontSize:13, lineHeight:1.4 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {details && details.tip && (
                  <div style={{ background:'#1a1a2e', border:'1px solid var(--purple)', borderRadius:8, padding:'10px 12px', marginBottom:12 }}>
                    <div style={{ color:'var(--purple)', fontSize:10, fontWeight:700, letterSpacing:1, marginBottom:4 }}>HUNTER TIP</div>
                    <div style={{ color:'var(--text)', fontSize:12, lineHeight:1.5 }}>{details.tip}</div>
                  </div>
                )}

                {isPending && quest.is_dynamic && quest.dynamic_type === 'subject' && (
                  <button onClick={(e) => { e.stopPropagation(); setPomodoroQuest({id:uq.id, title:quest.title}); }} style={{ width:'100%', background:'var(--purple)', color:'#fff', padding:'8px 0', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:8 }}>
                    START POMODORO TIMER
                  </button>
                )}

                {isPending && (
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => handleFail(uq.id)} style={{ flex:1, background:'transparent', border:'1px solid var(--danger)', color:'var(--danger)', padding:'10px 0', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>FAIL</button>
                    <button onClick={() => handleComplete(uq.id)} style={{ flex:2, background:'var(--success)', color:'#000', padding:'10px 0', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' }}>COMPLETE +{quest.xp_reward}XP</button>
                  </div>
                )}
                {uq.status === 'completed' && <div style={{ textAlign:'center', color:'var(--success)', fontWeight:700, fontSize:14 }}>&#10003; Quest Completed!</div>}
                {uq.status === 'failed' && <div style={{ textAlign:'center', color:'var(--danger)', fontWeight:700, fontSize:14 }}>Quest Failed</div>}
              </div>
            )}
          </div>
        );
      })}

      {pomodoroQuest && (
        <Pomodoro
          subjectName={pomodoroQuest.title}
          onComplete={() => { handleComplete(pomodoroQuest.id); setPomodoroQuest(null); }}
          onClose={() => setPomodoroQuest(null)}
        />
      )}
    </div>
  );
}
