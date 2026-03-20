const KEYS = {
  user: 'sl_user', stats: 'sl_stats', quests: 'sl_quests',
  userQuests: 'sl_user_quests', exercises: 'sl_exercises',
  xpLogs: 'sl_xp_logs', achievements: 'sl_achievements',
  userAchievements: 'sl_user_achievements',
  subjects: 'sl_subjects', project: 'sl_project',
};
const get = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const xpForLevel = (level) => 100 * level * level;
export const rankFromLevel = (level) => {
  if (level >= 50) return 'S'; if (level >= 35) return 'A';
  if (level >= 22) return 'B'; if (level >= 12) return 'C';
  if (level >= 5) return 'D'; return 'E';
};
export const getRankColor = (rank) => ({ E:'#9ca3af',D:'#3dd68c',C:'#4a9eff',B:'#a78bfa',A:'#e8b84b',S:'#ff4a6b' }[rank]||'#9ca3af');

const seedQuests = () => [
  {id:1,title:'Morning Workout',description:'Complete todays workout session',difficulty:'medium',type:'daily',xp_reward:25,is_penalty:false},
  {id:2,title:'Study Session',description:'Study for at least 1 hour',difficulty:'medium',type:'daily',xp_reward:25,is_penalty:false},
  {id:3,title:'Drink 2L Water',description:'Stay hydrated throughout the day',difficulty:'easy',type:'daily',xp_reward:10,is_penalty:false},
  {id:4,title:'Read 20 Pages',description:'Read a book or educational material',difficulty:'easy',type:'daily',xp_reward:10,is_penalty:false},
  {id:5,title:'No Junk Food',description:'Avoid junk food for the entire day',difficulty:'hard',type:'daily',xp_reward:50,is_penalty:false},
  {id:6,title:'Complete 100 Push-ups',description:'Finish 100 push-ups in total today',difficulty:'hard',type:'main',xp_reward:50,is_penalty:false},
  {id:7,title:'Dungeon Run',description:'Complete a full workout circuit without rest',difficulty:'hard',type:'dungeon',xp_reward:50,is_penalty:false},
  {id:8,title:'Speed Training',description:'Do 20 minutes of cardio',difficulty:'medium',type:'training',xp_reward:25,is_penalty:false},
  {id:9,title:'Penalty Quest',description:'You missed yesterday. Complete this to avoid XP loss.',difficulty:'hard',type:'daily',xp_reward:0,is_penalty:true},
];
const seedExercises = () => [
  {id:1,name:'Wall Push-ups',description:'Stand arms length from wall, push against it',muscle_group:'Chest',difficulty:'easy',reps:'3x10',has_timer:false,timer_sec:0,xp_reward:5,phase:1},
  {id:2,name:'Bodyweight Squats',description:'Feet shoulder-width apart, lower until thighs parallel',muscle_group:'Legs',difficulty:'easy',reps:'3x15',has_timer:false,timer_sec:0,xp_reward:5,phase:1},
  {id:3,name:'Plank Hold',description:'Hold a straight body position on forearms',muscle_group:'Core',difficulty:'easy',reps:'3 sets',has_timer:true,timer_sec:10,xp_reward:5,phase:1},
  {id:4,name:'Jumping Jacks',description:'Classic full-body warm-up movement',muscle_group:'Full Body',difficulty:'easy',reps:'3x20',has_timer:false,timer_sec:0,xp_reward:5,phase:1},
  {id:5,name:'Knee Push-ups',description:'Push-ups with knees on ground for support',muscle_group:'Chest',difficulty:'easy',reps:'3x12',has_timer:false,timer_sec:0,xp_reward:8,phase:2},
  {id:6,name:'Bodyweight Squats',description:'Deeper range of motion this phase',muscle_group:'Legs',difficulty:'medium',reps:'4x15',has_timer:false,timer_sec:0,xp_reward:8,phase:2},
  {id:7,name:'Plank Hold',description:'Longer hold with focus on form',muscle_group:'Core',difficulty:'medium',reps:'3 sets',has_timer:true,timer_sec:15,xp_reward:8,phase:2},
  {id:8,name:'Glute Bridge',description:'Lie on back, push hips up and squeeze glutes',muscle_group:'Glutes',difficulty:'easy',reps:'3x15',has_timer:false,timer_sec:0,xp_reward:8,phase:2},
  {id:9,name:'Full Push-ups',description:'Standard push-ups with full range of motion',muscle_group:'Chest',difficulty:'medium',reps:'4x10',has_timer:false,timer_sec:0,xp_reward:10,phase:3},
  {id:10,name:'Bodyweight Squats',description:'Explosive squats this phase',muscle_group:'Legs',difficulty:'medium',reps:'4x20',has_timer:false,timer_sec:0,xp_reward:10,phase:3},
  {id:11,name:'Mountain Climbers',description:'Alternate driving knees to chest in plank position',muscle_group:'Core',difficulty:'hard',reps:'3x20',has_timer:false,timer_sec:0,xp_reward:10,phase:3},
  {id:12,name:'Plank Hold',description:'Maximum hold with perfect form',muscle_group:'Core',difficulty:'hard',reps:'3 sets',has_timer:true,timer_sec:20,xp_reward:10,phase:3},
];
const seedAchievements = () => [
  {id:1,key:'first_blood',title:'First Blood',description:'Complete your very first quest',icon:'sword',xp_reward:50},
  {id:2,key:'on_fire',title:'On Fire',description:'Maintain a 7-day streak',icon:'fire',xp_reward:100},
  {id:3,key:'dungeon_raider',title:'Dungeon Raider',description:'Complete a dungeon quest',icon:'castle',xp_reward:75},
  {id:4,key:'night_owl',title:'Night Owl',description:'Complete a quest after 10 PM',icon:'owl',xp_reward:50},
  {id:5,key:'iron_discipline',title:'Iron Discipline',description:'Maintain a 30-day streak',icon:'shield',xp_reward:500},
  {id:6,key:'rank_up',title:'Rank Up',description:'Reach a new rank',icon:'star',xp_reward:200},
];

