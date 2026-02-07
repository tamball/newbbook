import React, { useState } from 'react';
import { saveSettings } from '../utils/storage';
import './SetupView.css';

// 獲取預設開始日期（星期一）
// 如果今天是星期一，返回今天；否則返回下一個星期一
const getDefaultStartDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = 星期日, 1 = 星期一, ..., 6 = 星期六
  
  if (dayOfWeek === 1) {
    // 如果今天是星期一，返回今天
    return today.toISOString().split('T')[0];
  }
  
  // 否則計算到下一個星期一
  let daysUntilMonday;
  if (dayOfWeek === 0) {
    // 如果是星期日，下一個星期一是明天
    daysUntilMonday = 1;
  } else {
    // 其他情況，計算到下一個星期一的天數
    daysUntilMonday = 8 - dayOfWeek;
  }
  
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  return nextMonday.toISOString().split('T')[0];
};

// 獲取最小可選日期（必須是星期一）
const getMinStartDate = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  if (dayOfWeek === 1) {
    // 如果今天是星期一，最小日期是今天
    return today.toISOString().split('T')[0];
  }
  
  // 否則計算到下一個星期一
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

// 檢查日期是否為星期一
const isMonday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date.getDay() === 1; // 1 = 星期一
};

const SetupView = ({ onComplete }) => {
  // 預設日期：如果今天是星期一則為今天，否則為下一個星期一
  const [formData, setFormData] = useState({
    startDate: getDefaultStartDate(),
    mentorName: '',
    mentorEmail: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    if (field === 'startDate') {
      // 如果選擇的日期不是星期一，自動調整到該日期之後的下一個星期一
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
        setErrors(prev => ({ ...prev, startDate: `已自動調整到下一個星期一：${nextMondayStr}` }));
        // 3秒後清除提示訊息
        setTimeout(() => {
          setErrors(prev => ({ ...prev, startDate: '' }));
        }, 3000);
        return;
      }
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除該欄位的錯誤
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
      newErrors.mentorName = '請輸入屬靈導師的姓名';
    }

    if (!formData.mentorEmail.trim()) {
      newErrors.mentorEmail = '請輸入屬靈導師的電郵';
    } else if (!validateEmail(formData.mentorEmail)) {
      newErrors.mentorEmail = '請輸入有效的電郵地址';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 儲存設置
    saveSettings({
      startDate: formData.startDate,
      mentorName: formData.mentorName.trim(),
      mentorEmail: formData.mentorEmail.trim(),
      createdAt: new Date().toISOString()
    });

    // 完成設置
    onComplete();
  };

  // 最小日期：如果今天是星期一則為今天，否則為下一個星期一
  const minDate = getMinStartDate();

  return (
    <div className="setup-view">
      <div className="setup-container">
        <div className="setup-header">
          <h1>🌟 歡迎開始你的靈修旅程！</h1>
          <p className="setup-subtitle">請先填寫以下資料，讓我們為你準備個人化的靈修記錄</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-field">
            <label htmlFor="startDate">
              <h3>📅 開始日期</h3>
              <p className="field-hint">選擇你開始這8週靈修計劃的日期（必須是星期一）</p>
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
              <p className="field-hint">你的屬靈導師或陪伴者的名字</p>
            </label>
            <input
              type="text"
              id="mentorName"
              value={formData.mentorName}
              onChange={(e) => handleChange('mentorName', e.target.value)}
              placeholder="例如：張牧師"
              className={errors.mentorName ? 'error' : ''}
            />
            {errors.mentorName && <span className="error-message">{errors.mentorName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="mentorEmail">
              <h3>📧 屬靈導師電郵</h3>
              <p className="field-hint">你的屬靈導師的電郵地址（用於發送靈修記錄）</p>
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
              開始靈修旅程 ✨
            </button>
          </div>
        </form>

        <div className="setup-info">
          <p>💡 提示：完成設置後，你每天都可以將靈修記錄發送給你的屬靈導師，讓他陪伴你成長。</p>
        </div>
      </div>
    </div>
  );
};

export default SetupView;
