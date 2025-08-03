# IT Talent Solution - Technical Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [API Documentation](#api-documentation)
- [Authentication System](#authentication-system)
- [File Upload System](#file-upload-system)
- [Email Configuration](#email-configuration)
- [Database Design](#database-design)
- [Frontend Architecture](#frontend-architecture)
- [Security Considerations](#security-considerations)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Project Overview

IT Talent Solution is a professional recruitment firm website built with Node.js/Express.js. The application provides comprehensive recruitment services including job posting, candidate management, resume uploads, and professional communication tools.

### Key Features
- **Public Website**: Homepage, About, Contact pages with professional design
- **Authentication System**: Session-based login for HR personnel
- **Job Management**: Protected job posting interface for authenticated users
- **Contact System**: Resume upload and candidate information collection
- **Email Integration**: Automated email notifications for job applications
- **File Upload**: Secure resume upload with validation
- **Responsive Design**: Mobile-friendly interface with modern UX

## Architecture

### Tech Stack
- **Backend**: Node.js with Express.js framework
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: Express-session with bcrypt for password hashing
- **File Upload**: Multer middleware with local storage
- **Email**: Nodemailer with Gmail SMTP
- **Session Storage**: In-memory (production should use Redis/database)
- **Data Storage**: In-memory objects (production should use PostgreSQL/MongoDB)

### Design Patterns
- **MVC Pattern**: Separation of routes, business logic, and views
- **Middleware Pattern**: Authentication, file upload, session management
- **RESTful API**: Standard HTTP methods and status codes
- **Progressive Enhancement**: JavaScript enhances basic HTML forms

## Setup Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Gmail account for email functionality (optional for development)

### Installation

1. **Clone/Download the project**
   ```bash
   cd /path/to/your/projects
   # If using git: git clone <repository-url>
   # Or extract from zip file
   ```

2. **Install Dependencies**
   ```bash
   cd WebProjects
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create uploads directory (if not present)
   mkdir -p uploads
   
   # Set appropriate permissions
   chmod 755 uploads
   ```

4. **Email Configuration (Optional)**
   - Edit `server.js` lines 70-75
   - Replace Gmail credentials with your own
   - Generate Gmail App Password if using 2FA

5. **Start Development Server**
   ```bash
   npm start
   # or
   node server.js
   ```

6. **Access Application**
   - Open browser: http://localhost:3000
   - Default admin login: admin / admin123
   - Default HR login: hr / hr123

## Project Structure

```
WebProjects/
├── .github/
│   └── copilot-instructions.md    # AI coding assistant instructions
├── .vscode/
│   └── tasks.json                 # VS Code task configurations
├── node_modules/                  # npm dependencies (auto-generated)
├── public/                        # Static frontend files
│   ├── index.html                 # Homepage
│   ├── about.html                 # About page
│   ├── contact.html               # Contact/application form
│   ├── login.html                 # HR portal login
│   ├── post-job.html              # Job posting form (protected)
│   ├── style.css                  # Main stylesheet (1200+ lines)
│   ├── script.js                  # Homepage JavaScript
│   ├── contact.js                 # Contact form handling
│   ├── login.js                   # Authentication logic
│   └── post-job.js                # Job posting functionality
├── uploads/                       # File upload storage
├── server.js                      # Main Express application
├── package.json                   # Project configuration
├── package-lock.json             # Dependency lock file
└── README.md                      # User documentation
```

### File Responsibilities

#### Backend Files
- **server.js**: Main application server, routes, middleware, business logic
- **package.json**: Dependencies, scripts, project metadata

#### Frontend Files
- **index.html**: Company homepage with services, stats, featured jobs
- **about.html**: Company information, approach, industry expertise
- **contact.html**: Job application form with resume upload
- **login.html**: HR authentication portal
- **post-job.html**: Job posting interface (requires authentication)
- **style.css**: Complete styling including responsive design, animations
- **JavaScript files**: Page-specific functionality and API interactions

## Dependencies

### Production Dependencies

```json
{
  "bcryptjs": "^3.0.2",      // Password hashing and validation
  "express": "^5.1.0",       // Web framework
  "express-session": "^1.18.2", // Session management
  "multer": "^2.0.2",        // File upload middleware
  "nodemailer": "^7.0.5"     // Email functionality
}
```

### Dependency Details

#### bcryptjs
- **Purpose**: Secure password hashing
- **Usage**: User authentication, password storage
- **Security**: Uses salt rounds (10) for protection against rainbow tables

#### express
- **Purpose**: Web application framework
- **Features**: Routing, middleware, static file serving
- **Version**: 5.1.0 (latest stable)

#### express-session
- **Purpose**: Session management
- **Storage**: Memory store (development only)
- **Security**: Configurable secret key, secure cookies

#### multer
- **Purpose**: Multipart form data handling
- **Features**: File upload, validation, storage configuration
- **Limits**: 5MB file size, PDF/DOC/DOCX only

#### nodemailer
- **Purpose**: Email functionality
- **Provider**: Gmail SMTP (configurable)
- **Features**: HTML emails, attachments, authentication

## API Documentation

### Public Endpoints

#### GET Routes
```
GET /                    # Homepage
GET /about.html          # About page
GET /contact.html        # Contact page
GET /login.html          # Login page
GET /api/jobs           # Job listings (JSON)
```

#### POST Routes
```
POST /submit-contact     # Contact form submission
POST /login              # User authentication
POST /logout             # User logout
```

### Protected Endpoints (Require Authentication)

```
GET /post-job.html       # Job posting form
POST /post-job           # Create new job posting
GET /auth-status         # Check authentication status
```

### API Response Format

#### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

#### Error Response
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

### Contact Form API

#### POST /submit-contact
**Request**: Multipart form data
```
firstName: string (required)
lastName: string (required)
email: string (required, email format)
phone: string (optional)
position: string (optional)
experience: string (optional)
currentSalary: string (optional)
location: string (optional)
industry: string (optional)
coverLetter: string (optional)
resume: file (required, PDF/DOC/DOCX, max 5MB)
consent: boolean (required)
```

**Response**:
```json
{
  "success": true,
  "message": "Application submitted successfully!"
}
```

### Authentication API

#### POST /login
**Request**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@ittalentsolution.com",
    "role": "admin"
  }
}
```

## Authentication System

### Session-Based Authentication
- **Storage**: Express-session with memory store
- **Duration**: 24 hours
- **Security**: CSRF protection, secure cookies in production

### User Roles
```javascript
// Default users (in-memory)
{
  id: 1,
  username: 'admin',
  email: 'admin@ittalentsolution.com',
  password: bcrypt.hashSync('admin123', 10),
  role: 'admin'
},
{
  id: 2,
  username: 'hr',
  email: 'hr@ittalentsolution.com',
  password: bcrypt.hashSync('hr123', 10),
  role: 'hr'
}
```

### Authentication Middleware
```javascript
const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};
```

### Password Security
- **Hashing**: bcrypt with salt rounds = 10
- **Storage**: Never store plain text passwords
- **Validation**: Server-side password comparison

## File Upload System

### Configuration
```javascript
// Storage configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: 'resume-{timestamp}-{random}.{ext}'
});

// Validation rules
- File size: Maximum 5MB
- File types: PDF, DOC, DOCX only
- Security: File type validation by MIME type and extension
```

### Security Measures
- **File Type Validation**: MIME type and extension checking
- **Size Limits**: 5MB maximum to prevent DoS attacks
- **Filename Sanitization**: Unique timestamps prevent conflicts
- **Storage Location**: Local uploads/ directory (configurable)

### File Processing Flow
1. Client selects file
2. JavaScript validates file size/type
3. Form submission with multipart/form-data
4. Server validates file again
5. Multer stores file with unique name
6. Email sent with file attachment
7. File cleanup after successful email (60 seconds delay)

## Email Configuration

### Gmail SMTP Setup
```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'  // Generate from Google Account settings
  }
});
```

### Email Template
- **Recipient**: hr.ittalentsolution@gmail.com
- **Subject**: "New Job Application - {firstName} {lastName} ({position})"
- **Format**: Plain text with structured information
- **Attachments**: Resume file included

### Production Setup
1. Create dedicated Gmail account for the application
2. Enable 2-Factor Authentication
3. Generate App Password (not regular password)
4. Update credentials in server.js
5. Test email functionality

## Database Design

### Current Implementation (In-Memory)
```javascript
// User storage
const users = [
  { id, username, email, password, role }
];

