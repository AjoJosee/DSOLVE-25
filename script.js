// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

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

    // Form validation
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

    // Scroll animation for sections
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

    // Event registration functionality
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

    // Check if user is logged in (simulated)
    function isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Handle login form submission
    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'true');
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            loginModal.hide();
            
            // Update UI to show logged-in state
            updateLoginState(true);
        });
    }

    // Handle register form submission
    const registerForm = document.querySelector('#registerModal form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('isLoggedIn', 'true');
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            registerModal.hide();
            
            // Update UI to show logged-in state
            updateLoginState(true);
        });
    }

    // Update UI based on login state
    function updateLoginState(isLoggedIn) {
        const loginButton = document.querySelector('[data-bs-target="#loginModal"]');
        const registerButton = document.querySelector('[data-bs-target="#registerModal"]');
        
        if (isLoggedIn) {
            loginButton.textContent = 'Profile';
            registerButton.style.display = 'none';
        } else {
            loginButton.textContent = 'Login';
            registerButton.style.display = 'block';
        }
    }

    // Initialize login state
    updateLoginState(isLoggedIn());

    // Initialize all components
    initializeComponents();
});

// Initialize all components
function initializeComponents() {
    // Handle responsive navigation
    handleResponsiveNav();

    // Handle form submissions
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
        });
    }

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
        });
    }

    // Event search functionality
    const eventSearch = document.getElementById('eventSearch');
    if (eventSearch) {
        eventSearch.addEventListener('input', debounce(function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Add your search logic here
            console.log('Searching for:', searchTerm);
        }, 300));
    }
}

// Utility function for debouncing
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

// Handle event registration
function registerForEvent(eventId) {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        // Show login modal
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
        return;
    }

    // Add your event registration logic here
    console.log('Registering for event:', eventId);
}

// Check if user is logged in
function isUserLoggedIn() {
    // Add your authentication check logic here
    return false;
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

// Show error message
function showError(message) {
    // Add your error display logic here
    console.error(message);
}

// Show success message
function showSuccess(message) {
    // Add your success display logic here
    console.log(message);
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

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeComponents); 