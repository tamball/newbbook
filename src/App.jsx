import React, { useState, useEffect } from 'react';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import SetupView from './components/SetupView';
import OverallProgress from './components/OverallProgress';
import { hasSettings, getOverallProgress, clearSettings, getSettings } from './utils/storage';
import { t } from './utils/i18n';
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
    const lang = getSettings()?.language || 'zh';
    if (window.confirm(t('confirmReset', lang))) {
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
            <h1>Youth Runner 大齋期靈修</h1>
            <p className="subtitle">{t('appSubtitle', getSettings()?.language || 'zh')}</p>
          </div>
          {hasSettings() && view !== 'setup' && (
            <button onClick={handleResetSettings} className="reset-button">
              🔄 {t('resetSettings', getSettings()?.language || 'zh')}
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
              {t('overallProgressText', getSettings()?.language || 'zh', {
                completed: overallProgress.completed,
                total: overallProgress.total,
                pct: overallPercentage
              })}
            </p>
          </div>
        )}
      </header>

      {view === null ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: 'white', margin: '2rem', borderRadius: '10px' }}>
          <h2>{t('loading', getSettings()?.language || 'zh')}</h2>
          <p>{t('checkingSettings', getSettings()?.language || 'zh')}</p>
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
        <p>{t('footerBlessing', getSettings()?.language || 'zh')}</p>
      </footer>
    </div>
  );
}

export default App;
