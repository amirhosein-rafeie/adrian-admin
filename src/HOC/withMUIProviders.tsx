import { ComponentType } from 'react';
import MUIProviders from './MUI';

export const withMUIProviders = <P extends object>(Component: ComponentType<P>) => {
  const WrappedComponent = (props: P) => {
    return (
      <MUIProviders>
        <Component {...props} />
      </MUIProviders>
    );
  };

  WrappedComponent.displayName = `withMUIProviders(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};
