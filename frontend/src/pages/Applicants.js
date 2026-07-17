import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const statuses = ['pending', 'reviewed', 'accepted', 'rejected'];

export default function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');

  const fetchApplicants = async () => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplicants(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applicants.');
    }
  };

  useEffect(() => { fetchApplicants(); }, [jobId]);

  const handleStatusChange = async (applicationId, status) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, { status });
      setApplicants(applicants.map((a) =>
        a.application_id === applicationId ? { ...a, status } : a
      ));
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Applicants</h2>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {applicants.length === 0 && !error && <p>No applicants yet.</p>}
      {applicants.map((a) => (
        <div key={a.application_id} style={styles.card}>
          <div>
            <h3>{a.name}</h3>
            <p style={styles.meta}>{a.email}</p>
            {a.cover_letter && <p style={styles.cover}>"{a.cover_letter}"</p>}
            <p style={styles.date}>Applied {new Date(a.applied_at).toLocaleDateString()}</p>
          </div>
          <select
            value={a.status}
            onChange={(e) => handleStatusChange(a.application_id, e.target.value)}
            style={styles.select}
          >
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '30px auto', padding: '0 20px' },
  card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  meta: { color: '#4b5563', margin: '4px 0' },
  cover: { fontStyle: 'italic', color: '#374151', maxWidth: 480 },
  date: { fontSize: 12, color: '#6b7280' },
  select: { padding: 8, borderRadius: 6, border: '1px solid #ccc' },
};
