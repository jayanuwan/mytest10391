import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomePage from '../../Pages/Home';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../../api';
import { SnackbarProvider } from '../../Context/SnackbarContext';
import * as useSnackbarHook from '../../Hooks/useSnackbar';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@mui/x-data-grid', () => {
  return {
    DataGrid: (props: any) => (
      <div data-testid="datagrid">
        {props.rows.map((row: any) => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            {row.firstName}
            <button
              onClick={() =>
                props.columns
                  .find((c: any) => c.field === 'actions')
                  .renderCell({ row })
              }
            >
              Actions
            </button>
          </div>
        ))}
      </div>
    ),
  };
});

// Mock API functions
jest.mock('../../api', () => ({
  getEmployees: jest.fn(),
  deleteEmployee: jest.fn(),
}));

const mockEmployees = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    gender: 'Male',
    dob: '1990-01-01',
    joinedDate: '2020-01-01',
  },
];

describe('HomePage Component', () => {
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
  const renderWithProviders = () => {
    render(
      <SnackbarProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </SnackbarProvider>
    );
  };
  beforeEach(() => {
    (api.getEmployees as jest.Mock).mockReturnValue(mockEmployees);
    (api.deleteEmployee as jest.Mock).mockReturnValue(true);
  });

  test.only('renders employee list', () => {
    renderWithProviders();
    expect(screen.getByText('Employee List Management')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  test('opens delete confirmation popup', async () => {
    renderWithProviders();
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(await screen.findByText(/Are you sure/i)).toBeInTheDocument();
  });

  test('confirms deletion and shows snackbar', async () => {
    renderWithProviders();
    fireEvent.click(screen.getByText('Delete'));
    fireEvent.click(await screen.findByText('Confirm'));
    await waitFor(() =>
      expect(
        screen.getByText('Employee Deleted successfully!')
      ).toBeInTheDocument()
    );
  });

  test('navigates to add employee page', () => {
    renderWithProviders();
    const addButton = screen.getByText('Add Employee');
    fireEvent.click(addButton);
    expect(window.location.pathname).toBe('/add');
  });
});
