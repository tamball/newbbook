import React, { useState, useEffect } from 'react';
import { getEntry, saveEntry, getSettings } from '../utils/storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { sendEmail } from '../utils/email';
import { getActualDate, formatDate } from '../utils/dateUtils';
import './DayView.css';

const DayView = ({ week, day, onBack }) => {
  // Determine if Saturday, Sunday, or weekday
  const isSaturday = day === 6;
  const isSunday = day === 7;
  
  const weekData = devotionalData.find(w => w.week === week);
  const saturdayData = weekendData.saturdays.find(s => s.week === week);
  const sundayData = weekendData.sundays.find(s => s.week === week);
  
  const dayData = isSaturday ? saturdayData : isSunday ? sundayData : weekData?.days.find(d => d.day === day);
  const savedEntry = getEntry(week, day);

  const [formData, setFormData] = useState({
    mainContent: savedEntry?.mainContent || '',
    personalReflection: savedEntry?.personalReflection || '',
    application: savedEntry?.application || '',
    prayer: savedEntry?.prayer || '',
    sermonNotes: savedEntry?.sermonNotes || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = getEntry(week, day);
    if (saved) {
      setFormData({
        mainContent: saved.mainContent || '',
        personalReflection: saved.personalReflection || '',
        application: saved.application || '',
        prayer: saved.prayer || '',
        sermonNotes: saved.sermonNotes || ''
      });
    } else if (isSunday) {
      // Sunday initialization
      setFormData({
        mainContent: '',
        personalReflection: '',
        application: '',
        prayer: '',
        sermonNotes: ''
      });
    }
  }, [week, day, isSunday]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    saveEntry(week, day, formData);
    setTimeout(() => {
      setIsSaving(false);
      alert('Saved!');
    }, 300);
  };

  const handleAutoSave = () => {
    saveEntry(week, day, formData);
  };

  const handleSendEmail = () => {
    const settings = getSettings();
    if (!settings || !settings.mentorEmail) {
      alert('Error: Spiritual mentor email address not found. Please reset settings.');
      return;
    }

    // Check if there's content
    let hasContent = false;
    if (isSunday) {
      hasContent = !!formData.sermonNotes;
    } else {
      hasContent = formData.mainContent || formData.personalReflection || 
                   formData.application || formData.prayer;
    }
    
    if (!hasContent) {
      if (!confirm('You haven\'t filled in any content yet. Are you sure you want to send?')) {
        return;
      }
    }

    // Send email
    sendEmail(week, day, formData);
  };

  const settings = getSettings();
  const actualDate = getActualDate(week, day);
  const dateStr = actualDate ? formatDate(actualDate) : '';

  // Saturday: Show scripture only, no entry
  if (isSaturday) {
    return (
      <div className="day-view">
        <button onClick={onBack} className="back-button">← Back to Weeks</button>
        
        <div className="day-header">
          <h1>Week {week} - Saturday</h1>
          {dateStr && <p className="actual-date">📅 {dateStr}</p>}
          <h2>{dayData.title}</h2>
        </div>

        <div className="scripture-section saturday-reading">
          <h3>📖 Full Chapter Reading</h3>
          <p className="reading-hint">Please read the following scripture quietly and meditate on God's word. No entry is required today—just read and reflect with your heart.</p>
          <div className="scripture-text full-chapter">
            {dayData.scripture.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Sunday: Sermon notes
  if (isSunday) {
    return (
      <div className="day-view">
        <button onClick={onBack} className="back-button">← Back to Weeks</button>
        
        <div className="day-header">
          <h1>Week {week} - Sunday</h1>
          {dateStr && <p className="actual-date">📅 {dateStr}</p>}
          <h2>{dayData.title}</h2>
        </div>

        <div className="sermon-section">
          <h3>✝️ Sunday Service</h3>
          <p className="sermon-description">{dayData.description}</p>
        </div>

        <div className="entry-section">
          <div className="entry-field">
            <label htmlFor="sermonNotes">
              <h3>📝 Sermon Notes</h3>
              <p className="field-hint">Please record the message, scripture, key points, and insights you heard in today's Sunday service</p>
            </label>
            <textarea
              id="sermonNotes"
              value={formData.sermonNotes}
              onChange={(e) => {
                handleChange('sermonNotes', e.target.value);
                handleAutoSave();
              }}
              placeholder="Please record today's message..."
              rows={12}
            />
          </div>
        </div>

        <div className="save-section">
          <div className="save-buttons">
            <button onClick={handleSave} className="save-button" disabled={isSaving}>
              {isSaving ? 'Saving...' : '💾 Manual Save'}
            </button>
            {settings && settings.mentorEmail && (
              <button onClick={handleSendEmail} className="send-email-button">
                📧 Send to Mentor
              </button>
            )}
          </div>
          <p className="auto-save-hint">* Content is auto-saved</p>
        </div>
      </div>
    );
  }

  // Weekdays (Monday to Friday): Normal devotional entry
  return (
    <div className="day-view">
      <button onClick={onBack} className="back-button">← Back to Weeks</button>
      
      <div className="day-header">
        <h1>Week {week} - Day {day}</h1>
        {dateStr && <p className="actual-date">📅 {dateStr}</p>}
        <h2>{dayData.title}</h2>
      </div>

      <div className="scripture-section">
        <h3>📖 Today's Scripture</h3>
        <div className="scripture-text">
          {dayData.scripture.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>

      <div className="reflection-section">
        <h3>💭 Reflection Question</h3>
        <p className="reflection-question">{dayData.reflectionQuestion}</p>
      </div>

      <div className="entry-section">
        <div className="entry-field">
          <label htmlFor="mainContent">
            <h3>📝 Main Content</h3>
            <p className="field-hint">Write the main content of this passage in your own words</p>
          </label>
          <textarea
            id="mainContent"
            value={formData.mainContent}
            onChange={(e) => {
              handleChange('mainContent', e.target.value);
              handleAutoSave();
            }}
            placeholder="Please write the main content of this passage..."
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="personalReflection">
            <h3>❤️ Personal Reflection</h3>
            <p className="field-hint">How does this passage touch you? What are your feelings?</p>
          </label>
          <textarea
            id="personalReflection"
            value={formData.personalReflection}
            onChange={(e) => {
              handleChange('personalReflection', e.target.value);
              handleAutoSave();
            }}
            placeholder="Please share your feelings..."
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="application">
            <h3>🎯 Application</h3>
            <p className="field-hint">How can you apply this passage to your life?</p>
          </label>
          <textarea
            id="application"
            value={formData.application}
            onChange={(e) => {
              handleChange('application', e.target.value);
              handleAutoSave();
            }}
            placeholder="Please write down practical applications..."
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="prayer">
            <h3>🙏 Prayer</h3>
            <p className="field-hint">Write down your prayer</p>
          </label>
          <textarea
            id="prayer"
            value={formData.prayer}
            onChange={(e) => {
              handleChange('prayer', e.target.value);
              handleAutoSave();
            }}
            placeholder="Dear Heavenly Father..."
            rows={6}
          />
        </div>
      </div>

      <div className="save-section">
        <div className="save-buttons">
          <button onClick={handleSave} className="save-button" disabled={isSaving}>
            {isSaving ? 'Saving...' : '💾 Manual Save'}
          </button>
          {settings && settings.mentorEmail && (
            <button onClick={handleSendEmail} className="send-email-button">
              📧 Send to Mentor
            </button>
          )}
        </div>
        <p className="auto-save-hint">* Content is auto-saved</p>
        {settings && settings.mentorEmail && (
          <p className="email-hint">
            💡 Clicking "Send to Mentor" will open your email client and send today's devotional entry to {settings.mentorName}
          </p>
        )}
      </div>
    </div>
  );
};

export default DayView;
