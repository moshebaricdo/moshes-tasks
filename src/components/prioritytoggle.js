// src/components/PriorityToggle.js
import React from 'react';
import './PriorityToggle.css';

function PriorityToggle({ value, onChange }) {
  return (
    <div className="priority-toggle">
      <button
        type="button"
        className={`toggle-item low ${value === 'low' ? 'selected' : ''}`}
        onClick={() => onChange('low')}
      >
        <i className="fa-solid fa-snowflake" /> Low
      </button>
      <button
        type="button"
        className={`toggle-item high ${value === 'high' ? 'selected' : ''}`}
        onClick={() => onChange('high')}
      >
        <i className="fa-solid fa-bolt" /> High
      </button>
    </div>
  );
}

export default PriorityToggle;