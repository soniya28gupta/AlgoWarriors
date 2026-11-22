import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clean development console output: suppress React DevTools download notification
if (typeof window !== 'undefined') {
  const origInfo = console.info;
  console.info = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('React DevTools')) {
      return;
    }
    origInfo.apply(console, args);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
