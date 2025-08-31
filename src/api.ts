export type IEmployeeFormProps = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dob: string;
  joinedDate: string;
};

export function saveEmployee(employee: IEmployeeFormProps) {
  try {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    employees.push(employee);
    localStorage.setItem('employees', JSON.stringify(employees));
    return true;
  } catch (error) {
    console.error('Error saving employee:', error);
    return false;
  }
}

export function getEmployees(): IEmployeeFormProps[] {
  try {
    return JSON.parse(localStorage.getItem('employees') || '[]');
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export function updateEmployee(updatedEmployee: IEmployeeFormProps) {
  try {
    const employees: IEmployeeFormProps[] = JSON.parse(
      localStorage.getItem('employees') || '[]'
    );
    const index = employees.findIndex((emp) => emp.id === updatedEmployee.id);
    if (index !== -1) {
      employees[index] = updatedEmployee;
      localStorage.setItem('employees', JSON.stringify(employees));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating employee:', error);
    return false;
  }
}

export function deleteEmployee(id: number) {
  try {
    let employees: IEmployeeFormProps[] = JSON.parse(
      localStorage.getItem('employees') || '[]'
    );
    employees = employees.filter((emp) => emp.id !== id);
    localStorage.setItem('employees', JSON.stringify(employees));
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
}
