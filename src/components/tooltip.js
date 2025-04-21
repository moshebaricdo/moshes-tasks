import React from 'react';
import './tooltip.css';

/**
 * Props:
 * - text (string): The text to display in the tooltip
 * - children (node): The element that triggers the tooltip on hover (e.g., an IconButton)
 * - position (string): Optional. Position of the tooltip ('left' or 'right'). Defaults to 'right'.
 */
function Tooltip({ text, children, position = 'right' }) {
  return (
    <div className={`tooltip-container ${position}`}>
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
}

export default Tooltip;