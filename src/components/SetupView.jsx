import React, { useState } from 'react';
import { saveSettings } from '../utils/storage';
import './SetupView.css';

// Get default start date (Monday)
// If today is Monday, return today; otherwise return next Monday
const getDefaultStartDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  if (dayOfWeek === 1) {
    // If today is Monday, return today
    return today.toISOString().split('T')[0];
  }
  
  // Otherwise calculate days until next Monday
  let daysUntilMonday;
  if (dayOfWeek === 0) {
    // If today is Sunday, next Monday is tomorrow
    daysUntilMonday = 1;
  } else {
    // Other cases, calculate days until next Monday
    daysUntilMonday = 8 - dayOfWeek;
  }
  
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split('T')[0];
};

// Get minimum selectable date (must be Monday)
const getMinStartDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  if (dayOfWeek === 1) {
    // If today is Monday, minimum date is today
    return today.toISOString().split('T')[0];
  }
  
  // Otherwise calculate days until next Monday
  let daysUntilMonday;
  if (dayOfWeek === 0) {
    daysUntilMonday = 1;
  } else {
    daysUntilMonday = 8 - dayOfWeek;
  }
  
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split('T')[0];
};

// Check if date is Monday
const isMonday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date.getDay() === 1; // 1 = Monday
};

const SetupView = ({ onComplete }) => {
  // Default date: today if Monday, otherwise next Monday
  const [formData, setFormData] = useState({
    startDate: getDefaultStartDate(),
    mentorName: '',
    mentorEmail: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    if (field === 'startDate') {
      // If selected date is not Monday, auto-adjust to next Monday after that date
      if (value && !isMonday(value)) {
        const selectedDate = new Date(value);
        const dayOfWeek = selectedDate.getDay();
        let daysUntilMonday;
        
        if (dayOfWeek === 0) {
          daysUntilMonday = 1;
        } else {
          daysUntilMonday = 8 - dayOfWeek;
        }
        
        const nextMonday = new Date(selectedDate);
        nextMonday.setDate(selectedDate.getDate() + daysUntilMonday);
        const nextMondayStr = nextMonday.toISOString().split('T')[0];
        
        setFormData(prev => ({ ...prev, [field]: nextMondayStr }));
        setErrors(prev => ({ ...prev, startDate: `Auto-adjusted to next Monday: ${nextMondayStr}` }));
        // Clear message after 3 seconds
        setTimeout(() => {
          setErrors(prev => ({ ...prev, startDate: '' }));
        }, 3000);
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

    if (!formData.startDate) {
      newErrors.startDate = '請選擇開始日期';
    } else if (!isMonday(formData.startDate)) {
      newErrors.startDate = '開始日期必須是星期一';
    }

    if (!formData.mentorName.trim()) {
      newErrors.mentorName = '請輸入屬靈導師姓名';
    }

    if (!formData.mentorEmail.trim()) {
      newErrors.mentorEmail = '請輸入屬靈導師電郵地址';
    } else if (!validateEmail(formData.mentorEmail)) {
      newErrors.mentorEmail = '請輸入有效的電郵地址';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save settings
    saveSettings({
      startDate: formData.startDate,
      mentorName: formData.mentorName.trim(),
      mentorEmail: formData.mentorEmail.trim(),
      createdAt: new Date().toISOString()
    });

    // Complete setup
    onComplete();
  };

  // Minimum date: today if Monday, otherwise next Monday
  const minDate = getMinStartDate();

  return (
    <div className="setup-view">
      <div className="setup-container">
        <div className="setup-header">
          <h1>🌟 歡迎開始你的靈修旅程！</h1>
          <p className="setup-subtitle">請先填寫以下資料，以建立你個人的靈修記錄本</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-field">
            <label htmlFor="startDate">
              <h3>📅 開始日期</h3>
              <p className="field-hint">選擇你想開始這 8 週靈修計劃的日期（必須是星期一）</p>
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              min={minDate}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="mentorName">
              <h3>👤 屬靈導師姓名</h3>
              <p className="field-hint">你的屬靈導師或同行者的名字</p>
            </label>
            <input
              type="text"
              id="mentorName"
              value={formData.mentorName}
              onChange={(e) => handleChange('mentorName', e.target.value)}
              placeholder="例如：陳牧師"
              className={errors.mentorName ? 'error' : ''}
            />
            {errors.mentorName && <span className="error-message">{errors.mentorName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="mentorEmail">
              <h3>📧 屬靈導師電郵</h3>
              <p className="field-hint">屬靈導師的電郵地址（用來接收你的靈修記錄）</p>
            </label>
            <input
              type="email"
              id="mentorEmail"
              value={formData.mentorEmail}
              onChange={(e) => handleChange('mentorEmail', e.target.value)}
              placeholder="例如：mentor@example.com"
              className={errors.mentorEmail ? 'error' : ''}
            />
            {errors.mentorEmail && <span className="error-message">{errors.mentorEmail}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              開始 8 週靈修旅程 ✨
            </button>
          </div>
        </form>

        <div className="setup-info">
          <p>💡 小貼士：完成設定後，你可以每天把靈修記錄電郵給屬靈導師，讓他／她在屬靈上陪伴你成長。</p>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
