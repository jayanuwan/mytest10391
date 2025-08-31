import { renderHook, act } from '@testing-library/react';
import { useSnackbar } from '../../Hooks/useSnackbar';

describe('useSnackbar', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSnackbar());

    expect(result.current.open).toBe(false);
    expect(result.current.message).toBe('');
    expect(result.current.severity).toBe('success');
  });

  it('should update state when showSnackbar is called', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.showSnackbar('Test Message', 'error');
    });

    expect(result.current.open).toBe(true);
    expect(result.current.message).toBe('Test Message');
    expect(result.current.severity).toBe('error');
  });

  it('should use default severity if not provided', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.showSnackbar('Another message');
    });

    expect(result.current.severity).toBe('success');
  });

  it('should close the snackbar when handleClose is called', () => {
    const { result } = renderHook(() => useSnackbar());

    act(() => {
      result.current.showSnackbar('Closing test', 'info');
    });

    expect(result.current.open).toBe(true);

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.open).toBe(false);
  });
});
