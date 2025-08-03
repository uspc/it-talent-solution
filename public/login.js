// Login form handling
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const loginBtn = loginForm.querySelector('.btn-login');
  
  // Check if already logged in
  checkAuthStatus();
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable login button
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    const formData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    };
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/post-job.html';
        }, 1500);
      } else {
        showMessage(result.error || 'Invalid credentials. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Login failed. Please try again.', 'error');
    } finally {
      // Re-enable login button
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
    }
  });
  
  async function checkAuthStatus() {
    try {
      const response = await fetch('/auth-status');
      const result = await response.json();
      
      if (result.authenticated) {
        showMessage('You are already logged in. Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/post-job.html';
        }, 1500);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
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
    
    // Insert before the form
    const loginCard = document.querySelector('.login-card');
    loginCard.insertBefore(message, loginForm);
    
    // Auto-remove messages after 5 seconds
    setTimeout(() => {
      message.remove();
    }, 5000);
  }
});

console.log('Login page loaded successfully!');
