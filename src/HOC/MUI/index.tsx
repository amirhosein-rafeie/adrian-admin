import { ReactNode } from 'react';
import MUIRtlConfig from './MUIRtlConfig';
import MUILocalizationProvider from './MUILocalizationProvider';
import MUIGlobalThemeProvider from './MUIGlobalThemeProvider';

const MUIProviders = ({ children }: { children: ReactNode }) => {
  return (
    <MUIRtlConfig>
      <MUILocalizationProvider>
        <MUIGlobalThemeProvider>{children}</MUIGlobalThemeProvider>
      </MUILocalizationProvider>
    </MUIRtlConfig>
  );
};

export default MUIProviders;
