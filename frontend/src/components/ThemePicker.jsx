import React, { useState } from 'react';

const themes = [
  { label: 'Neon Dark', value: 'default', emoji: '🌙' },
  { label: 'Minimal Black', value: 'minimal', emoji: '⚫' },
  { label: 'Hacker Mode', value: 'hacker', emoji: '💻' },
  { label: 'Frostbite', value: 'frost', emoji: '❄️' },
  { label: 'Crimson Night', value: 'crimson', emoji: '🔥' },
  { label: 'Cyber Void', value: 'cyber', emoji: '🌌' },
];


const ThemePicker = () => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value) => {
    document.body.className = '';
    if (value !== 'default') {
      document.body.classList.add(`theme-${value}`);
    }
    setOpen(false);
  };

  return (
    <div className="theme-dropdown-wrapper">
      <button
        className="theme-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle theme picker"
      >
        🎨 Theme
      </button>

      {open && (
        <ul className="theme-dropdown">
          {themes.map((theme) => (
            <li key={theme.value} onClick={() => handleSelect(theme.value)}>
              {theme.emoji} {theme.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThemePicker;
