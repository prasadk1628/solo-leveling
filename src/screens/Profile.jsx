import React, { useState, useEffect } from 'react';
import {
  getUser, getStats, getAchievements, getUserAchievements, getXPLogs,
  xpForLevel, getRankColor, getSubjects, addSubject, deleteSubject, updateSubject,
  getProject, saveProject, clearProject, getAllQuests, saveQuests, AVATARS
} from '../db/storage';
import EditProfile from '../components/EditProfile';

const statIcons = { Strength:'&#128170;', Endurance:'&#10084;', Discipline:'&#128737;', Knowledge:'&#128218;' };
const statColors = { Strength:'var(--danger)', Endurance:'var(--success)', Discipline:'var(--blue)', Knowledge:'var(--gold)' };
const achIcons = { first_blood:'&#9876;', on_fire:'&#128293;', dungeon_raider:'&#127984;', night_owl:'&#127774;', iron_discipline:'&#128737;', rank_up:'&#11088;' };
const rankBadge = { E:'&#9899;', D:'&#128994;', C:'&#128309;', B:'&#128995;', A:'&#128992;', S:'&#128308;' };
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DIFF_COLOR = { easy:'var(--success)', medium:'var(--blue)', hard:'var(--danger)' };
const PRIORITY_COLOR = { low:'var(--text2)', medium:'var(--gold)', high:'var(--danger)' };
const TYPE_ICON = { daily:'&#128197;', main:'&#9876;', dungeon:'&#127984;', training:'&#127939;' };

