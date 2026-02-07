// localStorage 工具函數
const STORAGE_KEY = 'devotional_entries';
const SETTINGS_KEY = 'devotional_settings';

// 設置相關函數
export const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
    return null;
  }
};

export const hasSettings = () => {
  return getSettings() !== null;
};

// 清除所有設置和記錄
export const clearAllData = () => {
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(STORAGE_KEY);
};

// 只清除設置，保留記錄
export const clearSettings = () => {
  localStorage.removeItem(SETTINGS_KEY);
};

// 靈修記錄相關函數
export const saveEntry = (week, day, entry) => {
  const entries = getAllEntries();
  const key = `${week}-${day}`;
  entries[key] = {
    ...entry,
    week,
    day,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// 星期日專用的保存函數
export const saveSundayEntry = (week, entry) => {
  saveEntry(week, 7, entry);
};

// 獲取星期日的記錄
export const getSundayEntry = (week) => {
  return getEntry(week, 7);
};

export const getEntry = (week, day) => {
  const entries = getAllEntries();
  const key = `${week}-${day}`;
  return entries[key] || null;
};

export const getAllEntries = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

export const getWeekProgress = (week) => {
  const entries = getAllEntries();
  let completed = 0;
  // 週一到週五（1-5）需要填寫內容
  for (let day = 1; day <= 5; day++) {
    const key = `${week}-${day}`;
    if (entries[key] && entries[key].mainContent) {
      completed++;
    }
  }
  // 星期日（7）需要填寫聽道筆記
  const sundayKey = `${week}-7`;
  if (entries[sundayKey] && entries[sundayKey].sermonNotes) {
    completed++;
  }
  return { completed, total: 6 }; // 週一到週五 + 星期日 = 6天需要填寫
};

// 獲取整體進度（8週）
export const getOverallProgress = () => {
  let totalCompleted = 0;
  let totalDays = 0;
  for (let week = 1; week <= 8; week++) {
    const progress = getWeekProgress(week);
    totalCompleted += progress.completed;
    totalDays += progress.total;
  }
  return { completed: totalCompleted, total: totalDays };
};

// 檢查某一天是否已完成
export const isDayCompleted = (week, day) => {
  const entry = getEntry(week, day);
  if (day === 7) {
    // 星期日：檢查是否有聽道筆記
    return entry && entry.sermonNotes && entry.sermonNotes.trim() !== '';
  } else if (day === 6) {
    // 星期六：不需要填寫，不算完成
    return false;
  } else {
    // 週一到週五：檢查是否有主要內容
    return entry && entry.mainContent && entry.mainContent.trim() !== '';
  }
};
