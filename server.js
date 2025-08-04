const express = require('express');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory user store (in production, use a real database)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@ittalentsolution.com',
    password: bcrypt.hashSync('admin123', 10), // Default password: admin123
    role: 'admin'
  },
  {
    id: 2,
    username: 'hr',
    email: 'hr@ittalentsolution.com', 
    password: bcrypt.hashSync('hr123', 10), // Default password: hr123
    role: 'hr'
  }
];

// In-memory job store (in production, use a real database)
let jobs = [
  { id: 1, title: 'Chief Technology Officer', company: 'FinTech Innovations', location: 'New York, NY', salary: '$250k - $350k', postedBy: 'admin', postedDate: new Date() },
  { id: 2, title: 'VP of Engineering', company: 'HealthTech Solutions', location: 'San Francisco, CA', salary: '$200k - $280k', postedBy: 'admin', postedDate: new Date() },
  { id: 3, title: 'Senior Software Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', salary: '$120k - $160k', postedBy: 'hr', postedDate: new Date() },
  { id: 4, title: 'Marketing Director', company: 'Growth Solutions', location: 'New York, NY', salary: '$100k - $140k', postedBy: 'hr', postedDate: new Date() },
  { id: 5, title: 'Financial Analyst', company: 'InvestPro', location: 'Chicago, IL', salary: '$80k - $110k', postedBy: 'admin', postedDate: new Date() }
];

let nextJobId = 6;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                    file.mimetype === 'application/pdf' ||
                    file.mimetype === 'application/msword' ||
                    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

// Configure nodemailer (you'll need to set up email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password'     // Replace with your app password
  }
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'ittalentsolution-secret-key', // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// About page route
app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Contact page route
app.get('/contact.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Login page route
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Post job page route (protected)
app.get('/post-job.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'post-job.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username || u.email === username);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check auth status
app.get('/auth-status', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Post new job (protected)
app.post('/post-job', requireAuth, (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      description,
      requirements
    } = req.body;

    // Validate required fields
    if (!title || !company || !location || !description) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const newJob = {
      id: nextJobId++,
      title,
      company,
      location,
      salary,
      jobType,
      experience,
      skills,
      description,
      requirements,
      postedBy: req.session.user.username,
      postedDate: new Date(),
      status: 'active'
    };

    jobs.push(newJob);

    res.json({ success: true, job: newJob });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle contact form submission
app.post('/submit-contact', upload.single('resume'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      position,
      experience,
      currentSalary,
      location,
      industry,
      coverLetter,
      consent
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !req.file || !consent) {
      return res.status(400).json({ error: 'Please fill in all required fields and upload your resume.' });
    }

    // Create email content
    const emailContent = `
New job application received from IT Talent Solution website:

Personal Information:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone || 'Not provided'}

Professional Information:
- Position of Interest: ${position || 'Not specified'}
- Years of Experience: ${experience || 'Not specified'}
- Current Salary Range: ${currentSalary || 'Not specified'}
- Preferred Location: ${location || 'Not specified'}
- Industry Interest: ${industry || 'Not specified'}

Cover Letter / Additional Information:
${coverLetter || 'None provided'}

Resume attached: ${req.file.originalname}

Consent given: ${consent === 'on' ? 'Yes' : 'No'}

Submitted on: ${new Date().toLocaleString()}
    `;

    // Email options
    const mailOptions = {
      from: 'noreply@ittalentsolution.com',
      to: 'hr.ittalentsolution@gmail.com',
      subject: `New Job Application - ${firstName} ${lastName} (${position || 'General'})`,
      text: emailContent,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Clean up uploaded file after sending (optional)
    setTimeout(() => {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }, 60000); // Delete after 1 minute

    res.json({ success: true, message: 'Application submitted successfully!' });

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Clean up uploaded file in case of error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// API route for job applications (example)
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.listen(PORT, () => {
  console.log(`IT Talent Solution Server running at http://localhost:${PORT}`);
});
