import React, { useState, useRef } from 'react';
import { getUser, updateProfile, getRankColor, AVATARS } from '../db/storage';

export default function EditProfile({ onClose, onSave }) {
  const user = getUser();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'warrior');
  const [photo, setPhoto] = useState(user?.photo || null);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
  const fileRef = useRef();

  const rankColor = getRankColor(user?.rank || 'E');

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target.result);
      setPhotoPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    updateProfile({ name: name.trim(), avatar, photo });
    onSave();
    onClose();
  };

  const selectedAvatar = AVATARS.find(a => a.key === avatar) || AVATARS[0];

  return (
    <div style={{ position:'fixed', inset:0, background:'#000c', zIndex:300, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:'var(--surface)', borderRadius:'16px 16px 0 0', padding:20, width:'100%', maxWidth:480, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ color:'var(--gold)', fontSize:16, letterSpacing:1 }}>EDIT PROFILE</h3>
          <button onClick={onClose} style={{ background:'transparent', color:'var(--text2)', fontSize:20, cursor:'pointer' }}>&#10005;</button>
        </div>

        {/* Photo upload */}
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <div style={{ position:'relative', width:90, height:90, margin:'0 auto 10px', cursor:'pointer' }} onClick={() => fileRef.current.click()}>
            {photoPreview ? (
              <img src={photoPreview} alt="profile" style={{ width:90, height:90, borderRadius:'50%', objectFit:'cover', border:'3px solid '+rankColor }} />
            ) : (
              <div style={{ width:90, height:90, borderRadius:'50%', background:'var(--card)', border:'3px solid '+rankColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}
                dangerouslySetInnerHTML={{ __html: selectedAvatar.icon }} />
            )}
            <div style={{ position:'absolute', bottom:0, right:0, background:'var(--blue)', borderRadius:'50%', width:26, height:26, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>
              &#128247;
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhoto} />
          <div style={{ color:'var(--text2)', fontSize:11 }}>Tap to upload photo</div>
          {photoPreview && (
            <button onClick={() => { setPhoto(null); setPhotoPreview(null); }} style={{ background:'transparent', color:'var(--danger)', fontSize:11, cursor:'pointer', marginTop:4 }}>
              Remove photo
            </button>
          )}
        </div>

        {/* Name */}
        <div style={{ marginBottom:16 }}>
          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:1, marginBottom:6 }}>HUNTER NAME</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your hunter name" style={{ width:'100%', background:'var(--card)', border:'1px solid var(--border)', color:'var(--text)', padding:'10px 14px', borderRadius:8, fontSize:15, fontWeight:700 }} />
        </div>

        {/* Avatar selector */}
        <div style={{ marginBottom:20 }}>
          <div style={{ color:'var(--text2)', fontSize:11, letterSpacing:1, marginBottom:10 }}>HUNTER CLASS</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {AVATARS.map(a => (
              <div key={a.key} onClick={() => setAvatar(a.key)} style={{
                background: avatar===a.key ? a.color+'22' : 'var(--card)',
                border: '2px solid '+(avatar===a.key ? a.color : 'var(--border)'),
                borderRadius:10, padding:'12px 10px', cursor:'pointer', textAlign:'center',
                transition:'all 0.2s'
              }}>
                <div style={{ fontSize:28, marginBottom:4 }} dangerouslySetInnerHTML={{ __html: a.icon }} />
                <div style={{ color: avatar===a.key ? a.color : 'var(--text)', fontWeight:700, fontSize:13 }}>{a.label}</div>
                <div style={{ color:'var(--text2)', fontSize:10, marginTop:2, lineHeight:1.3 }}>{a.desc}</div>
                {avatar===a.key && <div style={{ color:a.color, fontSize:10, fontWeight:700, marginTop:4 }}>SELECTED &#10003;</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onClose} style={{ flex:1, padding:'11px 0', borderRadius:8, background:'var(--card)', color:'var(--text2)', border:'1px solid var(--border)', fontWeight:700, cursor:'pointer' }}>CANCEL</button>
          <button onClick={handleSave} style={{ flex:2, padding:'11px 0', borderRadius:8, background:'var(--blue)', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>SAVE CHANGES</button>
        </div>
      </div>
    </div>
  );
}
