import React from 'react';
import { getWeekProgress, isDayCompleted } from '../utils/storage';
import { devotionalData } from '../data/devotionalData';
import { weekendData } from '../data/weekendData';
import { getActualDate, formatDate } from '../utils/dateUtils';
import './WeekView.css';

const WeekView = ({ selectedWeek, onSelectWeek, onSelectDay }) => {
  const weekData = devotionalData.find(w => w.week === selectedWeek);
  const progress = getWeekProgress(selectedWeek);
  const saturdayData = weekendData.saturdays.find(s => s.week === selectedWeek);
  const sundayData = weekendData.sundays.find(s => s.week === selectedWeek);

  // 獲取每天的日期
  const getDayDate = (day) => {
    const date = getActualDate(selectedWeek, day);
    return date ? formatDate(date) : '';
  };

  // 如果找不到週次資料，顯示錯誤
  if (!weekData) {
    return (
      <div className="week-view">
        <div className="week-header">
          <h1>錯誤</h1>
          <p>找不到第 {selectedWeek} 週的資料</p>
        </div>
      </div>
    );
  }

  return (
    <div className="week-view">
      <div className="week-header">
        <h1>第 {selectedWeek} 週</h1>
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
              <p className="progress-text">{progress.completed} / {progress.total} 天已完成</p>
              {progress.completed === progress.total && (
                <p className="progress-complete">🎉 本週完成！</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="days-grid">
        {/* 週一到週五 */}
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
                <div className="day-number">第 {dayData.day} 天 {dayDate && <span className="day-date">({dayDate.split(' ')[0]})</span>}</div>
                {completed && <span className="completion-badge">✓ 已完成</span>}
              </div>
              <h3 className="day-title">{dayData.title}</h3>
              <div className="day-preview">
                {dayData.scripture.split('\n')[0].substring(0, 50)}...
              </div>
            </div>
          );
        })}
        
        {/* 星期六 */}
        {saturdayData && (
          <div
            className="day-card saturday-card"
            onClick={() => onSelectDay(6)}
          >
            <div className="day-header-row">
              <div className="day-number">星期六 {getDayDate(6) && <span className="day-date">({getDayDate(6).split(' ')[0]})</span>}</div>
              <span className="reading-badge">📖 閱讀日</span>
            </div>
            <h3 className="day-title">📖 {saturdayData.title}</h3>
            <div className="day-preview">
              整章經文閱讀，無需填寫
            </div>
          </div>
        )}

        {/* 星期日 */}
        {sundayData && (
          <div
            className={`day-card sunday-card ${isDayCompleted(selectedWeek, 7) ? 'completed' : ''}`}
            onClick={() => onSelectDay(7)}
          >
            <div className="day-header-row">
              <div className="day-number">星期日 {getDayDate(7) && <span className="day-date">({getDayDate(7).split(' ')[0]})</span>}</div>
              {isDayCompleted(selectedWeek, 7) && <span className="completion-badge">✓ 已完成</span>}
            </div>
            <h3 className="day-title">✝️ {sundayData.title}</h3>
            <div className="day-preview">
              記錄主日崇拜聽道內容
            </div>
          </div>
        )}
      </div>

      <div className="week-navigation">
        {selectedWeek > 1 && (
          <button onClick={() => onSelectWeek(selectedWeek - 1)} className="nav-button">
            ← 上一週
          </button>
        )}
        {selectedWeek < 8 && (
          <button onClick={() => onSelectWeek(selectedWeek + 1)} className="nav-button">
            下一週 →
          </button>
        )}
      </div>
    </div>
  );
};

export default WeekView;
