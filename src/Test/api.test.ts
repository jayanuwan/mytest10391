import {
  saveEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  IEmployeeFormProps,
} from '../api';

describe('Employee API (localStorage)', () => {
  const testEmployee: IEmployeeFormProps = {
    id: 1,
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    phoneNumber: '1234567890',
    gender: 'Female',
    dob: '1990-01-01',
    joinedDate: '2020-01-01',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should save an employee to localStorage', () => {
    const result = saveEmployee(testEmployee);

    expect(result).toBe(true);
    const stored = JSON.parse(localStorage.getItem('employees') || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(testEmployee);
  });

  it('should retrieve employees from localStorage', () => {
    localStorage.setItem('employees', JSON.stringify([testEmployee]));

    const result = getEmployees();
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(testEmployee);
  });

  it('should update an existing employee', () => {
    const updated = { ...testEmployee, firstName: 'Bob' };
    localStorage.setItem('employees', JSON.stringify([testEmployee]));

    const result = updateEmployee(updated);
    expect(result).toBe(true);

    const stored = JSON.parse(localStorage.getItem('employees') || '[]');
    expect(stored[0].firstName).toBe('Bob');
  });

  it('should return false if employee to update is not found', () => {
    const result = updateEmployee(testEmployee);
    expect(result).toBe(false);
  });

  it('should delete an employee by id', () => {
    localStorage.setItem('employees', JSON.stringify([testEmployee]));

    const result = deleteEmployee(testEmployee.id);
    expect(result).toBe(true);

    const stored = JSON.parse(localStorage.getItem('employees') || '[]');
    expect(stored).toHaveLength(0);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('employees', 'invalid-json');

    expect(getEmployees()).toEqual([]);
    expect(saveEmployee(testEmployee)).toBe(false);
    expect(updateEmployee(testEmployee)).toBe(false);
    expect(deleteEmployee(testEmployee.id)).toBe(false);
  });
});
