import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function EmployeeDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [form, setForm] = useState({
    leave_type: 'VACATION',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [meRes, calRes] = await Promise.all([
          fetch(`${API_BASE}/leaves/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/leaves/calendar`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const meData = await meRes.json();
        const calData = await calRes.json();
        setEmployee(meData.employee);
        setLeaves(meData.leaves || []);
        setCalendarEvents(calData || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const validate = () => {
    const next = {};
    if (!form.start_date) next.start_date = 'Start date is required';
    if (!form.end_date) next.end_date = 'End date is required';
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      next.end_date = 'End date cannot be before start date';
    }
    if (!form.reason.trim()) next.reason = 'Reason is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    if (!validate()) return;
    try {
      const res = await fetch(`${API_BASE}/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit leave request');
      }
      setSubmitMessage('Leave request submitted!');
      setForm({
        leave_type: 'VACATION',
        start_date: '',
        end_date: '',
        reason: '',
      });
    } catch (err) {
      setSubmitMessage(err.message);
    }
  };

  const upcoming = useMemo(
    () =>
      leaves
        .filter((l) => l.status !== 'REJECTED')
        .slice(0, 5),
    [leaves]
  );

  const calendarDays = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 14; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const iso = date.toISOString().slice(0, 10);
      const matches = calendarEvents.filter(
        (ev) => iso >= ev.start_date && iso <= ev.end_date
      );
      days.push({ date, iso, events: matches });
    }
    return days;
  }, [calendarEvents]);

  if (loading) {
    return <div>Loading dashboard…</div>;
  }

  if (!employee) {
    return <div>Unable to load employee data.</div>;
  }

  return (
    <div className="dashboard-grid">
      <section className="card">
        <div className="card-title-row">
          <h2 className="card-title">Your leave balances</h2>
          <span className="badge-pill">Up to date</span>
        </div>
        <div className="balance-row">
          <div className="balance-pill">
            <div className="balance-label">Vacation</div>
            <div className="balance-value">
              {employee.vacation_balance} days
            </div>
          </div>
          <div className="balance-pill">
            <div className="balance-label">Sick</div>
            <div className="balance-value">{employee.sick_balance} days</div>
          </div>
          <div className="balance-pill">
            <div className="balance-label">Casual</div>
            <div className="balance-value">{employee.casual_balance} days</div>
          </div>
        </div>

        <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

        <div className="card-title-row">
          <h3 className="card-title">Request new leave</h3>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div>
            <div className="field-label">Leave type</div>
            <select
              name="leave_type"
              value={form.leave_type}
              onChange={handleChange}
              className="select-field"
            >
              <option value="VACATION">Vacation</option>
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
            </select>
          </div>
          <div>
            <div className="field-label">Start date</div>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="date-field"
            />
            {errors.start_date && (
              <p className="field-error">{errors.start_date}</p>
            )}
          </div>
          <div>
            <div className="field-label">End date</div>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="date-field"
            />
            {errors.end_date && <p className="field-error">{errors.end_date}</p>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="field-label">Reason</div>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="textarea-field"
              placeholder="Share a short reason for your leave"
            />
            {errors.reason && <p className="field-error">{errors.reason}</p>}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="primary-button">
              Submit request
            </button>
            {submitMessage && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                {submitMessage}
              </p>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-title-row">
          <h2 className="card-title">Upcoming & status</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((l) => (
              <tr key={l.id}>
                <td>
                  <span
                    className={`pill-type ${
                      l.leave_type === 'VACATION'
                        ? 'vacation'
                        : l.leave_type === 'SICK'
                        ? 'sick'
                        : 'casual'
                    }`}
                  >
                    {l.leave_type.toLowerCase()}
                  </span>
                </td>
                <td>
                  {l.start_date} → {l.end_date}
                </td>
                <td>
                  <span
                    className={`badge-status ${
                      l.status.toLowerCase()
                    }`}
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
            {!upcoming.length && (
              <tr>
                <td colSpan={3}>No leave requests yet.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: '1rem' }}>
          <div className="card-title-row">
            <h3 className="card-title">Team calendar (next 2 weeks)</h3>
          </div>
          <div className="calendar-grid">
            {calendarDays.map((day) => (
              <div key={day.iso} className="calendar-day">
                <div className="calendar-day-label">
                  {day.date.toLocaleDateString(undefined, {
                    weekday: 'short',
                    day: 'numeric',
                  })}
                </div>
                {day.events.map((ev) => (
                  <div key={ev.id} className="calendar-tag">
                    {ev.employee_name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

