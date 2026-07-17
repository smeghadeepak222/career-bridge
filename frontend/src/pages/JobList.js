import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async (pageToFetch = 1) => {
    try {
      const { data } = await api.get('/jobs', { params: { search, location, page: pageToFetch, limit: 6 } });
      setJobs(data.jobs);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load jobs.');
    }
  };

  useEffect(() => {
    fetchJobs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div style={styles.container}>
      <h2>Browse Jobs</h2>
      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          placeholder="Search by title or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Search</button>
      </form>

      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      <div style={styles.grid}>
        {jobs.length === 0 && <p>No jobs found.</p>}
        {jobs.map((job) => (
          <Link to={`/jobs/${job.id}`} key={job.id} style={styles.card}>
            <h3>{job.title}</h3>
            <p style={styles.company}>{job.company} {job.location ? `- ${job.location}` : ''}</p>
            <p style={styles.type}>{job.job_type}</p>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            disabled={page <= 1}
            onClick={() => fetchJobs(page - 1)}
            style={styles.pageBtn}
          >
            Previous
          </button>
          <span style={{ margin: '0 12px' }}>Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => fetchJobs(page + 1)}
            style={styles.pageBtn}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '30px auto', padding: '0 20px' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  pageBtn: { padding: '8px 16px', borderRadius: 6, border: '1px solid #ccc', backgroundColor: '#fff', cursor: 'pointer' },
  searchBar: { display: 'flex', gap: 10, marginBottom: 20 },
  input: { padding: 10, borderRadius: 6, border: '1px solid #ccc', flex: 1 },
  button: { padding: '10px 18px', borderRadius: 6, border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  card: { border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, textDecoration: 'none', color: '#111827', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  company: { color: '#4b5563' },
  type: { fontSize: 13, color: '#2563eb' },
};
