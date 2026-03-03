import React from 'react';
import { getOverallProgress, getSettings } from '../utils/storage';
import { t } from '../utils/i18n';
import './OverallProgress.css';

const OverallProgress = () => {
  const lang = getSettings()?.language || 'zh';
  const overall = getOverallProgress();
  const percentage = overall.total > 0 
    ? Math.round((overall.completed / overall.total) * 100) 
    : 0;

  return (
    <div className="overall-progress-bar-chart">
      <div className="bar-chart-header">
        <span className="bar-chart-title">{t('overallProgressTitle', lang)}</span>
        <span className="bar-chart-percentage">{percentage}%</span>
      </div>
      <div className="bar-chart-container">
        <div className="bar-chart-bar">
          <div 
            className="bar-chart-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="bar-chart-stats">
        <span>{t('daysCount', lang, { completed: overall.completed, total: overall.total })}</span>
      </div>
    </div>
  );
};

export default OverallProgress;
