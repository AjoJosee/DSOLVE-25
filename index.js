// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeComponents();
});

// Initialize all components
function initializeComponents() {
    // Initialize tooltips
    initializeTooltips();
    
    // Handle responsive navigation
    handleResponsiveNav();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize event registration
    initializeEventRegistration();
    
    // Initialize authentication
    initializeAuth();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize newsletter subscription
    initializeNewsletter();
}

// Initialize tooltips
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize smooth scrolling
function initializeSmoothScroll() {
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
}

// Initialize form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const inputs = form.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success mt-3';
                successMessage.textContent = 'Form submitted successfully!';
                form.appendChild(successMessage);

                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    successMessage.remove();
                }, 2000);
            }
        });
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize event registration
function initializeEventRegistration() {
    const registerButtons = document.querySelectorAll('.btn-success');
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!isLoggedIn()) {
                // Show login modal if user is not logged in
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            } else {
                // Show success message for registered users
                const successMessage = document.createElement('div');
                successMessage.className = 'alert alert-success mt-3';
                successMessage.textContent = 'Successfully registered for the event!';
                this.parentElement.appendChild(successMessage);
                
                setTimeout(() => {
                    successMessage.remove();
                }, 2000);
            }
        });
    });
}

// Initialize authentication
function initializeAuth() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Add your login logic here
            console.log('Login attempt:', { email, password });
            
            // Close modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            loginModal.hide();
            
            // Update UI to show logged-in state
            updateLoginState(true);
        });
    }

    // Handle register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Add your registration logic here
            console.log('Registration attempt:', { name, email, password });
            
            // Close modal
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            registerModal.hide();
            
            // Update UI to show logged-in state
            updateLoginState(true);
        });
    }

    // Initialize login state
    updateLoginState(isLoggedIn());
}

// Initialize search functionality
function initializeSearch() {
    const eventSearch = document.getElementById('eventSearch');
    if (eventSearch) {
        eventSearch.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Add your search logic here
            console.log('Searching for:', searchTerm);
        }, 300));
    }
}

// Initialize newsletter subscription
function initializeNewsletter() {
    const newsletterForms = document.querySelectorAll('form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return; // Skip if not a newsletter form
            
            const email = emailInput.value.trim();
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('Please enter a valid email address');
                return;
            }
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            try {
                const response = await fetch('http://localhost:3000/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showSuccess('Thank you for subscribing to our newsletter!');
                    form.reset();
                } else {
                    showError(data.error || 'Failed to subscribe. Please try again.');
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showError('An error occurred. Please try again later.');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    });
}

// Show error message
function showError(message) {
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert-danger mt-3';
    errorMessage.textContent = message;
    
    // Find the form that triggered the error
    const form = document.querySelector('form');
    if (form) {
        // Remove any existing error messages
        const existingError = form.querySelector('.alert-danger');
        if (existingError) {
            existingError.remove();
        }
        
        // Add the new error message
        form.appendChild(errorMessage);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }
}

// Show success message
function showSuccess(message) {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-3';
    successMessage.textContent = message;
    
    // Find the form that triggered the success
    const form = document.querySelector('form');
    if (form) {
        // Remove any existing success messages
        const existingSuccess = form.querySelector('.alert-success');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Add the new success message
        form.appendChild(successMessage);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Update login state in UI
function updateLoginState(isLoggedIn) {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    // Add your UI update logic here
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle filter changes
function handleFilterChange() {
    const eventType = document.getElementById('eventTypeFilter').value;
    const dateRange = document.getElementById('dateRangeFilter').value;
    const distance = document.getElementById('distanceFilter').value;

    // Add your filter logic here
    console.log('Filters changed:', { eventType, dateRange, distance });
}

// Handle pagination
function handlePagination(page) {
    // Add your pagination logic here
    console.log('Navigating to page:', page);
}

// Show loading state
function showLoading(element) {
    element.classList.add('loading');
}

// Hide loading state
function hideLoading(element) {
    element.classList.remove('loading');
}

// Format date
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format distance
function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
}

// Handle responsive navigation
function handleResponsiveNav() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
} 