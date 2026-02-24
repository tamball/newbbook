import { getSettings } from './storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { getActualDate, formatDate } from './dateUtils';

// Generate email content
export const generateEmailContent = (week, day, entry) => {
  const settings = getSettings();
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
  
  // Calculate date (based on start date, 7 days per week)
  const currentDate = getActualDate(week, day);
  const dateStr = currentDate ? formatDate(currentDate) : '';

  const dayLabel = isSunday ? '主日' : `第 ${day} 天`;
  
  const subject = `第 ${week} 週 ${dayLabel} 靈修記錄 - ${dayData.title}`;
  
  let body = `${settings.mentorName} 牧者／導師，主內平安：

以下是我第 ${week} 週 ${dayLabel} 的靈修記錄：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 日期：${dateStr}
📖 主題：${dayData.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  if (isSunday) {
    body += `

【主日信息筆記】
${entry.sermonNotes || '（尚未填寫）'}`;
  } else {
    body += `

【今日經文】
${dayData.scripture}

【思考問題】
${dayData.reflectionQuestion}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【我的靈修記錄】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 經文主要內容：
${entry.mainContent || '（尚未填寫）'}

❤️ 個人感受：
${entry.personalReflection || '（尚未填寫）'}

🎯 實際應用：
${entry.application || '（尚未填寫）'}

🙏 禱告：
${entry.prayer || '（尚未填寫）'}`;
  }
  
  body += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

願主親自帶領與祝福！

${new Date().toLocaleDateString('zh-HK')}`;

  return { subject, body };
};

// Send email (using mailto link)
export const sendEmail = (week, day, entry) => {
  const settings = getSettings();
  
  if (!settings || !settings.mentorEmail) {
    alert('錯誤：找不到屬靈導師的電郵地址，請先重設設定。');
    return;
  }

  const { subject, body } = generateEmailContent(week, day, entry);
  
  // Use mailto link
  const mailtoLink = `mailto:${encodeURIComponent(settings.mentorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open email client
  window.location.href = mailtoLink;
};
