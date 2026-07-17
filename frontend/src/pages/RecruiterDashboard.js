import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/recruiter/mine');
      setJobs(data);
    } catch (err) {
      setError('Failed to load your jobs.');
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      setError('Failed to delete job.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Job Postings</h2>
        <Link to="/recruiter/post-job" style={styles.postBtn}>+ Post New Job</Link>
      </div>
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}
      {jobs.length === 0 && !error && <p>You haven't posted any jobs yet.</p>}
      {jobs.map((job) => (
        <div key={job.id} style={styles.card}>
          <div>
            <h3>{job.title}</h3>
            <p style={styles.meta}>{job.company} {job.location ? `- ${job.location}` : ''}</p>
          </div>
          <div style={styles.actions}>
            <Link to={`/recruiter/jobs/${job.id}/applicants`} style={styles.link}>View Applicants</Link>
            <button onClick={() => handleDelete(job.id)} style={styles.deleteBtn}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: '30px auto', padding: '0 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  postBtn: { backgroundColor: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 6, textDecoration: 'none' },
  card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  meta: { color: '#4b5563' },
  actions: { display: 'flex', gap: 10, alignItems: 'center' },
  link: { color: '#2563eb', textDecoration: 'none' },
  deleteBtn: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, cursor: 'pointer' },
};
