// src/components/TagDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import './TagDropdown.css';

const TAG_OPTIONS = [
  { label: 'Code.org', color: 'var(--semantic-background-purple-primary)' },
  { label: 'TapMoney', color: 'var(--semantic-background-blue-primary)' },
  { label: 'MyCare Clinic', color: 'var(--semantic-background-red-primary)' },
  { label: 'Personal', color: 'var(--semantic-background-green-primary)' },
  { label: 'EAV Wash Co.', color: 'var(--semantic-background-orange-primary)' },
  { label: 'Other', color: 'var(--semantic-background-yellow-primary)' },
];

function TagDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = TAG_OPTIONS.find(opt => opt.label === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(tagLabel) {
    onChange(tagLabel);
    setIsOpen(false);
  }

  return (
    <div className="tag-dropdown" ref={dropdownRef}>
      <div
        className="tag-dropdown-display"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value === '' ? (
          <span className="tag-placeholder">Select an option</span>
        ) : (
          <div className="tag-display">
            <span
              className="tag-color-circle"
              style={{ backgroundColor: currentOption?.color }}
            />
            <span>{value}</span>
          </div>
        )}
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} />
      </div>

      {isOpen && (
        <div className="tag-dropdown-menu">
          {TAG_OPTIONS.map((opt) => {
            const isSelected = opt.label === value;
            return (
            <div
                key={opt.label}
                className={`tag-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(opt.label)}
                style={isSelected ? { backgroundColor: opt.color, color: 'var(--semantic-text-neutral-white-fixed)' } : {}}
                >
                {isSelected ? (
                    <i className="fa-solid fa-check tag-checkmark" />
                ) : (
                    <span
                    className="tag-color-circle"
                    style={{ backgroundColor: opt.color }}
                    />
                )}
                <span>{opt.label}</span>
    </div>
  );
})}
        </div>
      )}
    </div>
  );
}

export default TagDropdown;