'use client';
import { ReactNode } from 'react';
import MUIRtlConfig from './MUIRtlConfig';
import MUILocalizationProvider from './MUILocalizationProvider';
import MUIGlobalThemeProvider from './MUIGlobalThemeProvider';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
