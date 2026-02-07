import React, { useState, useEffect } from 'react';
import { getEntry, saveEntry, getSettings } from '../utils/storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { sendEmail } from '../utils/email';
import { getActualDate, formatDate } from '../utils/dateUtils';
import './DayView.css';

const DayView = ({ week, day, onBack }) => {
  // 判斷是星期六、星期日還是平日
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
      // 星期日初始化
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
      alert('已儲存！');
    }, 300);
  };

  const handleAutoSave = () => {
    saveEntry(week, day, formData);
  };

  const handleSendEmail = () => {
    const settings = getSettings();
    if (!settings || !settings.mentorEmail) {
      alert('錯誤：找不到屬靈導師的電郵地址。請重新設置。');
      return;
    }

    // 檢查是否有內容
    let hasContent = false;
    if (isSunday) {
      hasContent = !!formData.sermonNotes;
    } else {
      hasContent = formData.mainContent || formData.personalReflection || 
                   formData.application || formData.prayer;
    }
    
    if (!hasContent) {
      if (!confirm('你還沒有填寫任何內容，確定要發送嗎？')) {
        return;
      }
    }

    // 發送郵件
    sendEmail(week, day, formData);
  };

  const settings = getSettings();
  const actualDate = getActualDate(week, day);
  const dateStr = actualDate ? formatDate(actualDate) : '';

  // 星期六：只顯示經文，不填寫
  if (isSaturday) {
    return (
      <div className="day-view">
        <button onClick={onBack} className="back-button">← 返回週次</button>
        
        <div className="day-header">
          <h1>第 {week} 週 - 星期六</h1>
          {dateStr && <p className="actual-date">📅 {dateStr}</p>}
          <h2>{dayData.title}</h2>
        </div>

        <div className="scripture-section saturday-reading">
          <h3>📖 整章經文閱讀</h3>
          <p className="reading-hint">請安靜閱讀以下經文，默想神的話語。今天不需要填寫任何內容，只需用心閱讀和思考。</p>
          <div className="scripture-text full-chapter">
            {dayData.scripture.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 星期日：聽道筆記
  if (isSunday) {
    return (
      <div className="day-view">
        <button onClick={onBack} className="back-button">← 返回週次</button>
        
        <div className="day-header">
          <h1>第 {week} 週 - 星期日</h1>
          {dateStr && <p className="actual-date">📅 {dateStr}</p>}
          <h2>{dayData.title}</h2>
        </div>

        <div className="sermon-section">
          <h3>✝️ 主日崇拜</h3>
          <p className="sermon-description">{dayData.description}</p>
        </div>

        <div className="entry-section">
          <div className="entry-field">
            <label htmlFor="sermonNotes">
              <h3>📝 聽道筆記</h3>
              <p className="field-hint">請記錄今天在主日崇拜中聽到的信息、經文、重點和得著</p>
            </label>
            <textarea
              id="sermonNotes"
              value={formData.sermonNotes}
              onChange={(e) => {
                handleChange('sermonNotes', e.target.value);
                handleAutoSave();
              }}
              placeholder="請記錄今天聽到的信息..."
              rows={12}
            />
          </div>
        </div>

        <div className="save-section">
          <div className="save-buttons">
            <button onClick={handleSave} className="save-button" disabled={isSaving}>
              {isSaving ? '儲存中...' : '💾 手動儲存'}
            </button>
            {settings && settings.mentorEmail && (
              <button onClick={handleSendEmail} className="send-email-button">
                📧 發送給屬靈導師
              </button>
            )}
          </div>
          <p className="auto-save-hint">* 內容會自動儲存</p>
        </div>
      </div>
    );
  }

  // 平日（週一到週五）：正常的靈修記錄
  return (
    <div className="day-view">
      <button onClick={onBack} className="back-button">← 返回週次</button>
      
      <div className="day-header">
        <h1>第 {week} 週 - 第 {day} 天</h1>
        {dateStr && <p className="actual-date">📅 {dateStr}</p>}
        <h2>{dayData.title}</h2>
      </div>

      <div className="scripture-section">
        <h3>📖 今日經文</h3>
        <div className="scripture-text">
          {dayData.scripture.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>

      <div className="reflection-section">
        <h3>💭 思考問題</h3>
        <p className="reflection-question">{dayData.reflectionQuestion}</p>
      </div>

      <div className="entry-section">
        <div className="entry-field">
          <label htmlFor="mainContent">
            <h3>📝 經文主要內容</h3>
            <p className="field-hint">用你自己的話寫出這段經文的主要內容</p>
          </label>
          <textarea
            id="mainContent"
            value={formData.mainContent}
            onChange={(e) => {
              handleChange('mainContent', e.target.value);
              handleAutoSave();
            }}
            placeholder="請寫下這段經文的主要內容..."
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="personalReflection">
            <h3>❤️ 個人感受</h3>
            <p className="field-hint">這段經文對你有什麼觸動？你的感受是什麼？</p>
          </label>
          <textarea
            id="personalReflection"
            value={formData.personalReflection}
            onChange={(e) => {
              handleChange('personalReflection', e.target.value);
              handleAutoSave();
            }}
            placeholder="請分享你的感受..."
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="application">
            <h3>🎯 實際應用</h3>
            <p className="field-hint">這段經文如何應用在你的生活中？</p>
          </label>
          <textarea
            id="application"
            value={formData.application}
            onChange={(e) => {
              handleChange('application', e.target.value);
              handleAutoSave();
            }}
            placeholder="請寫下實際的應用..."
            rows={6}
          />
        </div>

        <div className="entry-field">
          <label htmlFor="prayer">
            <h3>🙏 禱告</h3>
            <p className="field-hint">將你的禱告寫下來</p>
          </label>
          <textarea
            id="prayer"
            value={formData.prayer}
            onChange={(e) => {
              handleChange('prayer', e.target.value);
              handleAutoSave();
            }}
            placeholder="親愛的天父..."
            rows={6}
          />
        </div>
      </div>

      <div className="save-section">
        <div className="save-buttons">
          <button onClick={handleSave} className="save-button" disabled={isSaving}>
            {isSaving ? '儲存中...' : '💾 手動儲存'}
          </button>
          {settings && settings.mentorEmail && (
            <button onClick={handleSendEmail} className="send-email-button">
              📧 發送給屬靈導師
            </button>
          )}
        </div>
        <p className="auto-save-hint">* 內容會自動儲存</p>
        {settings && settings.mentorEmail && (
          <p className="email-hint">
            💡 點擊「發送給屬靈導師」會打開你的郵件客戶端，將今天的靈修記錄發送給 {settings.mentorName}
          </p>
        )}
      </div>
    </div>
  );
};

export default DayView;
