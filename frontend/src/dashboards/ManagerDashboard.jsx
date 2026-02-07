import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function ManagerDashboard() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decisionComment, setDecisionComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [allRes, calRes] = await Promise.all([
          fetch(`${API_BASE}/leaves/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/leaves/calendar`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setRequests(await allRes.json());
        setCalendarEvents(await calRes.json());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleDecision = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, manager_comment: decisionComment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Unable to update request');
      }
      // re-fetch requests so status updates in real time
      const refreshed = await fetch(`${API_BASE}/leaves/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(await refreshed.json());
      setDecisionComment('');
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message);
    }
  };

  const calendarDays = useMemo(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 30; i += 1) {
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
    return <div>Loading manager dashboard…</div>;
  }

  return (
    <div className="dashboard-grid">
      <section className="card">
        <div className="card-title-row">
          <h2 className="card-title">All leave requests</h2>
          <span className="badge-pill">
            {requests.filter((r) => r.status === 'PENDING').length} pending
          </span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Decision</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.employee_name}</td>
                <td>
                  <span
                    className={`pill-type ${
                      req.leave_type === 'VACATION'
                        ? 'vacation'
                        : req.leave_type === 'SICK'
                        ? 'sick'
                        : 'casual'
                    }`}
                  >
                    {req.leave_type.toLowerCase()}
                  </span>
                </td>
                <td>
                  {req.start_date} → {req.end_date}
                </td>
                <td style={{ maxWidth: 180 }}>{req.reason}</td>
                <td>
                  <span
                    className={`badge-status ${req.status.toLowerCase()}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === 'PENDING' ? (
                    <div className="button-row">
                      <button
                        type="button"
                        className="btn-outline approve"
                        onClick={() => handleDecision(req.id, 'APPROVED')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn-outline reject"
                        onClick={() => handleDecision(req.id, 'REJECTED')}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                      Already {req.status.toLowerCase()}
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {!requests.length && (
              <tr>
                <td colSpan={5}>No pending requests right now.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: '0.75rem' }}>
          <div className="field-label">Optional manager comment</div>
          <textarea
            className="textarea-field"
            placeholder="This note will be saved with your decision"
            value={decisionComment}
            onChange={(e) => setDecisionComment(e.target.value)}
          />
        </div>
      </section>

      <section className="card">
        <div className="card-title-row">
          <h2 className="card-title">Team leave calendar (next 30 days)</h2>
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
      </section>
    </div>
  );
}

