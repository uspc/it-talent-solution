// Post job form handling
document.addEventListener('DOMContentLoaded', function() {
  const postJobForm = document.getElementById('postJobForm');
  const submitBtn = postJobForm.querySelector('.btn-primary');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Check authentication on page load
  checkAuthStatus();
  
  // Handle form submission
  postJobForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting Job...';
    
    // Collect form data
    const formData = {
      title: document.getElementById('title').value,
      company: document.getElementById('company').value,
      location: document.getElementById('location').value,
      salary: document.getElementById('salary').value,
      jobType: document.getElementById('jobType').value,
      experience: document.getElementById('experience').value,
      skills: document.getElementById('skills').value,
      description: document.getElementById('description').value,
      requirements: document.getElementById('requirements').value
    };
    
    try {
      const response = await fetch('/post-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showMessage('Job posted successfully! The job is now live on your website.', 'success');
        postJobForm.reset();
      } else {
        showMessage(result.error || 'Failed to post job. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Failed to post job. Please check your connection and try again.', 'error');
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Job';
    }
  });
  
  // Handle logout
  logoutBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    try {
      const response = await fetch('/logout', {
        method: 'POST'
      });
      
      if (response.ok) {
        window.location.href = '/login.html';
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login.html';
    }
  });
  
  async function checkAuthStatus() {
    try {
      const response = await fetch('/auth-status');
      const result = await response.json();
      
      if (!result.authenticated) {
        window.location.href = '/login.html';
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      window.location.href = '/login.html';
    }
  }
  
  function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at the top of the container
    const container = document.querySelector('.post-job-container');
    container.insertBefore(message, postJobForm);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        message.remove();
      }, 5000);
    }
  }
});

console.log('Post job page loaded successfully!');
