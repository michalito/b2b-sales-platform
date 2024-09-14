import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MessageProvider } from './MessageContext.tsx';
import './i18n';


ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
  <MessageProvider>
    <App />
  </MessageProvider>
</React.StrictMode>,
);