// Job storage
let jobs = [
  { id, title, company, location, salary, postedBy, postedDate, status }
];
```

### Production Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'hr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Jobs Table
```sql
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  salary VARCHAR(100),
  job_type VARCHAR(50),
  experience VARCHAR(50),
  skills TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  posted_by INTEGER REFERENCES users(id),
  posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'
);
```

#### Applications Table (Future Enhancement)
```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  resume_path VARCHAR(500),
  cover_letter TEXT,
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending'
);
```

## Frontend Architecture

### CSS Architecture
- **File Size**: 1200+ lines of organized CSS
- **Structure**: Component-based styling
- **Features**: Responsive design, animations, form validation states
- **Browser Support**: Modern browsers (ES6+ JavaScript)

### CSS Organization
```css
/* Global Styles */
- Typography, colors, base elements

/* Layout Components */
- Header, navigation, footer
- Grid systems, containers

/* Page-Specific Styles */
- Homepage, about, contact, login, post-job

/* Form Components */
- Enhanced form styling
- Custom dropdowns, file uploads
- Validation states, animations

/* Responsive Design */
- Mobile-first approach
- Breakpoints: 768px (tablet), 480px (mobile)
```

### JavaScript Architecture
- **Modular**: Separate JS files for each page
- **Progressive Enhancement**: Works without JavaScript
- **ES6+ Features**: Arrow functions, async/await, destructuring
- **API Integration**: Fetch API for AJAX requests

### Form Enhancement Features
- **Real-time Validation**: Instant feedback on form fields
- **File Upload UX**: Drag-and-drop, progress indication
- **Loading States**: Button animations during submission
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation, screen reader support

## Security Considerations

### Current Security Measures
1. **Password Security**: bcrypt hashing with salt
2. **Session Management**: Secure session configuration
3. **File Upload Security**: Type validation, size limits
4. **Input Validation**: Server-side validation for all inputs
5. **Error Handling**: No sensitive information in error messages

### Production Security Enhancements
1. **HTTPS**: SSL/TLS certificates required
2. **CSRF Protection**: Cross-site request forgery prevention
3. **Rate Limiting**: Prevent brute force attacks
4. **Input Sanitization**: XSS prevention
5. **Database Security**: Parameterized queries, connection security
6. **Environment Variables**: Move secrets to environment configuration

### Security Checklist
- [ ] Change default passwords before production
- [ ] Set up HTTPS with valid SSL certificates
- [ ] Configure environment variables for sensitive data
- [ ] Implement rate limiting for login attempts
- [ ] Add CSRF protection middleware
- [ ] Set up database with proper access controls
- [ ] Configure secure session storage (Redis)
- [ ] Implement input sanitization
- [ ] Set up logging and monitoring
- [ ] Regular security updates for dependencies

## Development Guidelines

### Code Style
- **JavaScript**: ES6+ features, consistent naming
- **CSS**: BEM methodology, mobile-first responsive design
- **HTML**: Semantic markup, accessibility considerations
- **Comments**: Document complex logic and business rules

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature description"
git push origin feature/new-feature

# Hotfix
git checkout -b hotfix/critical-fix
git add .
git commit -m "fix: resolve critical issue"
git push origin hotfix/critical-fix
```

