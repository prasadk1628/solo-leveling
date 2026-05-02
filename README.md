# ⚔️ Solo Leveling — Gamified Productivity System

> *"Arise."* — Sung Jin-Woo

A dark-themed, RPG-inspired productivity app that transforms real-life habits, study sessions, and workouts into quests. Earn XP, level up, and climb the ranks from **E → S**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-brightgreen)](https://solo-levveling.netlify.app)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Supported-purple)](https://solo-levveling.netlify.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)

---

## 🧠 What Is This?

Most productivity apps feel like chores. This one feels like a game.

Solo Leveling replaces boring task lists with **quests, XP, ranks, and achievements** — using behavioral reinforcement to make consistency actually rewarding. Built as a fully offline PWA, no account or backend needed.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎯 **Quest System** | Daily, Main, Dungeon & Training quests with XP rewards |
| 📚 **Study Planner** | Subject-based planning with auto-generated study quests & exam countdowns |
| 🏋️ **Training Ground** | Phase-based workout system that unlocks with level progression |
| ⏱️ **Pomodoro Timer** | 25-min focus sessions embedded directly into study quests |
| 🧑 **Hunter Profile** | Choose a class (Warrior, Mage, Assassin, Tank, Healer) and track STR/END/DIS/KNW stats |
| ⚡ **XP & Ranking** | XP scales as `100 × level²` with animated level-up transitions |
| 🏆 **Achievements** | First Blood, On Fire, Dungeon Raider, Night Owl, Iron Discipline, Rank Up |
| 🔥 **Streak System** | Daily streak tracking with penalty quests for missed days |
| 📊 **Weekly Review** | Completion rate, XP earned, best day, quest distribution |
| 📱 **PWA Support** | Installable on Android, works fully offline |

---

## 📈 Rank Progression

```
E (Lv 1–4) → D (Lv 5–11) → C (Lv 12–21) → B (Lv 22–34) → A (Lv 35–49) → S (Lv 50+)
```

XP required to level up: `100 × level²`

Stats grow based on what you actually do:
- **Discipline (DIS)** ← Daily quests
- **Knowledge (KNW)** ← Main quests
- **Endurance (END)** ← Dungeon quests
- **Strength (STR)** ← Training

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router DOM v6 |
| Storage | localStorage (offline-first) |
| PWA | vite-plugin-pwa + Workbox |
| Deployment | Netlify |

---

## 📂 Project Structure

```
src/
├── main.jsx
├── App.jsx
├── index.css
├── db/
│   └── storage.js
├── screens/
│   ├── Dashboard.jsx
│   ├── Quests.jsx
│   ├── Workout.jsx
│   └── Profile.jsx
└── components/
    ├── EditProfile.jsx
    ├── LevelUp.jsx
    ├── Pomodoro.jsx
    └── WeeklyReview.jsx
```

---

## ▶️ Run Locally

```bash
git clone https://github.com/prasadk1628/solo-leveling.git
cd solo-leveling
npm install --legacy-peer-deps
npm run dev -- --host
```

Open: [http://localhost:5173](http://localhost:5173)

**Build for production:**
```bash
npm run build
# Output: /dist folder
```

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

*Inspired by the Solo Leveling manhwa series.*
