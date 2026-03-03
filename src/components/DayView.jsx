import React, { useState, useEffect } from 'react';
import { getEntry, saveEntry, getSettings } from '../utils/storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { sendEmail } from '../utils/email';
import { getActualDate, formatDate } from '../utils/dateUtils';
import { t } from '../utils/i18n';
import './DayView.css';

// Normalize day data to always have bilingual fields (fallback to single field)
const getTitleEn = (d) => d?.titleEn ?? d?.title ?? '';
const getTitleZh = (d) => d?.titleZh ?? d?.title ?? '';
const getScriptureEn = (d) => d?.scriptureEn ?? d?.scripture ?? '';
const getScriptureZh = (d) => d?.scriptureZh ?? d?.scripture ?? '';
const getReflectionEn = (d) => d?.reflectionQuestionEn ?? d?.reflectionQuestion ?? '';
const getReflectionZh = (d) => d?.reflectionQuestionZh ?? d?.reflectionQuestion ?? '';

const DayView = ({ week, day, onBack }) => {
  // Determine if Saturday, Sunday, or weekday
  const isSaturday = day === 6;
  const isSunday = day === 7;
  
  const weekData = devotionalData.find(w => w.week === week);
  const saturdayData = weekendData.saturdays.find(s => s.week === week);
  const sundayData = weekendData.sundays.find(s => s.week === week);
  
  const dayData = isSaturday ? saturdayData : isSunday ? sundayData : weekData?.days.find(d => d.day === day);
  const savedEntry = getEntry(week, day);
  const lang = getSettings()?.language || 'zh';

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
      alert(t('savedAlert', getSettings()?.language || 'zh'));
    }, 300);
  };

  const handleAutoSave = () => {
    saveEntry(week, day, formData);
  };

  const handleSendEmail = () => {
    const settings = getSettings();
    if (!settings || !settings.mentorEmail) {
      alert(t('errorNoMentorEmail', lang));
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
      if (!confirm(t('confirmSendEmpty', lang))) {
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
        <button onClick={onBack} className="back-button">{t('backToWeeks', lang)}</button>
        
        <div className="day-header">
          <h1>{t('weekSaturday', lang, { week })}</h1>
          {dateStr && <p className="actual-date">📅 {dateStr}</p>}
          <h2 className="day-subtitle">{lang === 'zh' ? (dayData.titleZh ?? dayData.title) : (dayData.titleEn ?? dayData.title)}</h2>
        </div>

        <div className="scripture-section saturday-reading">
          <h3>📖 {t('fullChapterReading', lang)}</h3>
          <p className="reading-hint">{t('fullChapterHint', lang)}</p>
          <div className="scripture-text full-chapter">
            {(lang === 'zh' ? (dayData.scriptureZh ?? dayData.scripture) : (dayData.scriptureEn ?? dayData.scripture) || '').split('\n').filter(Boolean).map((line, idx) => (
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
        <button onClick={onBack} className="back-button">{t('backToWeeks', lang)}</button>
        
        <div className="day-header">
          <h1>{t('weekSunday', lang, { week })}</h1>
          {dateStr && <p className="actual-date">📅 {dateStr}</p>}
          <h2 className="day-subtitle">{lang === 'zh' ? (dayData.titleZh ?? dayData.title) : (dayData.titleEn ?? dayData.title)}</h2>
        </div>

        <div className="sermon-section">
          <h3>✝️ {t('sermonNotes', lang)}</h3>
          <p className="sermon-description">
            {lang === 'zh' ? (dayData.descriptionZh ?? dayData.description) : (dayData.descriptionEn ?? dayData.description) || ''}
          </p>
        </div>

        <div className="entry-section">
          <div className="entry-field">
            <label htmlFor="sermonNotes">
              <h3>{t('sermonNotesLabel', lang)}</h3>
              <p className="field-hint">{t('sermonNotesHint', lang)}</p>
            </label>
            <textarea
              id="sermonNotes"
              value={formData.sermonNotes}
              onChange={(e) => {
                handleChange('sermonNotes', e.target.value);
                handleAutoSave();
              }}
              placeholder={t('sermonNotesPlaceholder', lang)}
              rows={12}
            />
          </div>
        </div>

        <div className="save-section">
          <div className="save-buttons">
            <button onClick={handleSave} className="save-button" disabled={isSaving}>
              {isSaving ? t('saving', lang) : t('manualSave', lang)}
            </button>
            {settings && settings.mentorEmail && (
              <button onClick={handleSendEmail} className="send-email-button">
                {t('sendToMentor', lang)}
              </button>
            )}
          </div>
          <p className="auto-save-hint">{t('autoSaveHint', lang)}</p>
        </div>
      </div>
    );
  }

  // Weekdays (Monday to Friday): Normal devotional entry
  return (
    <div className="day-view">
      <button onClick={onBack} className="back-button">{t('backToWeeks', lang)}</button>
      
      <div className="day-header">
        <h1>{t('weekDay', lang, { week, day })}</h1>
        {dateStr && <p className="actual-date">📅 {dateStr}</p>}
        <h2 className="day-subtitle">{lang === 'zh' ? getTitleZh(dayData) : getTitleEn(dayData)}</h2>
      </div>

      <div className="scripture-section">
        <h3>📖 {t('todayScripture', lang)}</h3>
        <div className="scripture-text">
          {(lang === 'zh' ? getScriptureZh(dayData) : getScriptureEn(dayData) || '').split('\n').filter(Boolean).map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>

      <div className="reflection-section">
        <h3>💭 {t('reflectionQuestion', lang)}</h3>
        <p className="reflection-question">{lang === 'zh' ? getReflectionZh(dayData) : getReflectionEn(dayData)}</p>
      </div>

      <div className="entry-section">
        <div className="entry-field">
          <label htmlFor="mainContent">
            <h3>📝 {t('mainContent', lang)}</h3>
            <p className="field-hint">{t('mainContentHint', lang)}</p>
          </label>
          <textarea
            id="mainContent"
            value={formData.mainContent}
            onChange={(e) => {
              handleChange('mainContent', e.target.value);
              handleAutoSave();
            }}
            placeholder={t('mainContentPlaceholder', lang)}
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="personalReflection">
            <h3>❤️ {t('personalReflection', lang)}</h3>
            <p className="field-hint">{t('personalReflectionHint', lang)}</p>
          </label>
          <textarea
            id="personalReflection"
            value={formData.personalReflection}
            onChange={(e) => {
              handleChange('personalReflection', e.target.value);
              handleAutoSave();
            }}
            placeholder={t('personalReflectionPlaceholder', lang)}
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="application">
            <h3>🎯 {t('application', lang)}</h3>
            <p className="field-hint">{t('applicationHint', lang)}</p>
          </label>
          <textarea
            id="application"
            value={formData.application}
            onChange={(e) => {
              handleChange('application', e.target.value);
              handleAutoSave();
            }}
            placeholder={t('applicationPlaceholder', lang)}
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="prayer">
            <h3>🙏 {t('prayer', lang)}</h3>
            <p className="field-hint">{t('prayerHint', lang)}</p>
          </label>
          <textarea
            id="prayer"
            value={formData.prayer}
            onChange={(e) => {
              handleChange('prayer', e.target.value);
              handleAutoSave();
            }}
            placeholder={t('prayerPlaceholder', lang)}
            rows={6}
          />
        </div>
      </div>

      <div className="save-section">
        <div className="save-buttons">
          <button onClick={handleSave} className="save-button" disabled={isSaving}>
            {isSaving ? t('saving', lang) : t('manualSave', lang)}
          </button>
          {settings && settings.mentorEmail && (
            <button onClick={handleSendEmail} className="send-email-button">
              {t('sendToMentor', lang)}
            </button>
          )}
        </div>
        <p className="auto-save-hint">{t('autoSaveHint', lang)}</p>
        {settings && settings.mentorEmail && (
          <p className="email-hint">
            💡 {t('emailHint', lang, { name: settings.mentorName })}
          </p>
        )}
      </div>
    </div>
  );
};

export default DayView;
