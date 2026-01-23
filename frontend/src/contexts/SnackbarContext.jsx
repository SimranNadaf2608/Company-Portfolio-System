import React, { createContext, useContext, useState, useEffect } from 'react';

const SnackbarContext = createContext(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // success, error, warning, info
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setSnackbar(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {snackbar.open && (
        <div className={`snackbar snackbar-${snackbar.severity}`}>
          <div className="snackbar-content">
            <span className="snackbar-message">{snackbar.message}</span>
            <button className="snackbar-close" onClick={hideSnackbar}>
              ×
            </button>
          </div>
        </div>
      )}
    </SnackbarContext.Provider>
  );
};
