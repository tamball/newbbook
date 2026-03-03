import React, { useState } from 'react';
import { saveSettings } from '../utils/storage';
import { t } from '../utils/i18n';
import './SetupView.css';

// Get default start date (most recent Monday)
// If today is Monday, return today; otherwise return the last Monday before today
const getDefaultStartDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // days to go back to reach Monday: 0 if Mon, 1 if Tue, ..., 6 if Sun
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  return lastMonday.toISOString().split('T')[0];
};

// Minimum selectable date: allow past Mondays (e.g. first Monday of 2020), so users can backdate their start
const MIN_START_DATE = '2020-01-06'; // a Monday in the past

// Check if date is Monday
const isMonday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date.getDay() === 1; // 1 = Monday
};

const SetupView = ({ onComplete }) => {
  // Default date: today if Monday, otherwise next Monday
  const [formData, setFormData] = useState({
    language: 'zh',
    startDate: getDefaultStartDate(),
    mentorName: '',
    mentorEmail: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    if (field === 'startDate') {
      // If selected date is not Monday, suggest the last Monday (most recent Monday on or before that date)
      if (value && !isMonday(value)) {
        const selectedDate = new Date(value + 'T12:00:00');
        const dayOfWeek = selectedDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
        const daysToLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const lastMonday = new Date(selectedDate);
        lastMonday.setDate(selectedDate.getDate() - daysToLastMonday);
        const lastMondayStr = lastMonday.toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, [field]: lastMondayStr }));
        const lang = formData.language || 'zh';
        const msg = lang === 'zh'
          ? `已改為上一個週一：${lastMondayStr}`
          : `Suggested start date (last Monday): ${lastMondayStr}`;
        setErrors(prev => ({ ...prev, startDate: msg }));
        setTimeout(() => setErrors(prev => ({ ...prev, startDate: '' })), 4000);
        return;
      }
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const lang = formData.language || 'zh';
    if (!formData.startDate) {
      newErrors.startDate = t('startDateRequired', lang);
    } else if (!isMonday(formData.startDate)) {
      newErrors.startDate = t('startDateMustMonday', lang);
    }

    if (!formData.mentorName.trim()) {
      newErrors.mentorName = t('enterMentorName', lang);
    }

    if (!formData.mentorEmail.trim()) {
      newErrors.mentorEmail = t('enterMentorEmail', lang);
    } else if (!validateEmail(formData.mentorEmail)) {
      newErrors.mentorEmail = t('enterValidEmail', lang);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save settings
    saveSettings({
      language: formData.language || 'zh',
      startDate: formData.startDate,
      mentorName: formData.mentorName.trim(),
      mentorEmail: formData.mentorEmail.trim(),
      createdAt: new Date().toISOString()
    });

    // Complete setup
    onComplete();
  };

  const lang = formData.language || 'zh';

  return (
    <div className="setup-view">
      <div className="setup-container">
        <div className="setup-header">
          <h1>🌟 {t('setupWelcome', lang)}</h1>
          <p className="setup-subtitle">{t('setupSubtitle', lang)}</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-field language-field">
            <label>
              <h3>🌐 {t('language', lang)}</h3>
              <p className="field-hint">{lang === 'zh' ? '選擇介面語言' : 'Choose interface language'}</p>
            </label>
            <div className="language-options">
              <button
                type="button"
                className={`language-option ${formData.language === 'en' ? 'active' : ''}`}
                onClick={() => handleChange('language', 'en')}
              >
                {t('languageEn', 'en')}
              </button>
              <button
                type="button"
                className={`language-option ${formData.language === 'zh' ? 'active' : ''}`}
                onClick={() => handleChange('language', 'zh')}
              >
                {t('languageZh', 'zh')}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="startDate">
              <h3>📅 {t('startDate', lang)}</h3>
              <p className="field-hint">{t('startDateHint', lang)}</p>
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              min={MIN_START_DATE}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="mentorName">
              <h3>👤 {t('mentorName', lang)}</h3>
              <p className="field-hint">{t('mentorNameHint', lang)}</p>
            </label>
            <input
              type="text"
              id="mentorName"
              value={formData.mentorName}
              onChange={(e) => handleChange('mentorName', e.target.value)}
              placeholder={t('placeholderMentorName', lang)}
              className={errors.mentorName ? 'error' : ''}
            />
            {errors.mentorName && <span className="error-message">{errors.mentorName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="mentorEmail">
              <h3>📧 {t('mentorEmail', lang)}</h3>
              <p className="field-hint">{t('mentorEmailHint', lang)}</p>
            </label>
            <input
              type="email"
              id="mentorEmail"
              value={formData.mentorEmail}
              onChange={(e) => handleChange('mentorEmail', e.target.value)}
              placeholder={t('placeholderMentorEmail', lang)}
              className={errors.mentorEmail ? 'error' : ''}
            />
            {errors.mentorEmail && <span className="error-message">{errors.mentorEmail}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {t('beginJourney', lang)}
            </button>
          </div>
        </form>

        <div className="setup-info">
          <p>💡 {t('setupTip', lang)}</p>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
