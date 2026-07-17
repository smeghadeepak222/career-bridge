import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const statusColor = {
  pending: '#f59e0b',
  reviewed: '#2563eb',
  accepted: '#16a34a',
  rejected: '#dc2626',
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/applications/mine')
      .then((res) => setApplications(res.data))
      .catch(() => setError('Failed to load applications.'));
  }, []);

  return (
    <div style={styles.container}>
      <h2>My Applications</h2>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {applications.length === 0 && !error && <p>You haven't applied to any jobs yet.</p>}
      {applications.map((app) => (
        <div key={app.id} style={styles.card}>
          <h3>{app.title}</h3>
          <p style={styles.meta}>{app.company} {app.location ? `- ${app.location}` : ''}</p>
          <span style={{ ...styles.badge, backgroundColor: statusColor[app.status] }}>{app.status}</span>
          <p style={styles.date}>Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '30px auto', padding: '0 20px' },
  card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 14 },
  meta: { color: '#4b5563', margin: '4px 0' },
  badge: { color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 12, textTransform: 'capitalize' },
  date: { fontSize: 12, color: '#6b7280', marginTop: 8 },
};
