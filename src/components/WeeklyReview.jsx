import React, { useEffect, useState } from 'react';
import { getUserQuests, getAllQuests, getXPLogs, getUser } from '../db/storage';

export default function WeeklyReview({ onClose }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const user = getUser();
    const now = new Date();
    const weekAgo = new Date(now - 7 * 86400000);

    const allUQ = getUserQuests().filter(uq => new Date(uq.assigned_at) >= weekAgo);
    const completed = allUQ.filter(q => q.status === 'completed');
    const failed = allUQ.filter(q => q.status === 'failed');
    const allQ = getAllQuests();

    // XP this week
    const logs = getXPLogs().filter(l => new Date(l.timestamp) >= weekAgo);
    const xpEarned = logs.filter(l => l.xp_change > 0).reduce((s, l) => s + l.xp_change, 0);
    const xpLost = Math.abs(logs.filter(l => l.xp_change < 0).reduce((s, l) => s + l.xp_change, 0));

    // Best day
    const byDay = {};
    completed.forEach(uq => {
      const day = new Date(uq.completed_at || uq.assigned_at).toLocaleDateString('en-US', { weekday:'short' });
      byDay[day] = (byDay[day] || 0) + 1;
    });
    const bestDay = Object.entries(byDay).sort((a,b) => b[1]-a[1])[0];

    // Quest type breakdown
    const typeBreakdown = {};
    completed.forEach(uq => {
      const type = uq.is_dynamic ? uq.type : (allQ.find(q => q.id === uq.quest_id)?.type || 'daily');
      typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
    });

    setStats({
      total: allUQ.length,
      completed: completed.length,
      failed: failed.length,
      xpEarned,
      xpLost,
      bestDay: bestDay ? bestDay[0] : 'N/A',
      streak: user?.streak || 0,
      typeBreakdown,
      completionRate: allUQ.length ? Math.round((completed.length / allUQ.length) * 100) : 0,
    });
  }, []);

  if (!stats) return null;

  const grade = stats.completionRate >= 90 ? { label:'S', color:'#ff4a6b' } :
                stats.completionRate >= 75 ? { label:'A', color:'#e8b84b' } :
                stats.completionRate >= 60 ? { label:'B', color:'#a78bfa' } :
                stats.completionRate >= 40 ? { label:'C', color:'#4a9eff' } :
                stats.completionRate >= 20 ? { label:'D', color:'#3dd68c' } :
                                             { label:'E', color:'#9ca3af' };

  const typeIcon = { daily:'&#128197;', main:'&#9876;', dungeon:'&#127984;', training:'&#127939;' };

  return (
    <div style={{ position:'fixed', inset:0, background:'#000c', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:16, padding:24, width:'100%', maxWidth:420, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:4 }}>WEEKLY PERFORMANCE REPORT</div>
          <div style={{ fontSize:13, color:'var(--text2)' }}>Last 7 days</div>
        </div>

        {/* Grade */}
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ width:90, height:90, borderRadius:'50%', border:'3px solid '+grade.color, margin:'0 auto 10px', display:'flex', alignItems:'center', justifyContent:'center', background:grade.color+'11', boxShadow:'0 0 20px '+grade.color+'44' }}>
            <span style={{ fontSize:44, fontWeight:900, color:grade.color }}>{grade.label}</span>
          </div>
          <div style={{ color:grade.color, fontWeight:700, fontSize:14, letterSpacing:1 }}>
            {stats.completionRate}% COMPLETION RATE
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
          {[
            ['Quests Done', stats.completed, 'var(--success)'],
            ['Quests Failed', stats.failed, 'var(--danger)'],
            ['XP Earned', '+'+stats.xpEarned, 'var(--blue)'],
            ['XP Lost', '-'+stats.xpLost, 'var(--danger)'],
            ['Current Streak', stats.streak+' days', 'var(--gold)'],
            ['Best Day', stats.bestDay, 'var(--purple)'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 14px' }}>
              <div style={{ color:'var(--text2)', fontSize:10, marginBottom:4 }}>{label}</div>
              <div style={{ color, fontWeight:700, fontSize:18 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Quest type breakdown */}
        {Object.keys(stats.typeBreakdown).length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:2, marginBottom:8 }}>QUEST BREAKDOWN</div>
            {Object.entries(stats.typeBreakdown).map(([type, count]) => (
              <div key={type} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ color:'var(--text)', fontSize:13 }}>
                  <span dangerouslySetInnerHTML={{ __html:(typeIcon[type]||'&#128203;')+' ' }} />{type.toUpperCase()}
                </span>
                <span style={{ color:'var(--success)', fontWeight:700 }}>{count} completed</span>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        <div style={{ background:'#1a1025', border:'1px solid var(--purple)', borderRadius:10, padding:12, marginBottom:16, textAlign:'center' }}>
          <div style={{ color:'var(--purple)', fontSize:10, letterSpacing:1, marginBottom:4 }}>[ SYSTEM EVALUATION ]</div>
          <div style={{ color:'var(--text)', fontSize:13 }}>
            {stats.completionRate >= 75 ? 'Outstanding performance this week, Hunter. The System is pleased.' :
             stats.completionRate >= 50 ? 'Acceptable performance. Push harder next week to rise in rank.' :
             'Your growth has been slow. The System demands more effort.'}
          </div>
        </div>

        <button onClick={onClose} style={{ width:'100%', background:'var(--blue)', color:'#fff', padding:'12px 0', borderRadius:10, fontWeight:700, fontSize:14, cursor:'pointer' }}>
          CLOSE REPORT
        </button>
      </div>
    </div>
  );
}
