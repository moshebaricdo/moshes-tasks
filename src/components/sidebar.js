// src/components/Sidebar.js
import React from 'react';
import IconButton from './IconButton';
import './sidebar.css';
import Tooltip from './tooltip';

function Sidebar({
  activeItem,
  onCreateClick,
  onBoardClick,
  onArchiveClick,
  isDarkMode,
  onToggleTheme,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Tooltip text="Create (⌘ + N)">
          <IconButton
            icon="fa-solid fa-plus"
            label="Create"
            isActive={activeItem === 'create'}
            activeColor="var(--semantic-background-blue-primary)"
            onClick={onCreateClick}
          />
        </Tooltip>

        <div className="sidebar-divider" />

        <Tooltip text="Board">
          <IconButton
            icon="fa-solid fa-table-columns"
            label="Board"
            isActive={activeItem === 'board'}
            activeColor="var(--semantic-background-blue-primary)"
            onClick={onBoardClick}
          />
        </Tooltip>
      </div>

      <div className="sidebar-bottom">
        <Tooltip text={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton
            icon={isDarkMode ? "fa-solid fa-moon" : "fa-solid fa-sun"}
            label="Toggle Theme"
            isActive={false}
            activeColor="var(--semantic-background-purple-primary)"
            onClick={onToggleTheme}
            className="secondary"
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default Sidebar;