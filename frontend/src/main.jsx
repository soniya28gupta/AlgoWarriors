import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clean development console output: suppress React DevTools download notification
if (typeof window !== 'undefined') {
  const filterDevTools = (origFn) => (...args) => {
    if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('React DevTools')) {
      return;
    }
    origFn.apply(console, args);
  };
  console.log = filterDevTools(console.log);
  console.info = filterDevTools(console.info);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
