const pool = require('../config/db');

// POST /api/applications/:jobId  (student only)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { cover_letter } = req.body;

    const job = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    const existing = await pool.query(
      'SELECT id FROM applications WHERE job_id = $1 AND student_id = $2',
      [jobId, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'You have already applied to this job.' });
    }

    const result = await pool.query(
      `INSERT INTO applications (job_id, student_id, cover_letter)
       VALUES ($1, $2, $3) RETURNING *`,
      [jobId, req.user.id, cover_letter || null]
    );

    res.status(201).json({ message: 'Application submitted successfully.', application: result.rows[0] });
  } catch (err) {
    console.error('Apply to job error:', err.message);
    res.status(500).json({ message: 'Server error while applying to job.' });
  }
};

// GET /api/applications/mine  (student only - applications they've submitted)
exports.getMyApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT applications.*, jobs.title, jobs.company, jobs.location
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       WHERE applications.student_id = $1
       ORDER BY applications.applied_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get my applications error:', err.message);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};

// GET /api/applications/job/:jobId  (recruiter only, must own the job - view applicants)
exports.getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    if (job.rows[0].recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only view applicants for your own job postings.' });
    }

    const result = await pool.query(
      `SELECT applications.id AS application_id, applications.cover_letter, applications.status,
              applications.applied_at, users.id AS student_id, users.name, users.email
       FROM applications
       JOIN users ON applications.student_id = users.id
       WHERE applications.job_id = $1
       ORDER BY applications.applied_at DESC`,
      [jobId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get applicants error:', err.message);
    res.status(500).json({ message: 'Server error while fetching applicants.' });
  }
};

// PATCH /api/applications/:id/status  (recruiter only - update applicant status)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const application = await pool.query(
      `SELECT applications.*, jobs.recruiter_id
       FROM applications JOIN jobs ON applications.job_id = jobs.id
       WHERE applications.id = $1`,
      [id]
    );

    if (application.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    if (application.rows[0].recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only update applications for your own job postings.' });
    }

    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({ message: 'Application status updated.', application: result.rows[0] });
  } catch (err) {
    console.error('Update application status error:', err.message);
    res.status(500).json({ message: 'Server error while updating application.' });
  }
};
