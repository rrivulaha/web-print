import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * web-print: Application Entry Point
 * 
 * This file mounts the React application to the 'root' div 
 * defined in index.html. StrictMode is enabled to help 
 * catch common development errors.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);