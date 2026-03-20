import React, { useState, useEffect } from 'react';
import { getUser, getStats, getTodayQuests, getAllQuests, xpForLevel, getRankColor } from '../db/storage';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [todayQuests, setTodayQuests] = useState([]);

  const load = () => { setUser(getUser()); setStats(getStats()); setTodayQuests(getTodayQuests()); };
  useEffect(() => { load(); const t = setInterval(load, 1000); return () => clearInterval(t); }, []);

  if (!user) return null;
  const xpNeeded = xpForLevel(user.level);
  const xpPct = Math.min(100, (user.xp / xpNeeded) * 100);
  const rankColor = getRankColor(user.rank);
  const allQuests = getAllQuests();
  const completed = todayQuests.filter(q => q.status === 'completed').length;

  return (
    <div style={{ padding:16 }}>
      <div style={{ background:'var(--surface)', borderRadius:12, padding:20, marginBottom:12, border:'1px solid var(--border)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:4 }}>HUNTER</div>
            <div style={{ fontSize:22, fontWeight:700 }}>{user.name}</div>
          </div>
          <div style={{ background:rankColor+'22', border:'2px solid '+rankColor, borderRadius:8, padding:'8px 16px', textAlign:'center' }}>
            <div style={{ color:rankColor, fontSize:24, fontWeight:900 }}>RANK {user.rank}</div>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ color:'var(--blue)', fontWeight:700 }}>LV.{user.level}</span>
          <span style={{ color:'var(--text2)', fontSize:12 }}>{user.xp} / {xpNeeded} XP</span>
        </div>
        <div style={{ background:'var(--card)', borderRadius:99, height:8, overflow:'hidden' }}>
          <div style={{ background:'var(--blue)', height:'100%', width:xpPct+'%', transition:'width 0.5s', borderRadius:99 }} />
        </div>
      </div>

      <div style={{ background:'#1a1025', border:'1px solid var(--purple)', borderRadius:10, padding:14, marginBottom:12 }}>
        <div style={{ color:'var(--purple)', fontSize:11, letterSpacing:2, marginBottom:4 }}>[ SYSTEM MESSAGE ]</div>
        <div style={{ fontSize:13 }}>The System has detected your presence, Hunter. Complete your daily quests to grow stronger.</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
        {[['STR', stats?.strength||0, 'var(--danger)'], ['END', stats?.endurance||0, 'var(--success)'], ['DIS', stats?.discipline||0, 'var(--blue)'], ['KNW', stats?.knowledge||0, 'var(--gold)']].map(([label, val, color]) => (
          <div key={label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ color:'var(--text2)', fontSize:12, fontWeight:700 }}>{label}</span>
            <span style={{ color, fontWeight:900, fontSize:18 }}>{val}</span>
          </div>
        ))}
      </div>

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, padding:14, marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:1 }}>CURRENT STREAK</div>
          <div style={{ color:'var(--gold)', fontSize:24, fontWeight:900 }}>{user.streak} days</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:1 }}>TODAYS PROGRESS</div>
          <div style={{ color:'var(--success)', fontSize:18, fontWeight:700 }}>{completed}/{todayQuests.length} quests</div>
        </div>
      </div>

      <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:8 }}>TODAYS QUESTS</div>
      {todayQuests.slice(0,3).map(uq => {
        const quest = allQuests.find(q => q.id === uq.quest_id);
        if (!quest) return null;
        return (
          <div key={uq.id} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13 }}>{quest.title}</span>
            <span style={{ fontSize:11, color:uq.status==='completed'?'var(--success)':uq.status==='failed'?'var(--danger)':'var(--text2)', fontWeight:700, textTransform:'uppercase' }}>{uq.status}</span>
          </div>
        );
      })}
    </div>
  );
}
