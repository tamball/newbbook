import React, { useState, useEffect } from 'react';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import SetupView from './components/SetupView';
import OverallProgress from './components/OverallProgress';
import { hasSettings, getOverallProgress, clearSettings } from './utils/storage';
import './App.css';

function App() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [view, setView] = useState(null); // null = loading, 'setup', 'weeks', or 'day'
  const [showSetup, setShowSetup] = useState(false);
  const [overallProgress, setOverallProgress] = useState({ completed: 0, total: 48 });

  // Update overall progress
  useEffect(() => {
    if (hasSettings()) {
      const progress = getOverallProgress();
      setOverallProgress(progress);
    }
  }, [view]);

  useEffect(() => {
    // Check if settings exist
    try {
      console.log('Checking settings...');
      const hasSettingsValue = hasSettings();
      console.log('Has settings:', hasSettingsValue);
      if (hasSettingsValue) {
        console.log('Showing weeks view');
        setView('weeks');
        setShowSetup(false);
      } else {
        console.log('Showing setup view');
        setView('setup');
        setShowSetup(true);
      }
    } catch (error) {
      console.error('Error checking settings:', error);
      setView('setup');
      setShowSetup(true);
    }
  }, []);

  const handleSetupComplete = () => {
    setShowSetup(false);
    setView('weeks');
  };

  const handleSelectWeek = (week) => {
    setSelectedWeek(week);
    setSelectedDay(null);
    setView('weeks');
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    setView('day');
  };

  const handleBackToWeeks = () => {
    setView('weeks');
    setSelectedDay(null);
  };

  const handleResetSettings = () => {
    if (window.confirm('確定要重設設定嗎？這會清除開始日期和屬靈導師資料，但不會刪除你的靈修記錄。')) {
      clearSettings();
      setView('setup');
      setShowSetup(true);
    }
  };

  const overallPercentage = overallProgress.total > 0 
    ? Math.round((overallProgress.completed / overallProgress.total) * 100) 
    : 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="header-title">
            <h1>🌟 初信靈修記錄</h1>
            <p className="subtitle">與神同行的 8 週靈修旅程</p>
          </div>
          {hasSettings() && view !== 'setup' && (
            <button onClick={handleResetSettings} className="reset-button">
              🔄 重設設定
            </button>
          )}
        </div>
        {hasSettings() && view !== 'setup' && (
          <div className="overall-progress">
            <div className="overall-progress-bar">
              <div 
                className="overall-progress-fill" 
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
            <p className="overall-progress-text">
              整體進度：{overallProgress.completed} / {overallProgress.total} 天（{overallPercentage}%）
            </p>
          </div>
        )}
      </header>

      {view === null ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: 'white', margin: '2rem', borderRadius: '10px' }}>
          <h2>載入中...</h2>
          <p>正在檢查設定...</p>
        </div>
      ) : showSetup ? (
        <SetupView onComplete={handleSetupComplete} />
      ) : view === 'weeks' ? (
        <>
          <OverallProgress />
          <WeekView
            selectedWeek={selectedWeek}
            onSelectWeek={handleSelectWeek}
            onSelectDay={handleSelectDay}
          />
        </>
      ) : (
        <DayView
          week={selectedWeek}
          day={selectedDay}
          onBack={handleBackToWeeks}
        />
      )}

      <footer className="app-footer">
        <p>願你在這 8 週中與神建立更深的關係 ❤️</p>
      </footer>
    </div>
  );
}

export default App;
