// OGLOS Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const html = document.documentElement;
    
    // Get saved theme from localStorage or default to light
    let currentTheme = localStorage.getItem('oglos-theme') || 'light';
    setTheme(currentTheme);
    
    function setTheme(theme) {
        html.setAttribute('data-color-scheme', theme);
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        currentTheme = theme;
        localStorage.setItem('oglos-theme', theme);
    }
    
    themeToggle.addEventListener('click', function() {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
    
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Smooth Scrolling Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Active Navigation Highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('.slide');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Run on page load
    
    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        observer.observe(slide);
    });
    
    // Service Card Interactions
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        card.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');
            // You could add functionality here to scroll to booking form
            // or show more details about the service
            console.log('Service clicked:', serviceName);
        });
    });
    
    // Pricing Card Interactions
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const button = card.querySelector('.btn');
        
        button.addEventListener('click', function() {
            const planName = card.querySelector('h3').textContent;
            
            if (planName === 'Custom Model') {
                // Scroll to contact form
                document.querySelector('#contact').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Scroll to booking form
                document.querySelector('#book-project').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Pre-fill project type if possible
                const projectTypeSelect = document.getElementById('project-type');
                if (projectTypeSelect) {
                    // You could map plan names to project types here
                    console.log('Selected plan:', planName);
                }
            }
        });
    });
    
    // Project Form Handling
    const projectForm = document.getElementById('project-form');
    
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            projectType: document.getElementById('project-type').value,
            budget: document.getElementById('budget').value,
            message: document.getElementById('message').value
        };
        
        // Validate form
        if (!validateProjectForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = projectForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification('Project request submitted successfully! We\'ll contact you soon.', 'success');
            projectForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        console.log('Project form submitted:', formData);
    });
    
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-message').value
        };
        
        // Validate form
        if (!validateContactForm(formData)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        console.log('Contact form submitted:', formData);
    });
    
    // Form Validation Functions
    function validateProjectForm(data) {
        const errors = [];
        
        if (!data.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!data.email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.phone.trim()) {
            errors.push('Phone number is required');
        }
        
        if (!data.projectType) {
            errors.push('Please select a project type');
        }
        
        if (!data.budget.trim()) {
            errors.push('Budget is required');
        }
        
        if (!data.message.trim()) {
            errors.push('Message is required');
        }
        
        if (errors.length > 0) {
            showNotification('Please fix the following errors:\n• ' + errors.join('\n• '), 'error');
            return false;
        }
        
        return true;
    }
    
    function validateContactForm(data) {
        const errors = [];
        
        if (!data.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!data.email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.message.trim()) {
            errors.push('Message is required');
        }
        
        if (errors.length > 0) {
            showNotification('Please fix the following errors:\n• ' + errors.join('\n• '), 'error');
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            padding: var(--space-16);
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
        `;
        
        if (type === 'success') {
            notification.style.borderLeftColor = 'var(--color-success)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'error') {
            notification.style.borderLeftColor = 'var(--color-error)';
            notification.style.borderLeftWidth = '4px';
        }
        
        document.body.appendChild(notification);
        
        // Slide in animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
    
    function closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Navbar Background on Scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(var(--color-surface-rgb, 252, 252, 249), 0.98)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(var(--color-surface-rgb, 252, 252, 249), 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
    
    // Parallax Effect for Hero Section (subtle)
    window.addEventListener('scroll', function() {
        const heroSection = document.querySelector('.hero-section');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection && scrolled <= heroSection.offsetHeight) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Add CSS for notification styles
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: var(--space-12);
        }
        
        .notification-message {
            color: var(--color-text);
            font-size: var(--font-size-sm);
            line-height: var(--line-height-normal);
            white-space: pre-line;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: var(--font-size-lg);
            cursor: pointer;
            color: var(--color-text-secondary);
            padding: 0;
            line-height: 1;
            transition: color var(--duration-fast) var(--ease-standard);
        }
        
        .notification-close:hover {
            color: var(--color-text);
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // Initialize page
    console.log('OGLOS website initialized successfully!');
    
    // Add smooth reveal animations for elements
    const revealElements = document.querySelectorAll('.service-card, .pricing-card, .client-card, .process-step');
    
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s var(--ease-standard), transform 0.6s var(--ease-standard)';
        revealObserver.observe(element);
    });
});

// Handle page load
window.addEventListener('load', function() {
    // Add loaded class for any load-specific animations
    document.body.classList.add('loaded');
    
    // Initialize any additional features that require full page load
    console.log('OGLOS website fully loaded!');
});