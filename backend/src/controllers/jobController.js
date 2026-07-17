const pool = require('../config/db');

// POST /api/jobs  (recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, job_type, salary_range } = req.body;

    if (!title || !description || !company) {
      return res.status(400).json({ message: 'Title, description, and company are required.' });
    }

    const result = await pool.query(
      `INSERT INTO jobs (recruiter_id, title, description, company, location, job_type, salary_range)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, title, description, company, location || null, job_type || 'Full-time', salary_range || null]
    );

    res.status(201).json({ message: 'Job posted successfully.', job: result.rows[0] });
  } catch (err) {
    console.error('Create job error:', err.message);
    res.status(500).json({ message: 'Server error while creating job.' });
  }
};

// GET /api/jobs  (public/students - list all jobs, supports ?search= & ?location=)
exports.getAllJobs = async (req, res) => {
  try {
    const { search, location } = req.query;

    // Pagination params — default to page 1, 6 jobs per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM jobs
      JOIN users ON jobs.recruiter_id = users.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      baseQuery += ` AND (jobs.title ILIKE $${params.length} OR jobs.company ILIKE $${params.length})`;
    }

    if (location) {
      params.push(`%${location}%`);
      baseQuery += ` AND jobs.location ILIKE $${params.length}`;
    }

    // Count total matching jobs (for total page count on frontend)
    const countResult = await pool.query(`SELECT COUNT(*) ${baseQuery}`, params);
    const totalJobs = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalJobs / limit);

    // Fetch just this page's worth of jobs
    params.push(limit);
    params.push(offset);
    const dataQuery = `SELECT jobs.*, users.name AS recruiter_name ${baseQuery} ORDER BY jobs.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    const result = await pool.query(dataQuery, params);

    res.json({
      jobs: result.rows,
      currentPage: page,
      totalPages,
      totalJobs,
    });
  } catch (err) {
    console.error('Get jobs error:', err.message);
    res.status(500).json({ message: 'Server error while fetching jobs.' });
  }
};

// GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT jobs.*, users.name AS recruiter_name
       FROM jobs JOIN users ON jobs.recruiter_id = users.id
       WHERE jobs.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get job error:', err.message);
    res.status(500).json({ message: 'Server error while fetching job.' });
  }
};

// GET /api/jobs/recruiter/mine  (recruiter only - jobs they posted)
exports.getMyJobs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE recruiter_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get my jobs error:', err.message);
    res.status(500).json({ message: 'Server error while fetching your jobs.' });
  }
};

// DELETE /api/jobs/:id  (recruiter only, must own the job)
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);

    if (job.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    if (job.rows[0].recruiter_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own job postings.' });
    }

    await pool.query('DELETE FROM jobs WHERE id = $1', [id]);
    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    console.error('Delete job error:', err.message);
    res.status(500).json({ message: 'Server error while deleting job.' });
  }
};
