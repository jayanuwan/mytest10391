import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { deleteEmployee, getEmployees } from '../api';
import DeleteConfirmationPopup from '../Components/DeleteConfirmationPopup';
import { useGlobalSnackbar } from '../Context/SnackbarContext';

const HomePage: React.FC = () => {
  const [rows, setRows] = React.useState(getEmployees());
  const [open, setOpen] = React.useState<boolean>(false);
  const [rowIdToDelete, setRowIDToDelete] = React.useState<number>(0);
  const { showSnackbar } = useGlobalSnackbar();

  const handleEdit = (id: number) => {
    navigate(`/edit?id=${id}`);
  };

  const handleDelete = (id: number) => {
    const result = deleteEmployee(id);
    if (result) {
      setRows(getEmployees());
      setOpen(false);
      showSnackbar('Employee Deleted successfully!', 'success');
    }
  };

  const columns: any[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First name', width: 150 },
    { field: 'lastName', headerName: 'Last name', width: 200 },
    { field: 'email', headerName: 'Email address', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone number', width: 200 },
    { field: 'gender', headerName: 'Gender', width: 200 },
    { field: 'dob', headerName: 'Date of Birth', width: 200 },
    { field: 'joinedDate', headerName: 'Joined Date', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params: { row: { id: number } }) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => {
              setRowIDToDelete(params.row.id);
              setOpen(true);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  const navigate = useNavigate();
  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems="center"
      style={{ height: '100vh' }}
    >
      <Grid gap={2}>
        <Typography>Employee List Management</Typography>
        <Grid columnGap={2} style={{ display: 'flex' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/add')}
            style={{ marginTop: 16 }}
          >
            Add Employee
          </Button>
        </Grid>
        <Grid marginTop={2}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
          />
        </Grid>
        <DeleteConfirmationPopup
          onClose={() => setOpen(false)}
          open={open}
          onConfirm={() => handleDelete(rowIdToDelete)}
        />
      </Grid>
    </Grid>
  );
};

export default HomePage;
