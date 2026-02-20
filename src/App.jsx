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
    if (window.confirm('Are you sure you want to reset settings? This will clear the start date and spiritual mentor information, but will not delete your devotional entries.')) {
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
            <h1>🌟 New Believer Devotional</h1>
            <p className="subtitle">8-Week Journey with God</p>
          </div>
          {hasSettings() && view !== 'setup' && (
            <button onClick={handleResetSettings} className="reset-button">
              🔄 Reset Settings
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
              Overall Progress: {overallProgress.completed} / {overallProgress.total} days ({overallPercentage}%)
            </p>
          </div>
        )}
      </header>

      {view === null ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: 'white', margin: '2rem', borderRadius: '10px' }}>
          <h2>Loading...</h2>
          <p>Checking settings...</p>
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
        <p>May you build a deeper relationship with God during these 8 weeks ❤️</p>
      </footer>
    </div>
  );
}

export default App;
