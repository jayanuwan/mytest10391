import React, { createContext, useContext } from 'react';
import { useSnackbar } from '../Hooks/useSnackbar';

const SnackbarContext = createContext<
  ReturnType<typeof useSnackbar> | undefined
>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const snackbar = useSnackbar();
  return (
    <SnackbarContext.Provider value={snackbar}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useGlobalSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) throw new Error('useGlobalSnackbar error');
  return context;
};
