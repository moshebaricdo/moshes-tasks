// src/components/ActionButton.js
import React from 'react';
import './actionbutton.css';

/**
 * Props:
 * - icon (string): FontAwesome icon name (e.g., "check", "xmark").
 * - label (string): Button text.
 * - onClick (function): Click handler.
 * - type (string): Button type ("button", "submit", etc.). Defaults to "button".
 * - className (string): Additional classes.
 * - hasIcon (boolean): If false, the icon is not rendered.
 * - disabled (boolean): If true, the button is disabled.
 */
function ActionButton({
  icon,
  label,
  onClick,
  type = 'button',
  className = '',
  hasIcon = true,
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`action-button ${className}`}
      onClick={onClick}
      title={label}
      disabled={disabled}
    >
      {hasIcon && <i className={`fa-solid fa-${icon}`}></i>}
      {label && <span className="icon-action-label">{label}</span>}
    </button>
  );
}

export default ActionButton;