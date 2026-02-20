import moment from 'moment-jalaali';
import { ReactNode } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { faIR } from '@mui/x-date-pickers/locales';

moment.loadPersian({ dialect: 'persian-modern' });

function MUILocalizationProvider({ children }: { children: ReactNode }) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterMomentJalaali}
      localeText={
        faIR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      {children}
    </LocalizationProvider>
  );
}

export default MUILocalizationProvider;