export const initDB = () => {
  if (!get(KEYS.quests)) set(KEYS.quests, seedQuests());
  if (!get(KEYS.exercises)) set(KEYS.exercises, seedExercises());
  if (!get(KEYS.achievements)) set(KEYS.achievements, seedAchievements());
  if (!get(KEYS.userQuests)) set(KEYS.userQuests, []);
  if (!get(KEYS.xpLogs)) set(KEYS.xpLogs, []);
  if (!get(KEYS.userAchievements)) set(KEYS.userAchievements, []);
  if (!get(KEYS.subjects)) set(KEYS.subjects, []);
};

export const getUser = () => get(KEYS.user);
export const getStats = () => get(KEYS.stats) || {strength:0,endurance:0,discipline:0,knowledge:0};
export const createUser = (name) => {
  const user = {id:1,name,level:1,xp:0,rank:'E',streak:0,last_active:null,created_at:new Date().toISOString(),avatar:'warrior',photo:null};
  set(KEYS.user, user); set(KEYS.stats, {strength:0,endurance:0,discipline:0,knowledge:0}); return user;
};
export const saveUser = (user) => set(KEYS.user, user);
export const saveStats = (stats) => set(KEYS.stats, stats);

// ── Subjects ──
export const getSubjects = () => get(KEYS.subjects) || [];
export const saveSubjects = (subjects) => set(KEYS.subjects, subjects);
export const addSubject = (subject) => {
  const subjects = getSubjects();
  subjects.push({ id: Date.now(), ...subject });
  set(KEYS.subjects, subjects);
};
export const deleteSubject = (id) => {
  set(KEYS.subjects, getSubjects().filter(s => s.id !== id));
};
export const updateSubject = (id, updates) => {
  set(KEYS.subjects, getSubjects().map(s => s.id === id ? {...s, ...updates} : s));
};

// ── Project ──
export const getProject = () => get(KEYS.project);
export const saveProject = (project) => set(KEYS.project, project);
export const clearProject = () => localStorage.removeItem(KEYS.project);

