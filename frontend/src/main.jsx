import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ScheduleProvider } from './context/ScheduleContext';
import './index.css';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScheduleProvider>
      <App />
    </ScheduleProvider>
  </React.StrictMode>
);
