import { useState } from 'react';

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');

  const showSnackbar = (msg: string, sev: typeof severity = 'success') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return {
    open,
    message,
    severity,
    showSnackbar,
    handleClose,
  };
}
