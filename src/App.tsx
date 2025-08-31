import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AddEmployee from './Pages/AddEmployee';
import { SnackbarProvider, useGlobalSnackbar } from './Context/SnackbarContext';
import { Snackbar, Alert } from '@mui/material';

const GlobalSnackbar: React.FC = () => {
  const { open, message, severity, handleClose } = useGlobalSnackbar();
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const App: React.FC = () => (
  <SnackbarProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEmployee />} />
        <Route path="/edit" element={<AddEmployee />} />
      </Routes>
      <GlobalSnackbar />
    </BrowserRouter>
  </SnackbarProvider>
);

export default App;
