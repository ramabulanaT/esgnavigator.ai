import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './setupRuntimeDebug.js';
import { ErrorBoundary } from './ErrorBoundary.jsx';

function ensureRoot(){
  let el = document.getElementById('root');
  if(!el){ el = document.createElement('div'); el.id='root'; document.body.appendChild(el); }
  return el;
}
const rootEl = ensureRoot();

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