export const addXP = (amount, reason='') => {
  const user = getUser(); if (!user) return;
  const oldLevel = user.level;
  const oldRank = user.rank;
  let newXP = Math.max(0, user.xp + amount), newLevel = user.level;
  while (newXP >= xpForLevel(newLevel)) { newXP -= xpForLevel(newLevel); newLevel++; }
  const newRank = rankFromLevel(newLevel);
  const updated = {...user, xp:newXP, level:newLevel, rank:newRank};
  saveUser(updated);
  const logs = get(KEYS.xpLogs) || [];
  logs.unshift({id:Date.now(), xp_change:amount, reason, timestamp:new Date().toISOString()});
  set(KEYS.xpLogs, logs.slice(0,50));
  return { user: updated, levelChanged: newLevel > oldLevel, rankChanged: newRank !== oldRank };
};

export const getAllQuests = () => get(KEYS.quests) || [];
export const saveQuests = (quests) => set(KEYS.quests, quests);
export const getUserQuests = () => get(KEYS.userQuests) || [];
export const getTodayQuests = () => {
  const today = new Date().toDateString();
  return getUserQuests().filter(uq => new Date(uq.assigned_at).toDateString() === today);
};

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export const assignDailyQuests = () => {
  const today = new Date().toDateString();
  const todayDay = DAY_NAMES[new Date().getDay()];
  if (getUserQuests().filter(uq => new Date(uq.assigned_at).toDateString() === today).length > 0) return;

  const allQ = getAllQuests().filter(q => q.enabled !== false);
  const daily = allQ.filter(q => !q.is_penalty && q.type === 'daily').slice(0,3);
  const main = allQ.filter(q => q.type === 'main').slice(0,1);
  const dungeon = allQ.filter(q => q.type === 'dungeon').slice(0,1);
  const training = allQ.filter(q => q.type === 'training').slice(0,1);
  const toAssign = [...daily, ...main, ...dungeon, ...training];

  const allUQ = getUserQuests();
  let idOffset = 0;
  toAssign.forEach(q => {
    idOffset++;
    allUQ.push({id:Date.now()+idOffset, quest_id:q.id, status:'pending', assigned_at:new Date().toISOString(), completed_at:null, is_dynamic:false});
  });

  // Add subject quests for today
  const subjects = getSubjects();
  subjects.forEach(sub => {
    if (sub.days && sub.days.includes(todayDay)) {
      const xp = sub.difficulty === 'hard' ? 40 : sub.difficulty === 'medium' ? 25 : 15;
      idOffset++;
      allUQ.push({
        id: Date.now()+idOffset,
        quest_id: null,
        status: 'pending',
        assigned_at: new Date().toISOString(),
        completed_at: null,
        is_dynamic: true,
        dynamic_type: 'subject',
        title: 'Study: ' + sub.name,
        description: 'Spend 1 hour studying ' + sub.name + '. Priority: ' + sub.priority + '. Difficulty: ' + sub.difficulty + '.',
        difficulty: sub.difficulty,
        type: 'daily',
        xp_reward: xp,
        subject_id: sub.id,
      });
    }
  });

  // Add project quest if project exists
  const project = getProject();
  if (project) {
    idOffset++;
    allUQ.push({
      id: Date.now()+idOffset,
      quest_id: null,
      status: 'pending',
      assigned_at: new Date().toISOString(),
      completed_at: null,
      is_dynamic: true,
      dynamic_type: 'project',
      title: 'Work on: ' + project.name,
      description: 'Spend 1 hour on your project: ' + project.description,
      difficulty: 'medium',
      type: 'main',
      xp_reward: 30,
    });
  }

  set(KEYS.userQuests, allUQ);
};

export const completeQuest = (userQuestId) => {
  const allUQ = getUserQuests();
  const uq = allUQ.find(q => q.id === userQuestId);
  if (!uq || uq.status === 'completed') return;
  uq.status = 'completed'; uq.completed_at = new Date().toISOString();
  set(KEYS.userQuests, allUQ);

  const xp = uq.is_dynamic ? uq.xp_reward : (getAllQuests().find(q => q.id === uq.quest_id)?.xp_reward || 0);
  const title = uq.is_dynamic ? uq.title : (getAllQuests().find(q => q.id === uq.quest_id)?.title || '');
  const type = uq.is_dynamic ? uq.type : (getAllQuests().find(q => q.id === uq.quest_id)?.type || 'daily');
  addXP(xp, 'Completed: ' + title);

  const statMap = {training:'strength',dungeon:'endurance',daily:'discipline',main:'knowledge'};
  const stats = getStats();
  stats[statMap[type]||'discipline'] = (stats[statMap[type]||'discipline']||0)+1;
  saveStats(stats);
  updateStreak();
  checkAchievements();
};

