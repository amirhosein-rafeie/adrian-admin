import { Alert, Snackbar } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';

type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarContextValue {
  notify: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextValue>({
  notify: () => undefined
});

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{ open: boolean; message: string; type: SnackbarType }>({
    open: false,
    message: '',
    type: 'success'
  });

  const value = useMemo(
    () => ({
      notify: (message: string, type: SnackbarType = 'success') => {
        setState({ open: true, message, type });
      }
    }),
    []
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar open={state.open} autoHideDuration={3000} onClose={() => setState((s) => ({ ...s, open: false }))}>
        <Alert severity={state.type} variant="filled">
          {state.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
