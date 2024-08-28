import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorProvider } from './ErrorContext';


ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
  <ErrorProvider>
    <App />
  </ErrorProvider>
</React.StrictMode>,
);