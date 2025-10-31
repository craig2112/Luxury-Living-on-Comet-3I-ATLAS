import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

console.log('[DEBUG] index.tsx module loaded.');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("[DEBUG] Fatal: Could not find root element to mount to.");
  throw new Error("Could not find root element to mount to");
}
console.log('[DEBUG] Found root element:', rootElement);


const root = ReactDOM.createRoot(rootElement);
console.log('[DEBUG] React root created. Rendering App...');
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
console.log('[DEBUG] App render initiated.');