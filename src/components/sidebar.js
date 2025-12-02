// src/components/Sidebar.js
import React from 'react';
import IconButton from './IconButton';
import './sidebar.css';
import Tooltip from './tooltip';
import { TAG_OPTIONS } from './tagdropdown';
import codeOrgImg from '../../media/code-org.png';
import tapMoneyImg from '../../media/tapmoney.png';
import mycareClinicImg from '../../media/mycare-clinic.png';
import personalImg from '../../media/personal.png';
import eavWashImg from '../../media/eav-wash.png';
import otherImg from '../../media/other.png';

const TAG_IMAGES = {
  'Code.org': codeOrgImg,
  'TapMoney': tapMoneyImg,
  'MyCare Clinic': mycareClinicImg,
  'Personal': personalImg,
  'EAV Wash Co.': eavWashImg,
  'Other': otherImg,
};

function Sidebar({
  activeItem,
  onCreateClick,
  onBoardClick,
  onArchiveClick,
  isDarkMode,
  onToggleTheme,
  onTagClick,
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

        <div className="sidebar-divider" />

        {TAG_OPTIONS.map((opt) => (
          <Tooltip key={opt.label} text={opt.label}>
            <IconButton
              icon="fa-solid fa-tag"
              label={opt.label}
              isActive={activeItem === `tag:${opt.label}`}
              activeColor={opt.color}
              imageSrc={TAG_IMAGES[opt.label]}
              onClick={() => onTagClick && onTagClick(opt.label)}
            />
          </Tooltip>
        ))}
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