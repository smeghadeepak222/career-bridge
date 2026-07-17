import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await signup(name, email, password, role);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Sign Up</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text" placeholder="Full Name" value={name}
          onChange={(e) => setName(e.target.value)} required style={styles.input}
        />
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required style={styles.input}
        />
        <input
          type="password" placeholder="Password (min 6 chars)" value={password}
          onChange={(e) => setPassword(e.target.value)} required style={styles.input}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          <option value="student">Student</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" style={styles.button}>Create Account</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: 60 },
  form: { display: 'flex', flexDirection: 'column', width: 340, gap: 12 },
  input: { padding: 10, borderRadius: 6, border: '1px solid #ccc' },
  button: { padding: 10, borderRadius: 6, border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer' },
  error: { color: '#dc2626' },
};
