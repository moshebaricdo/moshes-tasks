// src/components/TaskCard.js
import React from 'react';
import TaskIconButton from './TaskIconButton';
import './taskcard.css';

function Tag({ label }) {
  const TAG_BACKGROUND_COLORS = {
    'MyCare Clinic': 'var(--semantic-background-red-secondary)',
    'EAV Wash Co.': 'var(--semantic-background-orange-secondary)',
    'Other': 'var(--semantic-background-yellow-secondary)',
    'Personal': 'var(--semantic-background-green-secondary)',
    'TapMoney': 'var(--semantic-background-blue-secondary)',
    'Code.org': 'var(--semantic-background-purple-secondary)',
  };

  const TAG_TEXT_COLORS = {
    'MyCare Clinic': 'var(--semantic-text-red-primary)',
    'EAV Wash Co.': 'var(--semantic-text-orange-primary)',
    'Other': 'var(--semantic-text-yellow-primary)',
    'Personal': 'var(--semantic-text-green-primary)',
    'TapMoney': 'var(--semantic-text-blue-primary)',
    'Code.org': 'var(--semantic-text-purple-primary)',
  };

  const backgroundColor = TAG_BACKGROUND_COLORS[label] || 'var(--semantic-background-neutral-quinary)';
  const color = TAG_TEXT_COLORS[label] || 'var(--semantic-text-neutral-primary)';

  return (
    <span className="task-tag" style={{ backgroundColor, color }}>
      {label}
    </span>
  );
}

function PriorityIcon({ priority }) {
  const normalized = priority.toLowerCase();
  if (normalized === 'high') {
    return <i className="fa-solid fa-bolt priority-icon high" />;
  } else if (normalized === 'low') {
    return <i className="fa-solid fa-snowflake priority-icon low" />;
  }
  return null;
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="task-card-actions">
      <TaskIconButton
        icon="fa-solid fa-xmark-circle"
        onClick={onDelete}
        variant="danger"
      />
      <TaskIconButton
        icon="fa-solid fa-pen-to-square"
        onClick={onEdit}
        variant="default"
      />
    </div>
  );
}

function TaskCard({ name, description, tag, priority, onDelete, onEdit }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4 className="task-name">{name}</h4>
        {priority && <PriorityIcon priority={priority} />}
      </div>
      {description && <p className="task-description">{description}</p>}
      <div className="task-footer">
        {tag && <Tag label={tag} />}
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

export default TaskCard;