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
      newErrors.startDate = 'Please select a start date';
    } else if (!isMonday(formData.startDate)) {
      newErrors.startDate = 'Start date must be a Monday';
    }

    if (!formData.mentorName.trim()) {
      newErrors.mentorName = 'Please enter your spiritual mentor\'s name';
    }

    if (!formData.mentorEmail.trim()) {
      newErrors.mentorEmail = 'Please enter your spiritual mentor\'s email';
    } else if (!validateEmail(formData.mentorEmail)) {
      newErrors.mentorEmail = 'Please enter a valid email address';
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
          <h1>🌟 Welcome to Your Devotional Journey!</h1>
          <p className="setup-subtitle">Please fill in the following information to set up your personalized devotional journal</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-field">
            <label htmlFor="startDate">
              <h3>📅 Start Date</h3>
              <p className="field-hint">Select the date you want to start this 8-week devotional plan (must be a Monday)</p>
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
              <h3>👤 Spiritual Mentor Name</h3>
              <p className="field-hint">Your spiritual mentor or companion's name</p>
            </label>
            <input
              type="text"
              id="mentorName"
              value={formData.mentorName}
              onChange={(e) => handleChange('mentorName', e.target.value)}
              placeholder="e.g., Pastor John"
              className={errors.mentorName ? 'error' : ''}
            />
            {errors.mentorName && <span className="error-message">{errors.mentorName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="mentorEmail">
              <h3>📧 Spiritual Mentor Email</h3>
              <p className="field-hint">Your spiritual mentor's email address (for sending devotional entries)</p>
            </label>
            <input
              type="email"
              id="mentorEmail"
              value={formData.mentorEmail}
              onChange={(e) => handleChange('mentorEmail', e.target.value)}
              placeholder="e.g., mentor@example.com"
              className={errors.mentorEmail ? 'error' : ''}
            />
            {errors.mentorEmail && <span className="error-message">{errors.mentorEmail}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Start Devotional Journey ✨
            </button>
          </div>
        </form>

        <div className="setup-info">
          <p>💡 Tip: After completing the setup, you can send your devotional entries to your spiritual mentor daily, allowing them to accompany you in your growth.</p>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
