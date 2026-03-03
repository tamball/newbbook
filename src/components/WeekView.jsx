import React from 'react';
import { getWeekProgress, isDayCompleted, getSettings } from '../utils/storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { getActualDate, formatDate } from '../utils/dateUtils';
import { t } from '../utils/i18n';
import './WeekView.css';

const WeekView = ({ selectedWeek, onSelectWeek, onSelectDay }) => {
  const lang = getSettings()?.language || 'zh';
  const weekData = devotionalData.find(w => w.week === selectedWeek);
  const progress = getWeekProgress(selectedWeek);
  const saturdayData = weekendData.saturdays.find(s => s.week === selectedWeek);
  const sundayData = weekendData.sundays.find(s => s.week === selectedWeek);

  // Get date for each day
  const getDayDate = (day) => {
    const date = getActualDate(selectedWeek, day);
    return date ? formatDate(date) : '';
  };

  // If week data not found, show error
  if (!weekData) {
    return (
      <div className="week-view">
        <div className="week-header">
          <h1>{t('error', lang)}</h1>
          <p>{t('errorNoWeekData', lang, { week: selectedWeek })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="week-view">
      <div className="week-header">
        <h1>{t('weekTitle', lang, { week: selectedWeek })}</h1>
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(progress.completed / progress.total) * 100}%` }}></div>
          </div>
          <div className="progress-visual">
            <div 
              className="progress-circle" 
              style={{ '--progress': (progress.completed / progress.total) * 100 }}
            >
              <div className="progress-circle-inner">
                {Math.round((progress.completed / progress.total) * 100)}%
              </div>
            </div>
            <div className="progress-stats">
              <p className="progress-text">{t('completedDays', lang, { completed: progress.completed, total: progress.total })}</p>
              {progress.completed === progress.total && (
                <p className="progress-complete">{t('weekComplete', lang)}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="days-grid">
        {/* Monday to Friday */}
        {weekData.days.map((dayData) => {
          const dayDate = getDayDate(dayData.day);
          const completed = isDayCompleted(selectedWeek, dayData.day);
          return (
            <div
              key={dayData.day}
              className={`day-card ${completed ? 'completed' : ''}`}
              onClick={() => onSelectDay(dayData.day)}
            >
              <div className="day-header-row">
                <div className="day-number">{t('dayLabel', lang, { day: dayData.day })} {dayDate && <span className="day-date">({dayDate.split(',')[0]})</span>}</div>
                {completed && <span className="completion-badge">✓ {t('completed', lang)}</span>}
              </div>
              <h3 className="day-title">{lang === 'zh' ? (dayData.titleZh ?? dayData.title) : (dayData.titleEn ?? dayData.title)}</h3>
              <div className="day-preview">
                {(lang === 'zh' ? (dayData.scriptureZh ?? dayData.scripture) : (dayData.scriptureEn ?? dayData.scripture) || '').split('\n')[0]?.substring(0, 50)}...
              </div>
            </div>
          );
        })}
        
        {/* Saturday */}
        {saturdayData && (
          <div
            className="day-card saturday-card"
            onClick={() => onSelectDay(6)}
          >
            <div className="day-header-row">
              <div className="day-number">{t('saturday', lang)} {getDayDate(6) && <span className="day-date">({getDayDate(6).split(',')[0]})</span>}</div>
              <span className="reading-badge">{t('scriptureReadingDay', lang)}</span>
            </div>
            <h3 className="day-title">📖 {lang === 'zh' ? (saturdayData.titleZh ?? saturdayData.title) : (saturdayData.titleEn ?? saturdayData.title)}</h3>
            <div className="day-preview">
              {t('saturdayPreview', lang)}
            </div>
          </div>
        )}

        {/* Sunday */}
        {sundayData && (
          <div
            className={`day-card sunday-card ${isDayCompleted(selectedWeek, 7) ? 'completed' : ''}`}
            onClick={() => onSelectDay(7)}
          >
            <div className="day-header-row">
              <div className="day-number">{t('sunday', lang)} {getDayDate(7) && <span className="day-date">({getDayDate(7).split(',')[0]})</span>}</div>
              {isDayCompleted(selectedWeek, 7) && <span className="completion-badge">✓ {t('completed', lang)}</span>}
            </div>
            <h3 className="day-title">✝️ {lang === 'zh' ? (sundayData.titleZh ?? sundayData.title) : (sundayData.titleEn ?? sundayData.title)}</h3>
            <div className="day-preview">
              {t('sundayPreview', lang)}
            </div>
          </div>
        )}
      </div>

      <div className="week-navigation">
        {selectedWeek > 1 && (
          <button onClick={() => onSelectWeek(selectedWeek - 1)} className="nav-button">
            {t('prevWeek', lang)}
          </button>
        )}
        {selectedWeek < 8 && (
          <button onClick={() => onSelectWeek(selectedWeek + 1)} className="nav-button">
            {t('nextWeek', lang)}
          </button>
        )}
      </div>
    </div>
  );
};

export default WeekView;
