import React from 'react';
import Tooltip from './tooltip';
import './iconbutton.css';

/**
 * IconButton component for action buttons with icons
 * @param {Object} props
 * @param {string} props.icon - Font Awesome icon class
 * @param {string} props.label - Button label
 * @param {boolean} props.isActive - Whether the button is active
 * @param {string} props.activeColor - Active background color
 * @param {function} props.onClick - Click handler
 * @param {string} props.tooltip - Tooltip text
 * @param {string} props.variant - Button variant (default, success, danger)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.ariaLabel - Accessibility label
 */
function IconButton({ 
  icon, 
  label, 
  isActive, 
  activeColor, 
  onClick, 
  tooltip, 
  variant = 'default',
  className = '',
  ariaLabel
}) {
  // Apply inline style for active background color if active
  const style = isActive ? { backgroundColor: activeColor } : {};

  const buttonContent = (
    <button
      className={`icon-button ${variant} ${isActive ? 'active' : ''} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel || label}
      style={style}
    >
      <i className={icon} />
    </button>
  );

  return tooltip ? (
    <Tooltip text={tooltip}>{buttonContent}</Tooltip>
  ) : buttonContent;
}

export default IconButton;