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

  const dayLabel = isSunday ? 'Sunday' : `Day ${day}`;
  
  const subject = `Week ${week} ${dayLabel} Devotional Entry - ${dayData.title}`;

  let body = `Dear ${settings.mentorName},

Below is my devotional entry for Week ${week} ${dayLabel}:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Date: ${dateStr}
📖 Topic: ${dayData.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  if (isSunday) {
    body += `

【Sermon Notes】
${entry.sermonNotes || '(Not filled in yet)'}`;
  } else {
    body += `

【Today's Scripture】
${dayData.scripture}

【Reflection Question】
${dayData.reflectionQuestion}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【My Devotional Entry】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Main Content:
${entry.mainContent || '(Not filled in yet)'}

❤️ Personal Reflection:
${entry.personalReflection || '(Not filled in yet)'}

🎯 Application:
${entry.application || '(Not filled in yet)'}

🙏 Prayer:
${entry.prayer || '(Not filled in yet)'}`;
  }

  body += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

May God bless you!

${new Date().toLocaleDateString('en-US')}`;

  return { subject, body };
};

// Send email (using mailto link)
export const sendEmail = (week, day, entry) => {
  const settings = getSettings();
  
  if (!settings || !settings.mentorEmail) {
    alert('Error: Spiritual mentor email address not found. Please reset settings.');
    return;
  }

  const { subject, body } = generateEmailContent(week, day, entry);
  
  // Use mailto link
  const mailtoLink = `mailto:${encodeURIComponent(settings.mentorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open email client
  window.location.href = mailtoLink;
};
