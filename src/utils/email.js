import { getSettings } from './storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { getActualDate, formatDate } from './dateUtils';
import { t } from './i18n';

const notFilled = (lang) => (lang === 'en' ? '(not filled)' : '（尚未填寫）');

// Generate email content (uses language from settings)
export const generateEmailContent = (week, day, entry) => {
  const settings = getSettings();
  const lang = settings?.language || 'zh';
  const isSunday = day === 7;
  const isSaturday = day === 6;
  
  let dayData;
  if (isSaturday) {
    dayData = weekendData.saturdays.find(s => s.week === week);
  } else if (isSunday) {
    dayData = weekendData.sundays.find(s => s.week === week);
  } else {
    const weekData = devotionalData.find(w => w.week === week);
    dayData = weekData.days.find(d => d.day === day);
  }
  
  const currentDate = getActualDate(week, day);
  const dateStr = currentDate ? formatDate(currentDate) : '';
  const dayLabel = isSunday ? t('sunday', lang) : t('dayLabel', lang, { day });
  
  const titleDisplay = (dayData.titleEn ?? dayData.title) && (dayData.titleZh ?? dayData.title)
    ? `${dayData.titleEn ?? dayData.title} · ${dayData.titleZh ?? dayData.title}`
    : (dayData.title || '');
  const subject = (lang === 'en'
    ? `Week ${week} ${dayLabel} devotional - ${titleDisplay}`
    : `第 ${week} 週 ${dayLabel} 靈修記錄 - ${titleDisplay}`);
  
  const greeting = lang === 'en'
    ? `${settings.mentorName},\n\nHere is my devotional entry for week ${week}, ${dayLabel}:\n\n`
    : `${settings.mentorName} 牧者／導師，主內平安：\n\n以下是我第 ${week} 週 ${dayLabel} 的靈修記錄：\n\n`;
  let body = `${greeting}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${lang === 'en' ? 'Date' : '日期'}：${dateStr}
📖 ${lang === 'en' ? 'Topic' : '主題'}：${titleDisplay}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  if (isSunday) {
    body += `

【${t('sermonNotes', lang)}】
${entry.sermonNotes || notFilled(lang)}`;
  } else {
    const scripture = lang === 'zh' ? (dayData.scriptureZh ?? dayData.scripture) : (dayData.scriptureEn ?? dayData.scripture);
    const reflectionQ = lang === 'zh' ? (dayData.reflectionQuestionZh ?? dayData.reflectionQuestion) : (dayData.reflectionQuestionEn ?? dayData.reflectionQuestion);
    body += `

【${t('todayScripture', lang)}】
${scripture}

【${t('reflectionQuestion', lang)}】
${reflectionQ || ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【${lang === 'en' ? 'My entry' : '我的靈修記錄'}】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 ${t('mainContent', lang)}：
${entry.mainContent || notFilled(lang)}

❤️ ${t('personalReflection', lang)}：
${entry.personalReflection || notFilled(lang)}

🎯 ${t('application', lang)}：
${entry.application || notFilled(lang)}

🙏 ${t('prayer', lang)}：
${entry.prayer || notFilled(lang)}`;
  }
  
  body += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${lang === 'en' ? 'Blessings!' : '願主親自帶領與祝福！'}

${new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-HK')}`;

  return { subject, body };
};

// Send email (using mailto link)
export const sendEmail = (week, day, entry) => {
  const settings = getSettings();
  const lang = settings?.language || 'zh';
  
  if (!settings || !settings.mentorEmail) {
    alert(t('errorNoMentorEmail', lang));
    return;
  }

  const { subject, body } = generateEmailContent(week, day, entry);
  
  // Use mailto link
  const mailtoLink = `mailto:${encodeURIComponent(settings.mentorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open email client
  window.location.href = mailtoLink;
};
