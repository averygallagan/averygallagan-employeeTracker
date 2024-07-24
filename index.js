const inquirer = require('inquirer');
const db = require('./queries');

const mainMenu = async () => {
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  });

  switch (action) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      process.exit();
  }
};

const viewDepartments = async () => {
  try {
    const departments = await db.getDepartments();
    console.table(departments);
  } catch (err) {
    console.error(err.message);
  }
  await mainMenu();
};

const viewRoles = async () => {
  try {
    const roles = await db.getRoles();
    console.table(roles);
  } catch (err) {
    console.error(err.message);
  }
  await mainMenu();
};

const viewEmployees = async () => {
  try {
    const employees = await db.getEmployees();
    console.table(employees);
  } catch (err) {
    console.error(err.message);
  }
  await mainMenu();
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Enter the department name:'
  });
  try {
    await db.addDepartment(name);
    console.log('Department added successfully.');
  } catch (err) {
    console.error(err.message);
  }
  await mainMenu();
};

const addRole = async () => {
  const departments = await db.getDepartments();
  const departmentChoices = departments.map(dept => ({ name: dept.name, value: dept.id }));

  const { title, salary, departmentId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the role title:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the role salary:'
    },
    {
      type: 'list',
      name: 'departmentId',
      message: 'Select the department for the role:',
      choices: departmentChoices
    }
  ]);

  try {
    await db.addRole(title, salary, departmentId);
    console.log('Role added successfully.');
  } catch (err) {
    console.error(err.message);
  }
  await mainMenu();
};

const addEmployee = async () => {
  const roles = await db.getRoles();
  const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

  const employees = await db.getEmployees();
  const managerChoices = employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
  managerChoices.push({ name: 'None', value: null });

  const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the employee\'s first name:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the employee\'s last name:'
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the employee\'s role:',
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'managerId',
      message: 'Select the employee\'s manager:',
      choices: managerChoices
    }
  ]);

  try {
    await db.addEmployee(firstName, lastName, roleId, managerId);
    console.log('Employee added successfully.');
  } catch (err) {
    console.error(err.message);
  }
  await mainMenu();
};

const updateEmployeeRole = async () => {
  const employees = await db.getEmployees();
  const employeeChoices = employees.map(emp => ({
    name: `${emp.first_name} ${emp.last_name}`,
    value: emp.id
  }));

  const roles = await db.getRoles();
  const roleChoices = roles.map(role => ({
    name: role.title,
    value: role.id
  }));

  const { employeeId, roleId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeId',
      message: 'Select the employee to update:',
      choices: employeeChoices
    },
    {
      type: 'list',
      name: 'roleId',
      message: 'Select the new role for the employee:',
      choices: roleChoices
    }
  ]);

  try {
    await db.updateEmployeeRole(employeeId, roleId);
    console.log('Employee role updated successfully.');
  } catch (err) {
    console.error(err.message);
  }
  await mainMenu();
};

mainMenu();