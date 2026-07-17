import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>Job Board</Link>
      <div style={styles.links}>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}
        {user && user.role === 'student' && (
          <>
            <Link to="/" style={styles.link}>Browse Jobs</Link>
            <Link to="/my-applications" style={styles.link}>My Applications</Link>
          </>
        )}
        {user && user.role === 'recruiter' && (
          <>
            <Link to="/recruiter/dashboard" style={styles.link}>My Jobs</Link>
            <Link to="/recruiter/post-job" style={styles.link}>Post a Job</Link>
          </>
        )}
        {user && (
          <>
            <span style={styles.userInfo}>{user.name} ({user.role})</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    backgroundColor: '#1f2937',
    color: '#fff',
  },
  brand: { color: '#fff', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '18px' },
  link: { color: '#e5e7eb', textDecoration: 'none' },
  userInfo: { color: '#9ca3af', fontSize: '14px' },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};
