import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  SnackbarProvider,
  useGlobalSnackbar,
} from '../../Context/SnackbarContext';
import * as useSnackbarHook from '../../Hooks/useSnackbar';

describe('SnackbarContext', () => {
  const mockSnackbarValue = {
    open: false,
    message: '',
    severity: 'info' as const,
    showSnackbar: jest.fn(),
    handleClose: jest.fn(),
  };

  beforeEach(() => {
    jest
      .spyOn(useSnackbarHook, 'useSnackbar')
      .mockReturnValue(mockSnackbarValue);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('provides snackbar context to children', () => {
    const TestComponent = () => {
      const { showSnackbar, closeSnackbar }: any = useGlobalSnackbar();
      showSnackbar('Test message');

      return <div>Context Accessed</div>;
    };

    render(
      <SnackbarProvider>
        <TestComponent />
      </SnackbarProvider>
    );

    expect(screen.getByText('Context Accessed')).toBeInTheDocument();
    expect(mockSnackbarValue.showSnackbar).toHaveBeenCalledWith('Test message');
  });

  it('throws error when used outside of provider', () => {
    const TestComponent = () => {
      useGlobalSnackbar();
      return <div>Should not render</div>;
    };

    expect(() => render(<TestComponent />)).toThrow('useGlobalSnackbar error');
  });
});
