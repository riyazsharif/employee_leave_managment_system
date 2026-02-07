const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get own leaves and balances (employee)
router.get('/me', authMiddleware(['EMPLOYEE', 'MANAGER']), async (req, res) => {
  try {
    const [employeeRows] = await pool.execute(
      'SELECT id, name, email, role, vacation_balance, sick_balance, casual_balance FROM employees WHERE id = ?',
      [req.user.id]
    );

    const [leaveRows] = await pool.execute(
      'SELECT id, leave_type, start_date, end_date, reason, status, manager_comment FROM leave_requests WHERE employee_id = ? ORDER BY start_date DESC',
      [req.user.id]
    );

    res.json({ employee: employeeRows[0], leaves: leaveRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit leave request
router.post('/', authMiddleware(['EMPLOYEE']), async (req, res) => {
  const { leave_type, start_date, end_date, reason } = req.body;

  if (!leave_type || !start_date || !end_date || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await pool.execute(
      'INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, leave_type, start_date, end_date, reason, 'PENDING']
    );

    res.status(201).json({ message: 'Leave request submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manager: get all requests with status
router.get('/all', authMiddleware(['MANAGER']), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT lr.id,
              lr.employee_id,
              e.name as employee_name,
              lr.leave_type,
              lr.start_date,
              lr.end_date,
              lr.reason,
              lr.status,
              lr.manager_comment
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       ORDER BY lr.start_date DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manager: approve or reject
router.post('/:id/decision', authMiddleware(['MANAGER']), async (req, res) => {
  const { status, manager_comment } = req.body;
  const { id } = req.params;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.execute(
      'SELECT * FROM leave_requests WHERE id = ? FOR UPDATE',
      [id]
    );
    const leave = rows[0];

    if (!leave) {
      await conn.rollback();
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'PENDING') {
      await conn.rollback();
      return res.status(400).json({ message: 'Request already processed' });
    }

    await conn.execute(
      'UPDATE leave_requests SET status = ?, manager_comment = ? WHERE id = ?',
      [status, manager_comment || null, id]
    );

    if (status === 'APPROVED') {
      const [empRows] = await conn.execute(
        'SELECT vacation_balance, sick_balance, casual_balance FROM employees WHERE id = ? FOR UPDATE',
        [leave.employee_id]
      );
      const emp = empRows[0];

      const days =
        (new Date(leave.end_date).getTime() -
          new Date(leave.start_date).getTime()) /
          (1000 * 60 * 60 * 24) +
        1;

      let field;
      if (leave.leave_type === 'VACATION') field = 'vacation_balance';
      else if (leave.leave_type === 'SICK') field = 'sick_balance';
      else field = 'casual_balance';

      if (emp[field] < days) {
        await conn.rollback();
        return res
          .status(400)
          .json({ message: 'Insufficient leave balance for approval' });
      }

      await conn.execute(
        `UPDATE employees SET ${field} = ${field} - ? WHERE id = ?`,
        [days, leave.employee_id]
      );
    }

    await conn.commit();
    res.json({ message: 'Decision recorded' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});

// Calendar view: all approved leaves
router.get('/calendar', authMiddleware(['EMPLOYEE', 'MANAGER']), async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT lr.id, lr.employee_id, e.name as employee_name, lr.leave_type, lr.start_date, lr.end_date
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.id
       WHERE lr.status = 'APPROVED'
       ORDER BY lr.start_date ASC`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

