import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => setError('Job not found.'));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post(`/applications/${id}`, { cover_letter: coverLetter });
      setMessage('Application submitted successfully!');
      setCoverLetter('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply.');
    }
  };

  if (error && !job) return <p style={{ textAlign: 'center', marginTop: 40 }}>{error}</p>;
  if (!job) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2>{job.title}</h2>
      <p style={styles.meta}>{job.company} • {job.location || 'Remote/Unspecified'} • {job.job_type}</p>
      {job.salary_range && <p style={styles.meta}>Salary: {job.salary_range}</p>}
      <p style={styles.meta}>Posted by {job.recruiter_name}</p>
      <hr />
      <p style={styles.description}>{job.description}</p>

      {user && user.role === 'student' && (
        <form onSubmit={handleApply} style={styles.form}>
          <h3>Apply to this job</h3>
          {message && <p style={{ color: '#16a34a' }}>{message}</p>}
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          <textarea
            placeholder="Optional cover letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={5}
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Submit Application</button>
        </form>
      )}

      {!user && <p>Please <a href="/login">login</a> as a student to apply.</p>}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '30px auto', padding: '0 20px' },
  meta: { color: '#4b5563', margin: '4px 0' },
  description: { whiteSpace: 'pre-wrap', lineHeight: 1.6 },
  form: { marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 },
  textarea: { padding: 10, borderRadius: 6, border: '1px solid #ccc', fontFamily: 'inherit' },
  button: { padding: 10, borderRadius: 6, border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', width: 200 },
};
