const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'employee_leave_management';

let pool;

async function initDatabase() {
  // Step 1: connect without database and ensure DB exists
  const tempPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  try {
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await tempPool.end();
  } catch (err) {
    console.error('Failed creating database', err);
    throw err;
  }

  // Step 2: create main pool pointing at that DB
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Step 3: ensure tables exist
  const createEmployees = `
    CREATE TABLE IF NOT EXISTS employees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('EMPLOYEE', 'MANAGER') NOT NULL DEFAULT 'EMPLOYEE',
      vacation_balance INT NOT NULL DEFAULT 15,
      sick_balance INT NOT NULL DEFAULT 10,
      casual_balance INT NOT NULL DEFAULT 7,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createLeaves = `
    CREATE TABLE IF NOT EXISTS leave_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id INT NOT NULL,
      leave_type ENUM('VACATION', 'SICK', 'CASUAL') NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason TEXT NOT NULL,
      status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
      manager_comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `;

  try {
    await pool.query(createEmployees);
    await pool.query(createLeaves);
    console.log('Database and tables are ready');
  } catch (err) {
    console.error('Failed creating tables', err);
    throw err;
  }
}


initDatabase().catch((err) => {
 
  console.error('Fatal DB init error', err);
  process.exit(1);
});

module.exports = {
  query: (...args) => pool.query(...args),
  execute: (...args) => pool.execute(...args),
  getConnection: (...args) => pool.getConnection(...args),
};

