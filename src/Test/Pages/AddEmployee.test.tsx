import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddEmployee from '../../Pages/AddEmployee'; // adjust the path
import { BrowserRouter } from 'react-router-dom';
import { useGlobalSnackbar } from '../../Context/SnackbarContext';
import * as api from '../../api';

// Mocking Context
jest.mock('../../Context/SnackbarContext', () => ({
  useGlobalSnackbar: jest.fn(),
}));

// Mocking React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '',
  }),
  useNavigate: () => jest.fn(),
}));

// Mocking API
jest.mock('../../api', () => ({
  getEmployees: jest.fn(),
  saveEmployee: jest.fn(),
  updateEmployee: jest.fn(),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('AddEmployee Component', () => {
  beforeEach(() => {
    (useGlobalSnackbar as jest.Mock).mockReturnValue({
      showSnackbar: jest.fn(),
    });
  });

  test('renders all input fields', () => {
    render(<AddEmployee />, { wrapper: Wrapper });

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Joined Date/i)).toBeInTheDocument();
  });

  test('validates form and shows errors', async () => {
    render(<AddEmployee />, { wrapper: Wrapper });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Date of Birth is required/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Joined Date is required/i)).toBeInTheDocument();
    });
  });

  test('submits form for new employee and shows success snackbar', async () => {
    const showSnackbar = jest.fn();
    (useGlobalSnackbar as jest.Mock).mockReturnValue({ showSnackbar });
    (api.saveEmployee as jest.Mock).mockReturnValue(true);

    render(<AddEmployee />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'Michael' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Jordan' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'mj@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '91234567' },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/Joined Date/i), {
      target: { value: '2010-01-01' },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(api.saveEmployee).toHaveBeenCalled();
      expect(showSnackbar).toHaveBeenCalledWith(
        'Employee added successfully!',
        'success'
      );
    });
  });

  test('joined date must be after dob', async () => {
    render(<AddEmployee />, { wrapper: Wrapper });

    fireEvent.change(screen.getByLabelText(/Date of Birth/i), {
      target: { value: '2020-01-01' },
    });

    fireEvent.change(screen.getByLabelText(/Joined Date/i), {
      target: { value: '2019-01-01' },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Joined Date must be after Date of Birth/i)
      ).toBeInTheDocument();
    });
  });
});
