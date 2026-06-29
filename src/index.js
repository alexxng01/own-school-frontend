import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider, AccountsProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeProvider';
import { initBackendStorage } from './utils/backendStorage';

const root = ReactDOM.createRoot(document.getElementById('root'));

initBackendStorage().then(() => {
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <AccountsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AccountsProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
});