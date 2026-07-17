import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '', job_type: 'Full-time', salary_range: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/jobs', form);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Post a New Job</h2>
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        <input name="title" placeholder="Job Title" value={form.title} onChange={handleChange} required style={styles.input} />
        <input name="company" placeholder="Company Name" value={form.company} onChange={handleChange} required style={styles.input} />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} style={styles.input} />
        <select name="job_type" value={form.job_type} onChange={handleChange} style={styles.input}>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
        <input name="salary_range" placeholder="Salary Range (optional)" value={form.salary_range} onChange={handleChange} style={styles.input} />
        <textarea
          name="description" placeholder="Job Description" value={form.description}
          onChange={handleChange} required rows={6} style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Post Job</button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: 30 },
  form: { display: 'flex', flexDirection: 'column', width: 460, gap: 12 },
  input: { padding: 10, borderRadius: 6, border: '1px solid #ccc' },
  textarea: { padding: 10, borderRadius: 6, border: '1px solid #ccc', fontFamily: 'inherit' },
  button: { padding: 10, borderRadius: 6, border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' },
};