export default function Profile() {
  const [tab, setTab] = useState('hunter');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [userAch, setUserAch] = useState([]);
  const [logs, setLogs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [project, setProject] = useState(null);
  const [quests, setQuests] = useState([]);

  // Subject form
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subName, setSubName] = useState('');
  const [subDiff, setSubDiff] = useState('medium');
  const [subPriority, setSubPriority] = useState('medium');
  const [subDays, setSubDays] = useState([]);
  const [subExamDate, setSubExamDate] = useState('');

  // Project form
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');

  // Quest form
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [qTitle, setQTitle] = useState('');
  const [qDesc, setQDesc] = useState('');
  const [qType, setQType] = useState('daily');
  const [qDiff, setQDiff] = useState('medium');
  const [qXP, setQXP] = useState(25);
  const [questFilter, setQuestFilter] = useState('all');

  const load = () => {
    setUser(getUser()); setStats(getStats());
    setAchievements(getAchievements()); setUserAch(getUserAchievements());
    setLogs(getXPLogs()); setSubjects(getSubjects());
    setProject(getProject()); setQuests(getAllQuests());
  };
  useEffect(() => { load(); }, []);

  if (!user) return null;
  const rankColor = getRankColor(user.rank);
  const xpNeeded = xpForLevel(user.level);
  const xpPct = Math.min(100, (user.xp/xpNeeded)*100);
  const isUnlocked = (id) => userAch.some(ua => ua.achievement_id === id);
  const nextRankInfo = { E:{next:'D',label:'Reach Level 5'}, D:{next:'C',label:'Reach Level 12'}, C:{next:'B',label:'Reach Level 22'}, B:{next:'A',label:'Reach Level 35'}, A:{next:'S',label:'Reach Level 50'}, S:{next:null,label:'MAX RANK'} }[user.rank];

  // Subject handlers
  const openAddSubject = () => { setEditingSubject(null); setSubName(''); setSubDiff('medium'); setSubPriority('medium'); setSubDays([]); setSubExamDate(''); setShowSubjectForm(true); };
  const openEditSubject = (s) => { setEditingSubject(s); setSubName(s.name); setSubDiff(s.difficulty); setSubPriority(s.priority); setSubDays(s.days||[]); setSubExamDate(s.exam_date||''); setShowSubjectForm(true); };
  const saveSubject = () => {
    if (!subName.trim()) return;
    if (editingSubject) updateSubject(editingSubject.id, {name:subName.trim(), difficulty:subDiff, priority:subPriority, days:subDays, exam_date:subExamDate});
    else addSubject({name:subName.trim(), difficulty:subDiff, priority:subPriority, days:subDays, exam_date:subExamDate});
    setShowSubjectForm(false); load();
  };
  const toggleDay = (day) => setSubDays(d => d.includes(day) ? d.filter(x=>x!==day) : [...d, day]);

  // Project handlers
  const openProjectForm = () => { setProjName(project?.name||''); setProjDesc(project?.description||''); setShowProjectForm(true); };
  const saveProjectForm = () => {
    if (!projName.trim()) return;
    saveProject({name:projName.trim(), description:projDesc.trim(), updated_at:new Date().toISOString()});
    setShowProjectForm(false); load();
  };

  // Quest handlers
  const openAddQuest = () => { setEditingQuest(null); setQTitle(''); setQDesc(''); setQType('daily'); setQDiff('medium'); setQXP(25); setShowQuestForm(true); };
  const openEditQuest = (q) => { setEditingQuest(q); setQTitle(q.title); setQDesc(q.description||''); setQType(q.type); setQDiff(q.difficulty); setQXP(q.xp_reward); setShowQuestForm(true); };
  const saveQuest = () => {
    if (!qTitle.trim()) return;
    const all = getAllQuests();
    if (editingQuest) {
      const updated = all.map(q => q.id === editingQuest.id ? {...q, title:qTitle.trim(), description:qDesc.trim(), type:qType, difficulty:qDiff, xp_reward:Number(qXP)} : q);
      saveQuests(updated);
    } else {
      const newQ = { id: Date.now(), title:qTitle.trim(), description:qDesc.trim(), difficulty:qDiff, type:qType, xp_reward:Number(qXP), is_penalty:false, is_custom:true, enabled:true };
      saveQuests([...all, newQ]);
    }
    setShowQuestForm(false); load();
  };
  const toggleQuestEnabled = (id) => {
    const updated = getAllQuests().map(q => q.id === id ? {...q, enabled: q.enabled === false ? true : false} : q);
    saveQuests(updated); load();
  };
  const deleteQuest = (id) => {
    saveQuests(getAllQuests().filter(q => q.id !== id)); load();
  };

  const filteredQuests = questFilter === 'all' ? quests : questFilter === 'custom' ? quests.filter(q => q.is_custom) : quests.filter(q => q.type === questFilter);

  return (
    <div style={{ paddingBottom:80 }}>
      {/* Tab bar */}
      <div style={{ display:'flex', background:'var(--surface)', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:10, overflowX:'auto' }}>
        {[['hunter','&#128100; Hunter'],['study','&#128218; Study'],['project','&#128187; Project'],['quests','&#9876; Quests']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ flex:1, padding:'12px 6px', background:'transparent', color:tab===key?'var(--blue)':'var(--text2)', fontWeight:700, fontSize:11, letterSpacing:0.5, borderBottom:tab===key?'2px solid var(--blue)':'2px solid transparent', cursor:'pointer', whiteSpace:'nowrap' }}
            dangerouslySetInnerHTML={{ __html: label }} />
        ))}
      </div>

      {/* ── HUNTER TAB ── */}
      {tab === 'hunter' && (
        <div style={{ padding:16 }}>
          <div style={{ background:'var(--surface)', border:'1px solid '+rankColor+'66', borderRadius:12, padding:20, marginBottom:12, textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg, transparent,'+rankColor+', transparent)' }} />
            <button onClick={() => setShowEditProfile(true)} style={{ position:'absolute', top:12, right:12, background:'var(--card)', border:'1px solid var(--border)', color:'var(--text2)', padding:'4px 10px', borderRadius:6, fontSize:11, cursor:'pointer', fontWeight:700 }}>
              EDIT
            </button>
            {/* Avatar / Photo */}
            {(() => {
              const avatarData = AVATARS.find(a => a.key === (user.avatar||'warrior')) || AVATARS[0];
              return user.photo ? (
                <img src={user.photo} alt="profile" style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', border:'3px solid '+rankColor, margin:'0 auto 10px', display:'block' }} />
              ) : (
                <div style={{ width:80, height:80, borderRadius:'50%', background:avatarData.color+'22', border:'3px solid '+avatarData.color, margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}
                  dangerouslySetInnerHTML={{ __html: avatarData.icon }} />
              );
            })()}
            <div style={{ fontSize:24, fontWeight:900, marginBottom:4 }}>{user.name}</div>
            <div style={{ color:rankColor, fontWeight:700, letterSpacing:2, fontSize:14 }}>RANK {user.rank} HUNTER</div>
            <div style={{ color:'var(--text2)', fontSize:12, marginTop:4 }}>Level {user.level} &nbsp;|&nbsp; {user.streak} day streak &#128293;</div>
            <div style={{ marginTop:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ color:'var(--text2)', fontSize:11 }}>LV.{user.level} XP</span>
                <span style={{ color:'var(--blue)', fontSize:11, fontWeight:700 }}>{user.xp} / {xpNeeded}</span>
              </div>
              <div style={{ background:'var(--card)', borderRadius:99, height:8, overflow:'hidden' }}>
                <div style={{ background:'linear-gradient(90deg, var(--blue), var(--purple))', height:'100%', width:xpPct+'%', borderRadius:99, transition:'width 0.5s' }} />
              </div>
            </div>
            {nextRankInfo?.next && (
              <div style={{ marginTop:10, background:'var(--card)', borderRadius:8, padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color:'var(--text2)', fontSize:11 }}>Next Rank</span>
                <span style={{ color:getRankColor(nextRankInfo.next), fontWeight:700, fontSize:12 }}>RANK {nextRankInfo.next} — {nextRankInfo.label}</span>
              </div>
            )}
          </div>

          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:8 }}>&#9889; HUNTER STATS</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {[['Strength',stats?.strength||0],['Endurance',stats?.endurance||0],['Discipline',stats?.discipline||0],['Knowledge',stats?.knowledge||0]].map(([label,val]) => (
              <div key={label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:'14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                  <span style={{ fontSize:18 }} dangerouslySetInnerHTML={{ __html:statIcons[label] }} />
                  <span style={{ color:'var(--text2)', fontSize:11, fontWeight:700 }}>{label.toUpperCase()}</span>
                </div>
                <div style={{ color:statColors[label], fontWeight:900, fontSize:26, marginBottom:6 }}>{val}</div>
                <div style={{ background:'var(--surface)', borderRadius:99, height:4 }}>
                  <div style={{ background:statColors[label], height:'100%', width:Math.min(100,(val/50)*100)+'%', borderRadius:99 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:8 }}>&#127942; ACHIEVEMENTS</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
            {achievements.map(a => {
              const unlocked = isUnlocked(a.id);
              return (
                <div key={a.id} style={{ background:unlocked?'var(--card)':'var(--surface)', border:unlocked?'1px solid var(--gold)':'1px solid var(--border)', borderRadius:10, padding:'14px 12px', opacity:unlocked?1:0.45, textAlign:'center', position:'relative', overflow:'hidden' }}>
                  {unlocked && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'var(--gold)' }} />}
                  <div style={{ fontSize:28, marginBottom:6 }} dangerouslySetInnerHTML={{ __html:achIcons[a.key]||'&#11088;' }} />
                  <div style={{ fontSize:12, fontWeight:700, color:unlocked?'var(--gold)':'var(--text2)', marginBottom:3 }}>{a.title}</div>
                  <div style={{ fontSize:10, color:'var(--text2)', lineHeight:1.4 }}>{a.description}</div>
                  {unlocked && <div style={{ color:'var(--success)', fontSize:10, fontWeight:700, marginTop:4 }}>UNLOCKED &#10003;</div>}
                  {!unlocked && <div style={{ color:'var(--text2)', fontSize:10, marginTop:4 }}>&#128274; LOCKED</div>}
                </div>
              );
            })}
          </div>

          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:8 }}>&#128200; XP HISTORY</div>
          {logs.slice(0,10).map(log => (
            <div key={log.id} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 14px', marginBottom:6, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12, color:'var(--text2)' }}>{log.reason}</span>
              <span style={{ fontWeight:700, color:log.xp_change>=0?'var(--success)':'var(--danger)', fontSize:13 }}>{log.xp_change>=0?'+':''}{log.xp_change} XP</span>
            </div>
          ))}
          {logs.length===0 && <div style={{ color:'var(--text2)', textAlign:'center', padding:20, fontSize:13 }}>No XP history yet.</div>}
        </div>
      )}

      {/* ── STUDY TAB ── */}
      {tab === 'study' && (
        <div style={{ padding:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <h3 style={{ color:'var(--gold)', letterSpacing:1, fontSize:16 }}>&#128218; STUDY PLANNER</h3>
            <button onClick={openAddSubject} style={{ background:'var(--blue)', color:'#fff', padding:'6px 14px', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>+ ADD</button>
          </div>
          <p style={{ color:'var(--text2)', fontSize:12, marginBottom:16 }}>Study quests appear automatically on your scheduled days.</p>
          {subjects.length === 0 && (
            <div style={{ background:'var(--surface)', border:'1px dashed var(--border)', borderRadius:12, padding:32, textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:8 }}>&#128218;</div>
              <div style={{ color:'var(--text2)', fontSize:13, marginBottom:16 }}>No subjects yet. Add your first subject to get study quests!</div>
              <button onClick={openAddSubject} style={{ background:'var(--blue)', color:'#fff', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer' }}>ADD SUBJECT</button>
            </div>
          )}
          {subjects.map(s => (
            <div key={s.id} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:14, marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{s.name}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    <span style={{ background:DIFF_COLOR[s.difficulty]+'22', color:DIFF_COLOR[s.difficulty], fontSize:10, padding:'2px 8px', borderRadius:99, fontWeight:700 }}>{s.difficulty.toUpperCase()}</span>
                    <span style={{ background:PRIORITY_COLOR[s.priority]+'22', color:PRIORITY_COLOR[s.priority], fontSize:10, padding:'2px 8px', borderRadius:99, fontWeight:700 }}>{s.priority.toUpperCase()} PRIORITY</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => openEditSubject(s)} style={{ background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text2)', padding:'4px 10px', borderRadius:6, fontSize:11, cursor:'pointer' }}>EDIT</button>
                  <button onClick={() => { deleteSubject(s.id); load(); }} style={{ background:'transparent', border:'1px solid var(--danger)', color:'var(--danger)', padding:'4px 10px', borderRadius:6, fontSize:11, cursor:'pointer' }}>DEL</button>
                </div>
              </div>
              {s.exam_date && (() => {
                const daysLeft = Math.ceil((new Date(s.exam_date) - new Date()) / 86400000);
                const urgColor = daysLeft <= 7 ? 'var(--danger)' : daysLeft <= 14 ? 'var(--gold)' : 'var(--success)';
                return daysLeft > 0 ? (
                  <div style={{ background:urgColor+'22', border:'1px solid '+urgColor, borderRadius:6, padding:'4px 10px', marginBottom:8, display:'inline-flex', alignItems:'center', gap:6 }}>
                    <span style={{ color:urgColor, fontSize:11, fontWeight:700 }}>
                      EXAM IN {daysLeft} DAY{daysLeft !== 1 ? 'S' : ''} — {new Date(s.exam_date).toLocaleDateString()}
                    </span>
                  </div>
                ) : <div style={{ color:'var(--text2)', fontSize:10, marginBottom:8 }}>Exam passed</div>;
              })()}
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {DAYS.map(day => (
                  <span key={day} style={{ background:(s.days||[]).includes(day)?'var(--blue)':'var(--surface)', color:(s.days||[]).includes(day)?'#fff':'var(--text2)', border:'1px solid '+((s.days||[]).includes(day)?'var(--blue)':'var(--border)'), borderRadius:4, padding:'2px 7px', fontSize:10, fontWeight:700 }}>
                    {day.slice(0,3).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {showSubjectForm && (
            <div style={{ position:'fixed', inset:0, background:'#000a', zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={() => setShowSubjectForm(false)}>
              <div style={{ background:'var(--surface)', borderRadius:'16px 16px 0 0', padding:20, width:'100%', maxWidth:480 }} onClick={e => e.stopPropagation()}>
                <h3 style={{ color:'var(--gold)', marginBottom:16 }}>{editingSubject ? 'EDIT SUBJECT' : 'ADD SUBJECT'}</h3>
                <input value={subName} onChange={e => setSubName(e.target.value)} placeholder="Subject name (e.g. Mathematics)" style={{ width:'100%', background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)', padding:'10px 14px', borderRadius:8, fontSize:14, marginBottom:12 }} />
                <div style={{ marginBottom:12 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, marginBottom:6 }}>DIFFICULTY</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {['easy','medium','hard'].map(d => (
                      <button key={d} onClick={() => setSubDiff(d)} style={{ flex:1, padding:'7px 0', borderRadius:6, fontSize:11, fontWeight:700, background:subDiff===d?DIFF_COLOR[d]:'var(--card)', color:subDiff===d?'#000':'var(--text2)', border:'1px solid var(--border)', cursor:'pointer' }}>{d.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, marginBottom:6 }}>PRIORITY</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {['low','medium','high'].map(p => (
                      <button key={p} onClick={() => setSubPriority(p)} style={{ flex:1, padding:'7px 0', borderRadius:6, fontSize:11, fontWeight:700, background:subPriority===p?PRIORITY_COLOR[p]:'var(--card)', color:subPriority===p?'#000':'var(--text2)', border:'1px solid var(--border)', cursor:'pointer' }}>{p.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, marginBottom:8 }}>STUDY DAYS</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {DAYS.map(day => (
                      <button key={day} onClick={() => toggleDay(day)} style={{ padding:'7px 10px', borderRadius:6, fontSize:11, fontWeight:700, background:subDays.includes(day)?'var(--blue)':'var(--card)', color:subDays.includes(day)?'#fff':'var(--text2)', border:'1px solid '+(subDays.includes(day)?'var(--blue)':'var(--border)'), cursor:'pointer' }}>
                        {day.slice(0,3).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, marginBottom:6 }}>EXAM DATE (optional)</div>
                  <input type="date" value={subExamDate} onChange={e => setSubExamDate(e.target.value)} style={{ width:'100%', background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)', padding:'8px 12px', borderRadius:8, fontSize:13, colorScheme:'dark' }} />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setShowSubjectForm(false)} style={{ flex:1, padding:'10px 0', borderRadius:8, background:'var(--card)', color:'var(--text2)', border:'1px solid var(--border)', fontWeight:700, cursor:'pointer' }}>CANCEL</button>
                  <button onClick={saveSubject} style={{ flex:2, padding:'10px 0', borderRadius:8, background:'var(--blue)', color:'#fff', fontWeight:700, cursor:'pointer' }}>SAVE</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── PROJECT TAB ── */}
      {tab === 'project' && (
        <div style={{ padding:16 }}>
          <h3 style={{ color:'var(--gold)', letterSpacing:1, fontSize:16, marginBottom:4 }}>&#128187; PROJECT TRACKER</h3>
          <p style={{ color:'var(--text2)', fontSize:12, marginBottom:16 }}>Add your current project to get a daily work quest.</p>
          {!project ? (
            <div style={{ background:'var(--surface)', border:'1px dashed var(--border)', borderRadius:12, padding:32, textAlign:'center' }}>
              <div style={{ fontSize:36, marginBottom:8 }}>&#128187;</div>
              <div style={{ color:'var(--text2)', fontSize:13, marginBottom:8 }}>No project added yet.</div>
              <div style={{ color:'var(--text2)', fontSize:12, marginBottom:20 }}>Working on something? Add it here to get a daily quest to stay on track.</div>
              <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                <button onClick={openProjectForm} style={{ background:'var(--blue)', color:'#fff', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer' }}>ADD PROJECT</button>
                <button style={{ background:'var(--card)', color:'var(--text2)', padding:'10px 24px', borderRadius:8, fontWeight:700, cursor:'pointer', border:'1px solid var(--border)' }}>SKIP FOR NOW</button>
              </div>
            </div>
          ) : (
            <div style={{ background:'var(--card)', border:'1px solid var(--blue)', borderRadius:12, padding:16, marginBottom:12 }}>
              <div style={{ color:'var(--text2)', fontSize:10, letterSpacing:1, marginBottom:4 }}>CURRENT PROJECT</div>
              <div style={{ fontWeight:700, fontSize:17, marginBottom:4 }}>{project.name}</div>
              <div style={{ color:'var(--text2)', fontSize:13, lineHeight:1.5, marginBottom:8 }}>{project.description}</div>
              <div style={{ color:'var(--text2)', fontSize:10, marginBottom:12 }}>Updated: {new Date(project.updated_at).toLocaleDateString()}</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={openProjectForm} style={{ flex:1, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', padding:'8px 0', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>EDIT</button>
                <button onClick={() => { clearProject(); load(); }} style={{ flex:1, background:'transparent', border:'1px solid var(--danger)', color:'var(--danger)', padding:'8px 0', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>REMOVE</button>
              </div>
            </div>
          )}
          {showProjectForm && (
            <div style={{ position:'fixed', inset:0, background:'#000a', zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={() => setShowProjectForm(false)}>
              <div style={{ background:'var(--surface)', borderRadius:'16px 16px 0 0', padding:20, width:'100%', maxWidth:480 }} onClick={e => e.stopPropagation()}>
                <h3 style={{ color:'var(--gold)', marginBottom:16 }}>{project ? 'EDIT PROJECT' : 'ADD PROJECT'}</h3>
                <input value={projName} onChange={e => setProjName(e.target.value)} placeholder="Project name" style={{ width:'100%', background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)', padding:'10px 14px', borderRadius:8, fontSize:14, marginBottom:12 }} />
                <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)} placeholder="Brief description of your project..." rows={4} style={{ width:'100%', background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16, resize:'none', fontFamily:'inherit' }} />
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setShowProjectForm(false)} style={{ flex:1, padding:'10px 0', borderRadius:8, background:'var(--card)', color:'var(--text2)', border:'1px solid var(--border)', fontWeight:700, cursor:'pointer' }}>CANCEL</button>
                  <button onClick={saveProjectForm} style={{ flex:2, padding:'10px 0', borderRadius:8, background:'var(--blue)', color:'#fff', fontWeight:700, cursor:'pointer' }}>SAVE</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── QUESTS TAB ── */}
      {tab === 'quests' && (
        <div style={{ padding:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
            <h3 style={{ color:'var(--gold)', letterSpacing:1, fontSize:16 }}>&#9876; QUEST EDITOR</h3>
            <button onClick={openAddQuest} style={{ background:'var(--blue)', color:'#fff', padding:'6px 14px', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>+ NEW</button>
          </div>
          <p style={{ color:'var(--text2)', fontSize:12, marginBottom:14 }}>Add, edit, enable or disable quests.</p>

          {/* Filter */}
          <div style={{ display:'flex', gap:6, marginBottom:14, overflowX:'auto', paddingBottom:4 }}>
            {['all','custom','daily','main','dungeon','training'].map(f => (
              <button key={f} onClick={() => setQuestFilter(f)} style={{ padding:'5px 12px', borderRadius:99, fontSize:11, fontWeight:700, background:questFilter===f?'var(--blue)':'var(--card)', color:questFilter===f?'#fff':'var(--text2)', border:'1px solid var(--border)', whiteSpace:'nowrap', cursor:'pointer' }}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          {filteredQuests.map(q => {
            const isDisabled = q.enabled === false;
            return (
              <div key={q.id} style={{ background:'var(--card)', border:'1px solid '+(isDisabled?'var(--border)':q.is_custom?'var(--purple)':'var(--border)'), borderRadius:10, padding:12, marginBottom:8, opacity:isDisabled?0.5:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:6, marginBottom:4, flexWrap:'wrap' }}>
                      <span dangerouslySetInnerHTML={{ __html:TYPE_ICON[q.type]||'&#128203;' }} style={{ fontSize:12 }} />
                      <span style={{ background:DIFF_COLOR[q.difficulty]+'22', color:DIFF_COLOR[q.difficulty], fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700 }}>{q.difficulty.toUpperCase()}</span>
                      <span style={{ color:'var(--gold)', fontSize:10, fontWeight:700 }}>+{q.xp_reward}XP</span>
                      {q.is_custom && <span style={{ background:'var(--purple)22', color:'var(--purple)', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700 }}>CUSTOM</span>}
                      {isDisabled && <span style={{ background:'var(--danger)22', color:'var(--danger)', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:700 }}>DISABLED</span>}
                    </div>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>{q.title}</div>
                    {q.description && <div style={{ color:'var(--text2)', fontSize:11 }}>{q.description}</div>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                  <button onClick={() => toggleQuestEnabled(q.id)} style={{ background:'var(--surface)', border:'1px solid var(--border)', color:isDisabled?'var(--success)':'var(--text2)', padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer' }}>
                    {isDisabled ? 'ENABLE' : 'DISABLE'}
                  </button>
                  <button onClick={() => openEditQuest(q)} style={{ background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text2)', padding:'4px 10px', borderRadius:6, fontSize:11, cursor:'pointer' }}>EDIT</button>
                  {q.is_custom && (
                    <button onClick={() => deleteQuest(q.id)} style={{ background:'transparent', border:'1px solid var(--danger)', color:'var(--danger)', padding:'4px 10px', borderRadius:6, fontSize:11, cursor:'pointer' }}>DEL</button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Quest form modal */}
          {showQuestForm && (
            <div style={{ position:'fixed', inset:0, background:'#000a', zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={() => setShowQuestForm(false)}>
              <div style={{ background:'var(--surface)', borderRadius:'16px 16px 0 0', padding:20, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
                <h3 style={{ color:'var(--gold)', marginBottom:16 }}>{editingQuest ? 'EDIT QUEST' : 'NEW QUEST'}</h3>
                <input value={qTitle} onChange={e => setQTitle(e.target.value)} placeholder="Quest title" style={{ width:'100%', background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)', padding:'10px 14px', borderRadius:8, fontSize:14, marginBottom:10 }} />
                <textarea value={qDesc} onChange={e => setQDesc(e.target.value)} placeholder="Description (optional)" rows={3} style={{ width:'100%', background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:10, resize:'none', fontFamily:'inherit' }} />
                <div style={{ marginBottom:10 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, marginBottom:6 }}>QUEST TYPE</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {['daily','main','dungeon','training'].map(t => (
                      <button key={t} onClick={() => setQType(t)} style={{ flex:1, padding:'7px 0', borderRadius:6, fontSize:11, fontWeight:700, background:qType===t?'var(--blue)':'var(--card)', color:qType===t?'#fff':'var(--text2)', border:'1px solid var(--border)', cursor:'pointer', minWidth:60 }}>{t.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:10 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, marginBottom:6 }}>DIFFICULTY</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {['easy','medium','hard'].map(d => (
                      <button key={d} onClick={() => { setQDiff(d); setQXP(d==='easy'?10:d==='medium'?25:50); }} style={{ flex:1, padding:'7px 0', borderRadius:6, fontSize:11, fontWeight:700, background:qDiff===d?DIFF_COLOR[d]:'var(--card)', color:qDiff===d?'#000':'var(--text2)', border:'1px solid var(--border)', cursor:'pointer' }}>{d.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <div style={{ color:'var(--text2)', fontSize:11, marginBottom:6 }}>XP REWARD: <span style={{ color:'var(--gold)', fontWeight:700 }}>{qXP} XP</span></div>
                  <input type="range" min={5} max={100} step={5} value={qXP} onChange={e => setQXP(Number(e.target.value))} style={{ width:'100%' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', color:'var(--text2)', fontSize:10 }}><span>5</span><span>50</span><span>100</span></div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setShowQuestForm(false)} style={{ flex:1, padding:'10px 0', borderRadius:8, background:'var(--card)', color:'var(--text2)', border:'1px solid var(--border)', fontWeight:700, cursor:'pointer' }}>CANCEL</button>
                  <button onClick={saveQuest} style={{ flex:2, padding:'10px 0', borderRadius:8, background:'var(--blue)', color:'#fff', fontWeight:700, cursor:'pointer' }}>SAVE QUEST</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {showEditProfile && (
        <EditProfile onClose={() => setShowEditProfile(false)} onSave={() => load()} />
      )}
    </div>
  );
}
