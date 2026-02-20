import React from 'react';
import { getOverallProgress } from '../utils/storage';
import './OverallProgress.css';

const OverallProgress = () => {
  const overall = getOverallProgress();
  const percentage = overall.total > 0 
    ? Math.round((overall.completed / overall.total) * 100) 
    : 0;

  return (
    <div className="overall-progress-bar-chart">
      <div className="bar-chart-header">
        <span className="bar-chart-title">📊 Overall Progress</span>
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
        <span>{overall.completed} / {overall.total} days</span>
      </div>
    </div>
  );
};

export default OverallProgress;
