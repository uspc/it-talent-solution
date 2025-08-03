// Contact form handling with enhanced UX
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm.querySelector('.btn-submit');
  const fileInput = document.getElementById('resume');
  const fileLabel = document.querySelector('.file-upload-label');
  
  // Enhanced file handling with visual feedback
  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      
      if (file.size > maxSize) {
        showFieldError(this, 'File size must be less than 5MB. Please choose a smaller file.');
        this.value = '';
        updateFileLabel('Choose file or drag and drop here');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showFieldError(this, 'Please upload a PDF, DOC, or DOCX file only.');
        this.value = '';
        updateFileLabel('Choose file or drag and drop here');
        return;
      }
      
      // File is valid
      showFieldSuccess(this);
      updateFileLabel(`${file.name} (${formatFileSize(file.size)})`);
    } else {
      updateFileLabel('Choose file or drag and drop here');
    }
  });
  
  // Real-time validation for required fields
  const requiredFields = contactForm.querySelectorAll('input[required], select[required]');
  requiredFields.forEach(field => {
    field.addEventListener('blur', function() {
      validateField(this);
    });
    
    field.addEventListener('input', function() {
      clearFieldError(this);
    });
  });
  
  // Email validation
  const emailField = document.getElementById('email');
  emailField.addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
      showFieldError(this, 'Please enter a valid email address.');
    }
  });
  
  // Drag and drop functionality
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileLabel.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    fileLabel.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    fileLabel.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight(e) {
    fileLabel.style.background = '#eff6ff';
    fileLabel.style.borderColor = '#2563eb';
  }
  
  function unhighlight(e) {
    fileLabel.style.background = '';
    fileLabel.style.borderColor = '';
  }
  
  fileLabel.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
      fileInput.files = files;
      fileInput.dispatchEvent(new Event('change'));
    }
  }
  
  // Helper functions
  function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
      showFieldError(field, 'This field is required.');
      return false;
    }
    showFieldSuccess(field);
    return true;
  }
  
  function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }
  
  function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    // Remove error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
  }
  
  function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error');
    
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) existingError.remove();
  }
  
  function updateFileLabel(text) {
    const fileLabel = document.querySelector('.file-upload-label');
    if (text.includes('(') && text.includes(')')) {
      fileLabel.classList.add('has-file');
      fileLabel.textContent = text;
    } else {
      fileLabel.classList.remove('has-file');
      fileLabel.textContent = text;
    }
  }
  
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // Form submission with enhanced validation
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate all required fields
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    // Special validation for email
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
      showFieldError(emailField, 'Please enter a valid email address.');
      isValid = false;
    }
    
    if (!isValid) {
      showMessage('Please fix the errors above before submitting.', 'error');
      return;
    }
    
    // Add loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Submitting...';
    
    // Create FormData object
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch('/submit-contact', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showMessage('🎉 Thank you! Your application has been submitted successfully. We\'ll get back to you within 24 hours.', 'success');
        contactForm.reset();
        updateFileLabel('Choose file or drag and drop here');
        
        // Clear all validation states
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
          group.classList.remove('success', 'error');
          const messages = group.querySelectorAll('.error-message, .success-message');
          messages.forEach(msg => msg.remove());
        });
      } else {
        showMessage('❌ ' + (result.error || 'There was an error submitting your application. Please try again.'), 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('❌ There was an error submitting your application. Please check your connection and try again.', 'error');
    } finally {
      // Remove loading state
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Submit Application';
    }
  });
  
  function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    // Insert at the top of the form
    const formContainer = document.querySelector('.contact-form-container');
    formContainer.insertBefore(message, contactForm);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        message.remove();
      }, 5000);
    }
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add scroll effect to navbar
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = '#fff';
      navbar.style.backdropFilter = 'none';
    }
  });
});

console.log('Contact page loaded successfully!');
