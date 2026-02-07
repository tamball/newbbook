import { getSettings } from './storage';

// 根據週次和天數計算實際日期（每週7天）
export const getActualDate = (week, day) => {
  const settings = getSettings();
  if (!settings || !settings.startDate) {
    return null;
  }

  const startDate = new Date(settings.startDate);
  // 每週7天，所以計算偏移量：第1週第1天 = 0，第1週第2天 = 1，第2週第1天 = 7...
  const daysOffset = (week - 1) * 7 + (day - 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + daysOffset);
  
  return currentDate;
};

// 獲取當前日期和星期幾
export const getCurrentDateInfo = () => {
  const today = new Date();
  return {
    date: today,
    dateStr: formatDate(today),
    weekday: today.toLocaleDateString('zh-TW', { weekday: 'long' }),
    dayOfWeek: today.getDay() // 0 = 星期日, 6 = 星期六
  };
};

// 格式化日期顯示
export const formatDate = (date) => {
  if (!date) return '';
  
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

// 格式化日期為簡短格式
export const formatDateShort = (date) => {
  if (!date) return '';
  
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