export const failQuest = (userQuestId) => {
  const allUQ = getUserQuests();
  const uq = allUQ.find(q => q.id === userQuestId);
  if (!uq) return; uq.status = 'failed';
  set(KEYS.userQuests, allUQ);
  addXP(-10, 'Failed a quest');
};

export const updateStreak = () => {
  const user = getUser(); if (!user) return;
  const today = new Date().toDateString();
  if (user.last_active === today) return;
  const yesterday = new Date(Date.now()-86400000).toDateString();
  saveUser({...user, streak: user.last_active===yesterday ? user.streak+1 : 1, last_active:today});
};

export const getAchievements = () => get(KEYS.achievements) || [];
export const getUserAchievements = () => get(KEYS.userAchievements) || [];
export const unlockAchievement = (key) => {
  const achievement = getAchievements().find(a => a.key === key); if (!achievement) return;
  const ua = getUserAchievements();
  if (ua.find(a => a.achievement_id === achievement.id)) return;
  ua.push({id:Date.now(), achievement_id:achievement.id, unlocked_at:new Date().toISOString()});
  set(KEYS.userAchievements, ua);
  if (achievement.xp_reward > 0) addXP(achievement.xp_reward, 'Achievement: '+achievement.title);
};
export const checkAchievements = () => {
  const user = getUser(); if (!user) return;
  const completed = getUserQuests().filter(q => q.status === 'completed');
  if (completed.length >= 1) unlockAchievement('first_blood');
  if (user.streak >= 7) unlockAchievement('on_fire');
  if (user.streak >= 30) unlockAchievement('iron_discipline');
  if (user.rank !== 'E') unlockAchievement('rank_up');
  if (completed.filter(uq => {
    if (uq.is_dynamic) return false;
    return getAllQuests().find(q => q.id===uq.quest_id)?.type==='dungeon';
  }).length >= 1) unlockAchievement('dungeon_raider');
  if (new Date().getHours() >= 22 && completed.length > 0) unlockAchievement('night_owl');
};
export const getXPLogs = () => get(KEYS.xpLogs) || [];
export const getExercisesByPhase = (phase) => (get(KEYS.exercises)||[]).filter(e => e.phase === phase);
export const resetTodayQuests = () => {
  const today = new Date().toDateString();
  set(KEYS.userQuests, getUserQuests().filter(uq => new Date(uq.assigned_at).toDateString() !== today));
};

// Weekly review helpers
export const getWeeklyReviewKey = () => {
  const d = new Date();
  const week = Math.floor(d.getTime() / (7 * 86400000));
  return 'sl_weekly_reviewed_' + week;
};
export const hasSeenWeeklyReview = () => !!localStorage.getItem(getWeeklyReviewKey());
export const markWeeklyReviewSeen = () => localStorage.setItem(getWeeklyReviewKey(), '1');

export const updateProfile = (updates) => {
  const user = getUser();
  if (!user) return;
  saveUser({...user, ...updates});
};

export const AVATARS = [
  { key:'warrior', label:'Warrior', icon:'&#9876;', color:'#ff4a6b', desc:'Frontline fighter, masters of strength' },
  { key:'mage', label:'Mage', icon:'&#10024;', color:'#a78bfa', desc:'Arcane scholar, masters of knowledge' },
  { key:'assassin', label:'Assassin', icon:'&#128255;', color:'#3dd68c', desc:'Shadow hunter, masters of speed' },
  { key:'tank', label:'Tank', icon:'&#128737;', color:'#4a9eff', desc:'Ironclad guardian, masters of endurance' },
  { key:'healer', label:'Healer', icon:'&#10084;', color:'#e8b84b', desc:'Support specialist, masters of discipline' },
];
