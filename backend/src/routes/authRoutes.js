const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Name, email and password are required' });
  }

  const normalizedRole =
    role && ['EMPLOYEE', 'MANAGER'].includes(role.toUpperCase())
      ? role.toUpperCase()
      : 'EMPLOYEE';

  try {
    const [existing] = await pool.execute(
      'SELECT id, role FROM employees WHERE email = ?',
      [email]
    );
    if (existing.length) {
      const current = existing[0];

      // If user re-registers with same email but different role (e.g. upgrade to MANAGER),
      // update their role and password instead of hard failing.
      if (current.role !== normalizedRole) {
        const passwordHash = await bcrypt.hash(password, 10);
        await pool.execute(
          'UPDATE employees SET name = ?, password_hash = ?, role = ? WHERE id = ?',
          [name, passwordHash, normalizedRole, current.id]
        );
        return res.status(200).json({
          message: `Account updated. You can now login as ${normalizedRole.toLowerCase()}.`,
          id: current.id,
        });
      }

      return res
        .status(409)
        .json({ message: 'Email is already registered with this role' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO employees (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, passwordHash, normalizedRole]
    );

    return res
      .status(201)
      .json({ message: 'Registered successfully, please login', id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role, vacation_balance, sick_balance, casual_balance FROM employees WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        vacation_balance: user.vacation_balance,
        sick_balance: user.sick_balance,
        casual_balance: user.casual_balance,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

