INSERT INTO employees (name, email, password_hash, role, vacation_balance, sick_balance, casual_balance)
VALUES
  ('Alice Employee', 'alice@company.com', '$2b$10$examplehashreplace', 'EMPLOYEE', 15, 10, 7),
  ('Mark Manager', 'manager@company.com', '$2b$10$examplehashreplace', 'MANAGER', 20, 10, 10);

-- NOTE: Replace $2b$10$examplehashreplace with actual bcrypt hashes generated for your chosen passwords.

