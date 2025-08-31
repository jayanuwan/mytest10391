import React, { useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@mui/material';
import { TextField, Button, MenuItem, Typography } from '@mui/material';
import { getEmployees, saveEmployee, updateEmployee } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalSnackbar } from '../Context/SnackbarContext';

type EmployeeForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  joinedDate: string;
};

interface EmployeeFormWithId extends EmployeeForm {
  id: number;
}

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const genderOptions = ['Male', 'Female', 'Other'];

const AddEmployee: React.FC = () => {
  const [updateStatus, setUpdateStatus] = React.useState<boolean>(false);
  const [didSubmit, setDidSubmit] = React.useState<boolean>(false);
  const { showSnackbar } = useGlobalSnackbar();
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('id');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<EmployeeForm>({
    defaultValues: { gender: 'Male' },
  });
  const formData = watch();

  useEffect(() => {
    if (id) {
      const data = getEmployees();

      const employee = data.find(
        (emp: EmployeeFormWithId) => emp.id === parseInt(id)
      );
      if (employee) {
        reset(employee);
      }
    }
  }, [id, reset]);

  const onSubmit: SubmitHandler<EmployeeForm> = (data: EmployeeForm) => {
    if (id) {
      const status = updateEmployee({
        ...data,
        id: parseInt(id),
      });
      reset();
      status
        ? showSnackbar('Employee updated successfully!', 'success')
        : showSnackbar('Failed to update employee.', 'error');
      setDidSubmit(true);
    } else {
      const employeeWithId = {
        ...data,
        id: Math.floor(100000 + Math.random() * 900000),
      };
      const status = saveEmployee(employeeWithId);
      reset();
      status
        ? showSnackbar('Employee added successfully!', 'success')
        : showSnackbar('Failed to add employee.', 'error');
      setDidSubmit(true);
    }
  };

  React.useEffect(() => {
    if (!updateStatus) setUpdateStatus(true);
  }, [formData]);

  const navigateToHome = () => {
    if (updateStatus && !didSubmit) {
      const confirmLeave = window.confirm(
        'Form has been modified. You will lose your unsaved changes. Are you sure you want to close this form?'
      );
      if (confirmLeave) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {id ? 'Edit' : 'Add'} Employee
        </Typography>
        <Grid marginBottom={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={navigateToHome}
            style={{ marginTop: 16 }}
          >
            Back to Home
          </Button>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="First Name"
                fullWidth
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 6,
                    message: 'First name must be at least 6 characters',
                  },
                  maxLength: {
                    value: 10,
                    message: 'First name must be at most 10 characters',
                  },
                })}
                error={!!errors?.firstName}
                helperText={errors?.firstName?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Last Name"
                fullWidth
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 6,
                    message: 'Last name must be at least 6 characters',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Last name must be at most 10 characters',
                  },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Email"
                fullWidth
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Phone Number"
                fullWidth
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^(?:\+65)?[689]\d{7}$/,
                    message: 'Enter a valid Singapore phone number',
                  },
                })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl
                component="fieldset"
                error={!!errors.gender}
                fullWidth
              >
                <FormLabel component="legend">Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue="Male"
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      {genderOptions.map((option) => (
                        <FormControlLabel
                          key={option}
                          value={option}
                          control={<Radio />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                {errors.gender && (
                  <Typography color="error" variant="caption">
                    {errors.gender.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('dob', { required: 'Date of Birth is required' })}
                error={!!errors.dob}
                helperText={errors.dob?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Joined Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('joinedDate', {
                  required: 'Joined Date is required',
                  validate: (value, formValues) => {
                    if (!formValues.dob) return true;
                    return new Date(value) > new Date(formValues.dob)
                      ? true
                      : 'Joined Date must be after Date of Birth';
                  },
                })}
                error={!!errors.joinedDate}
                helperText={errors.joinedDate?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {id ? 'Update' : 'Submit'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default AddEmployee;
