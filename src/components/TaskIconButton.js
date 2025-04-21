import React from 'react';
import Tooltip from './tooltip';
import './TaskIconButton.css';

/**
 * TaskIconButton component for task-related action buttons
 * @param {Object} props
 * @param {string} props.icon - Font Awesome icon class
 * @param {function} props.onClick - Click handler
 * @param {string} props.tooltip - Tooltip text
 * @param {string} props.variant - Button variant (default, success, danger)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.ariaLabel - Accessibility label
 * @param {string} props.tooltipPosition - Position of the tooltip ('left' or 'right')
 */
function TaskIconButton({ 
  icon, 
  onClick, 
  tooltip, 
  variant = 'default',
  className = '',
  ariaLabel,
  tooltipPosition = 'right'
}) {
  const buttonContent = (
    <button
      className={`task-icon-button ${variant} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel || tooltip}
    >
      <i className={icon} />
    </button>
  );

  return tooltip ? (
    <Tooltip text={tooltip} position={tooltipPosition}>{buttonContent}</Tooltip>
  ) : buttonContent;
}

export default TaskIconButton; 