import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import MyApplications from './pages/MyApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJob from './pages/PostJob';
import Applicants from './pages/Applicants';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route
            path="/my-applications"
            element={<PrivateRoute allowedRole="student"><MyApplications /></PrivateRoute>}
          />

          <Route
            path="/recruiter/dashboard"
            element={<PrivateRoute allowedRole="recruiter"><RecruiterDashboard /></PrivateRoute>}
          />
          <Route
            path="/recruiter/post-job"
            element={<PrivateRoute allowedRole="recruiter"><PostJob /></PrivateRoute>}
          />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={<PrivateRoute allowedRole="recruiter"><Applicants /></PrivateRoute>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
