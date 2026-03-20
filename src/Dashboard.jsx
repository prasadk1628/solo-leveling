import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { initDB, getUser, createUser, assignDailyQuests, hasSeenWeeklyReview, markWeeklyReviewSeen } from './db/storage';
import Dashboard from './screens/Dashboard';
import Quests from './screens/Quests';
import Workout from './screens/Workout';
import Profile from './screens/Profile';
import LevelUpAnimation from './components/LevelUp';
import WeeklyReview from './components/WeeklyReview';
import './index.css';

export default function App() {
  const [ready, setReady] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [name, setName] = useState('');
  const [levelUpData, setLevelUpData] = useState(null);
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);

  useEffect(() => {
    initDB();
    const user = getUser();
    if (!user) { setShowSetup(true); }
    else {
      assignDailyQuests();
      setReady(true);
      // Show weekly review on Sunday if not seen yet
      if (new Date().getDay() === 0 && !hasSeenWeeklyReview()) {
        setTimeout(() => setShowWeeklyReview(true), 1000);
      }
    }
  }, []);

  // Global level-up listener
  useEffect(() => {
    const handler = (e) => setLevelUpData(e.detail);
    window.addEventListener('levelup', handler);
    return () => window.removeEventListener('levelup', handler);
  }, []);

  const handleCreate = () => {
    if (!name.trim()) return;
    createUser(name.trim());
    assignDailyQuests();
    setShowSetup(false);
    setReady(true);
  };

  if (showSetup) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:24, padding:24 }}>
      <div style={{ fontSize:64 }}>&#9876;</div>
      <h1 style={{ color:'var(--gold)', fontSize:28, letterSpacing:3, textAlign:'center' }}>SOLO LEVELING</h1>
      <p style={{ color:'var(--text2)', letterSpacing:2, fontSize:12 }}>SYSTEM INITIALIZATION</p>
      <input
        value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleCreate()}
        placeholder="Enter your hunter name..."
        style={{ background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', padding:'12px 20px', borderRadius:8, fontSize:16, width:280, textAlign:'center' }}
      />
      <button onClick={handleCreate} style={{ background:'var(--blue)', color:'#fff', padding:'12px 40px', borderRadius:8, fontSize:16, fontWeight:700, letterSpacing:1, cursor:'pointer' }}>
        BEGIN JOURNEY
      </button>
    </div>
  );

  if (!ready) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', color:'var(--text2)' }}>
      INITIALIZING...
    </div>
  );

  const navItems = [
    { path:'/', label:'Home', icon:'&#8962;' },
    { path:'/quests', label:'Quests', icon:'&#128203;' },
    { path:'/workout', label:'Train', icon:'&#128170;' },
    { path:'/profile', label:'Profile', icon:'&#128100;' },
  ];

  return (
    <BrowserRouter>
      <div style={{ maxWidth:480, margin:'0 auto', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1, overflowY:'auto', paddingBottom:70 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <nav style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, background:'var(--surface)', borderTop:'1px solid var(--border)', display:'flex', zIndex:100 }}>
          {navItems.map(({ path, label, icon }) => (
            <NavLink key={path} to={path} end={path==='/'} style={({ isActive }) => ({
              flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 0 6px', textDecoration:'none',
              color: isActive ? 'var(--blue)' : 'var(--text2)',
              borderTop: isActive ? '2px solid var(--blue)' : '2px solid transparent', gap:2
            })}>
              <span style={{ fontSize:20 }} dangerouslySetInnerHTML={{ __html:icon }} />
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.5 }}>{label.toUpperCase()}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Weekly review button on dashboard */}
      <button onClick={() => setShowWeeklyReview(true)} style={{
        position:'fixed', top:12, right:12, background:'var(--surface)', border:'1px solid var(--border)',
        color:'var(--text2)', padding:'6px 10px', borderRadius:8, fontSize:11, fontWeight:700,
        cursor:'pointer', zIndex:50, letterSpacing:0.5
      }}>
        &#128200; REVIEW
      </button>

      {levelUpData && <LevelUpAnimation data={levelUpData} onDone={() => setLevelUpData(null)} />}
      {showWeeklyReview && <WeeklyReview onClose={() => { markWeeklyReviewSeen(); setShowWeeklyReview(false); }} />}
    </BrowserRouter>
  );
}
