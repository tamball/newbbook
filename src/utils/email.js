import { getSettings } from './storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { getActualDate, formatDate } from './dateUtils';

// 生成郵件內容
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
  
  // 計算日期（基於開始日期，每週7天）
  const currentDate = getActualDate(week, day);
  const dateStr = currentDate ? formatDate(currentDate) : '';

  const dayLabel = isSunday ? '星期日' : `第${day}天`;
  
  const subject = `第${week}週${dayLabel}靈修記錄 - ${dayData.title}`;

  let body = `親愛的${settings.mentorName}，

以下是我第${week}週${dayLabel}的靈修記錄：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 日期：${dateStr}
📖 主題：${dayData.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  if (isSunday) {
    body += `

【聽道筆記】
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

願神祝福你！

${new Date().toLocaleDateString('zh-TW')}`;

  return { subject, body };
};

// 發送郵件（使用 mailto 鏈接）
export const sendEmail = (week, day, entry) => {
  const settings = getSettings();
  
  if (!settings || !settings.mentorEmail) {
    alert('錯誤：找不到屬靈導師的電郵地址。請重新設置。');
    return;
  }

  const { subject, body } = generateEmailContent(week, day, entry);
  
  // 使用 mailto 鏈接
  const mailtoLink = `mailto:${encodeURIComponent(settings.mentorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // 打開郵件客戶端
  window.location.href = mailtoLink;
};
