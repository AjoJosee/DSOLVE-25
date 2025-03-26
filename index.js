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
}); 