const pool = require('./server');

const getDepartments = async () => {
  const result = await pool.query('SELECT * FROM department');
  return result.rows;
};

const getRoles = async () => {
  const result = await pool.query('SELECT * FROM role');
  return result.rows;
};

const getEmployees = async () => {
  const result = await pool.query(
    `SELECT e.id, e.first_name, e.last_name, r.title AS role, d.name AS department, r.salary, m.first_name AS manager
     FROM employee e
     LEFT JOIN role r ON e.role_id = r.id
     LEFT JOIN department d ON r.department_id = d.id
     LEFT JOIN employee m ON e.manager_id = m.id`
  );
  return result.rows;
};

const addDepartment = async (name) => {
  const result = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
  return result.rows[0];
};

const addRole = async (title, salary, departmentId) => {
  const result = await pool.query(
    'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
    [title, salary, departmentId]
  );
  return result.rows[0];
};

const addEmployee = async (firstName, lastName, roleId, managerId) => {
  const result = await pool.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [firstName, lastName, roleId, managerId]
  );
  return result.rows[0];
};

const updateEmployeeRole = async (id, roleId) => {
  const result = await pool.query(
    'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *',
    [roleId, id]
  );
  return result.rows[0];
};

module.exports = {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
};