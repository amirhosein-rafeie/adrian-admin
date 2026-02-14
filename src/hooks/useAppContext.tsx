import { Alert, AlertColor, Snackbar } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';

type Notification = { open: boolean; message: string; severity: AlertColor };

type AppContextType = {
  isRtl: boolean;
  toggleDirection: () => void;
  notify: (message: string, severity?: AlertColor) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRtl, setIsRtl] = useState(false);
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: '',
    severity: 'success'
  });

  const value = useMemo(
    () => ({
      isRtl,
      toggleDirection: () => setIsRtl((prev) => !prev),
      notify: (message: string, severity: AlertColor = 'success') =>
        setNotification({ open: true, message, severity })
    }),
    [isRtl]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity} variant="filled" sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
