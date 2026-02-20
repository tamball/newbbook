import { getSettings } from './storage';

// Calculate actual date based on week and day (7 days per week)
export const getActualDate = (week, day) => {
  const settings = getSettings();
  if (!settings || !settings.startDate) {
    return null;
  }

  const startDate = new Date(settings.startDate);
  // 7 days per week, so calculate offset: Week 1 Day 1 = 0, Week 1 Day 2 = 1, Week 2 Day 1 = 7...
  const daysOffset = (week - 1) * 7 + (day - 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + daysOffset);
  
  return currentDate;
};

// Get current date and day of week
export const getCurrentDateInfo = () => {
  const today = new Date();
  return {
    date: today,
    dateStr: formatDate(today),
    weekday: today.toLocaleDateString('en-US', { weekday: 'long' }),
    dayOfWeek: today.getDay() // 0 = Sunday, 6 = Saturday
  };
};

// Format date display
export const formatDate = (date) => {
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

// Format date as short format
export const formatDateShort = (date) => {
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
