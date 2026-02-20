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
          <h1>Error</h1>
          <p>Week {selectedWeek} data not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="week-view">
      <div className="week-header">
        <h1>Week {selectedWeek}</h1>
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
              <p className="progress-text">{progress.completed} / {progress.total} days completed</p>
              {progress.completed === progress.total && (
                <p className="progress-complete">🎉 Week Complete!</p>
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
                <div className="day-number">Day {dayData.day} {dayDate && <span className="day-date">({dayDate.split(',')[0]})</span>}</div>
                {completed && <span className="completion-badge">✓ Completed</span>}
              </div>
              <h3 className="day-title">{dayData.title}</h3>
              <div className="day-preview">
                {dayData.scripture.split('\n')[0].substring(0, 50)}...
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
              <div className="day-number">Saturday {getDayDate(6) && <span className="day-date">({getDayDate(6).split(',')[0]})</span>}</div>
              <span className="reading-badge">📖 Reading Day</span>
            </div>
            <h3 className="day-title">📖 {saturdayData.title}</h3>
            <div className="day-preview">
              Full chapter reading, no entry required
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
              <div className="day-number">Sunday {getDayDate(7) && <span className="day-date">({getDayDate(7).split(',')[0]})</span>}</div>
              {isDayCompleted(selectedWeek, 7) && <span className="completion-badge">✓ Completed</span>}
            </div>
            <h3 className="day-title">✝️ {sundayData.title}</h3>
            <div className="day-preview">
              Record Sunday service sermon notes
            </div>
          </div>
        )}
      </div>

      <div className="week-navigation">
        {selectedWeek > 1 && (
          <button onClick={() => onSelectWeek(selectedWeek - 1)} className="nav-button">
            ← Previous Week
          </button>
        )}
        {selectedWeek < 8 && (
          <button onClick={() => onSelectWeek(selectedWeek + 1)} className="nav-button">
            Next Week →
          </button>
        )}
      </div>
    </div>
  );
};

export default WeekView;
