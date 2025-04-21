import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './index.css'; // Global styles (optional)

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

function setVh() {
    // Calculate 1% of the viewport height
    let vh = window.innerHeight * 0.01;
    // Set a CSS custom property --vh on the root
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
setVh();
window.addEventListener('resize', setVh);