### Testing Strategy
- **Manual Testing**: Form submissions, authentication flows
- **API Testing**: Postman/Insomnia for endpoint testing
- **Browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Responsive design verification
- **Security Testing**: Input validation, file upload security

### Code Review Checklist
- [ ] Functional requirements met
- [ ] Security best practices followed
- [ ] Error handling implemented
- [ ] Responsive design works
- [ ] Accessibility standards met
- [ ] Code is documented
- [ ] No hardcoded secrets
- [ ] Database queries are secure

## Deployment

### Development Environment
```bash
# Start development server
npm start
# or
node server.js

# Access at: http://localhost:3000
```

### Production Deployment

#### Environment Variables
```bash
# .env file (create for production)
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-secure-session-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
```

#### Process Manager (PM2)
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "it-talent-solution"

# Monitor
pm2 monit

# Logs
pm2 logs it-talent-solution
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN mkdir -p uploads
RUN chown -R node:node uploads

USER node

EXPOSE 3000

CMD ["node", "server.js"]
```

### Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
# Create Heroku app
heroku create it-talent-solution

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret

# Deploy
git push heroku main
```

#### AWS/Digital Ocean
- Use PM2 for process management
- Set up Load Balancer
- Configure SSL certificates
- Set up database (RDS/managed database)
- Configure Redis for sessions

## Troubleshooting

### Common Issues

#### Server Won't Start
```bash
# Check if port is in use
lsof -i :3000

# Kill process using port
kill -9 <PID>

# Check Node.js version
node --version  # Should be v18+
```

#### File Upload Issues
```bash
# Check uploads directory permissions
ls -la uploads/
chmod 755 uploads/

# Check disk space
df -h

# Check multer configuration in server.js
```

#### Email Not Working
1. Check Gmail credentials in server.js
2. Verify App Password is generated correctly
3. Test with Gmail's SMTP settings
4. Check firewall/network restrictions

#### Authentication Issues
```javascript
// Check session configuration
app.use(session({
  secret: 'change-this-secret',  // Make sure this is set
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to true for HTTPS
}));
```

#### CSS/JavaScript Not Loading
1. Check static file middleware: `app.use(express.static('public'))`
2. Verify file paths in HTML
3. Check browser console for 404 errors
4. Clear browser cache

### Debug Mode
```bash
# Start with debug logging
DEBUG=express:* node server.js

# Check application logs
tail -f /var/log/application.log
```

### Performance Issues
1. **File Upload**: Increase multer limits if needed
2. **Session Storage**: Move to Redis in production
3. **Database**: Add proper indexing
4. **Static Files**: Use CDN for production
5. **Caching**: Implement appropriate cache headers

---

## Support and Maintenance

### Regular Maintenance Tasks
- [ ] Update npm dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Monitor file upload storage usage
- [ ] Review application logs weekly
- [ ] Backup database regularly
- [ ] Test email functionality monthly

### Monitoring Recommendations
- Application uptime monitoring
- Error rate tracking
- File upload success rates
- Email delivery monitoring
- Database performance metrics
- Security incident logging

### Contact Information
For technical support or questions about this documentation, please contact the development team or refer to the project repository issues section.

---

*Last Updated: August 3, 2025*
