Solo Leveling — Gamified Student Productivity App
A dark-themed RPG productivity web app inspired by the Solo Leveling manga/anime. Turn your real-life habits, studies, and workouts into quests. Earn XP, level up, and rise through the ranks from E to S.
Live Demo: https://solo-levveling.netlify.app


___________________________________________________________________________________________________________________________________

Features

Quest Board — Daily, Main, Dungeon, and Training quests with XP rewards, difficulty levels, and step-by-step completion guides
Study Planner — Add subjects with difficulty, priority, and scheduled days. Study quests auto-appear on your chosen days with exam countdown timers
Project Tracker — Add your current project and get a daily quest to work on it
Custom Quest Editor — Create, edit, enable, or disable any quest
Training Ground — Phase-locked workout progressions (Phase 1/2/3) that unlock as you level up, with exercise timers
Pomodoro Timer — Built into study quests, 25-minute focus sessions with 5-minute breaks
Hunter Profile — Choose your class (Warrior, Mage, Assassin, Tank, Healer), upload a profile photo, track stats (STR/END/DIS/KNW)
XP and Leveling System — XP formula scales with level, animated level-up screen, rank progression E → D → C → B → A → S
Achievements — First Blood, On Fire, Dungeon Raider, Night Owl, Iron Discipline, Rank Up
Weekly Review — Performance report with completion rate, XP earned, best day, quest breakdown, and System evaluation
Streak System — Daily streak tracking with penalty quests for missed days
PWA — Installable on Android home screen, works fully offline


___________________________________________________________________________________________________________________________________

Tech Stack
LayerTechnologyFrameworkReact 19 + Vite 8RoutingReact Router DOM v6StoragelocalStorage (offline-first, no backend)PWAvite-plugin-pwa + WorkboxDeploymentNetlifyStylingInline CSS (no Tailwind, no CSS frameworks)

Project Structure
src/
├── main.jsx
├── App.jsx
├── index.css
├── db/
│   └── storage.js          # All localStorage operations
├── screens/
│   ├── Dashboard.jsx       # XP bar, stats, streak, today's quests
│   ├── Quests.jsx          # Quest board with Pomodoro integration
│   ├── Workout.jsx         # Phase-locked training with timers
│   └── Profile.jsx         # Hunter/Study/Project/Quests tabs
└── components/
    ├── EditProfile.jsx     # Name, avatar, photo editor
    ├── LevelUp.jsx         # Level-up animation overlay
    ├── Pomodoro.jsx        # 25/5 min timer
    └── WeeklyReview.jsx    # Weekly performance report


___________________________________________________________________________________________________________________________________
Running Locally
bash# Clone the repo
git clone https://github.com/prasadk1628/solo-leveling.git
cd solo-leveling

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev -- --host
Open http://localhost:5173 in your browser.


___________________________________________________________________________________________________________________________________
Building for Production
bashnpm run build
Output goes to the dist/ folder. Deploy by dragging dist/ to Netlify or pushing to GitHub with Netlify auto-deploy configured.

___________________________________________________________________________________________________________________________________
How the Leveling System Works

XP required to level up: 100 × level²
Rank thresholds: E (Lv 1-4) → D (Lv 5-11) → C (Lv 12-21) → B (Lv 22-34) → A (Lv 35-49) → S (Lv 50+)
Stats increase when you complete quests: Discipline (daily), Knowledge (main), Endurance (dungeon), Strength (training)
Training Ground phases unlock at Level 1, 5, and 10
___________________________________________________________________________________________________________________________________

License
MIT — free to use, modify, and distribute.
___________________________________________________________________________________________________________________________________
"Arise." — Sung Jin-Woo
