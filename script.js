// ==================== MOBILE MENU TOGGLE ====================
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const desktopNav = document.querySelector('.desktop-nav');
const allNavLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');

// Toggle mobile menu
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        const isActive = mobileNav.style.display === 'flex';
        mobileNav.style.display = isActive ? 'none' : 'flex';
        hamburger.innerHTML = isActive ? '<i class="fa-solid fa-bars"></i>' : '<i class="fa-solid fa-xmark"></i>';
        hamburger.setAttribute('aria-label', isActive ? 'open menu' : 'close menu');
        hamburger.setAttribute('aria-expanded', !isActive);
    });
}

// Close mobile menu when clicking on a link
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileNav) {
            mobileNav.style.display = 'none';
            if (hamburger) {
                hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
                hamburger.setAttribute('aria-label', 'open menu');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav && hamburger) {
        const isClickInsideNav = mobileNav.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);

        if (!isClickInsideNav && !isClickOnHamburger && mobileNav.style.display === 'flex') {
            mobileNav.style.display = 'none';
            hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
            hamburger.setAttribute('aria-label', 'open menu');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
});

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, targetId);

            // Close mobile menu if open
            if (mobileNav && mobileNav.style.display === 'flex') {
                mobileNav.style.display = 'none';
                if (hamburger) {
                    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
                    hamburger.setAttribute('aria-label', 'open menu');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
});

// ==================== NAVBAR SCROLL EFFECT ====================
const topbar = document.querySelector('.topbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (topbar) {
        if (currentScroll > 100) {
            topbar.style.background = 'rgba(255, 255, 255, 0.98)';
            topbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            topbar.style.background = 'rgba(255, 255, 255, 0.95)';
            topbar.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.06)';
        }
    }

    lastScroll = currentScroll;
});

// ==================== FAQ ACCORDION FUNCTIONALITY ====================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('i');

        // Close all other FAQs
        faqQuestions.forEach(otherQuestion => {
            if (otherQuestion !== question) {
                const otherAnswer = otherQuestion.nextElementSibling;
                const otherIcon = otherQuestion.querySelector('i');
                otherAnswer.classList.remove('active');
                otherQuestion.classList.remove('active');
                if (otherIcon) {
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Toggle current FAQ
        answer.classList.toggle('active');
        question.classList.toggle('active');

        if (icon) {
            if (answer.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    });
});

// ==================== FORM VALIDATION & SUBMISSION ====================
const contactForms = document.querySelectorAll('.contact-form');
const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');

// Real-time validation
formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearError(input));
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    clearError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Show error if invalid
    if (!isValid) {
        showError(field, errorMessage);
    }

    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    field.style.borderColor = 'var(--clr-secondary)';

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--clr-secondary)';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '0.25rem';

    // Insert after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '#e0e0e0';

    // Remove error message
    const errorElement = field.nextSibling;
    if (errorElement && errorElement.className === 'error-message') {
        errorElement.remove();
    }
}

// Form submission
contactForms.forEach(contactForm => {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual Formspree integration)
            setTimeout(() => {
                // Show success message
                showNotification('Thank you for your request! We will get back to you within 24 hours.', 'success');

                // Reset form
                contactForm.reset();

                // Restore button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                // Scroll to top of form
                contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 2000);
        } else {
            showNotification('Please correct the errors in the form.', 'error');
        }
    });
});

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--clr-success)' : type === 'error' ? 'var(--clr-secondary)' : 'var(--clr-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        max-width: 400px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// ==================== SCROLL ANIMATIONS ====================
// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all cards, process steps, metrics, solution cards, and pain items
document.querySelectorAll('.card, .process-step, .metric-card, .solution-card, .pain-item, .guarantee-item').forEach(el => {
    el.classList.add('animate-ready');
    animateOnScroll.observe(el);
});

// Add animation styles dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyles);

// ==================== ACTIVE NAVIGATION TRACKING ====================
// Highlight current section in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}` || (current === '' && href === '#hero')) {
            link.classList.add('active');
        }
    });
});

// Add active state styles for nav links
const navActiveStyles = document.createElement('style');
navActiveStyles.textContent = `
    .desktop-nav a.active,
    .mobile-nav a.active {
        color: var(--clr-primary);
        font-weight: 600;
    }
    
    .desktop-nav a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(navActiveStyles);

// ==================== WHATSAPP BUTTON TRACKING ====================
const whatsappButtons = document.querySelectorAll('.float-wa, .wa, .contact-method.wa');

whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Track WhatsApp click
        console.log('WhatsApp clicked:', {
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            location: btn.className
        });

        // Show message before redirecting
        showNotification('Opening WhatsApp...', 'info');

        // Redirect after a short delay
        setTimeout(() => {
            const phoneNumber = btn.href ? btn.href : 'https://wa.me/13217546817';
            window.open(phoneNumber, '_blank');
        }, 500);
    });
});

// ==================== UTILITY FUNCTIONS ====================
// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== PERFORMANCE OPTIMIZATION ====================
// Lazy load images when they come into view
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
            }
            imageObserver.unobserve(img);
        }
    });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// ==================== PAGE LOAD ANIMATIONS ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero h1, .hero .subhead, .hero-cta, .service-hero h1, .service-hero .subhead');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// ==================== CLICK TRACKING FOR ANALYTICS ====================
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('click', (e) => {
        // Don't track if it's the hamburger menu or mobile nav
        if (element.classList.contains('hamburger') || element.closest('.mobile-nav')) {
            return;
        }

        console.log('Clicked:', {
            element: e.target.tagName,
            text: e.target.textContent.trim().substring(0, 50),
            href: e.target.href || 'N/A',
            class: e.target.className,
            timestamp: new Date().toISOString()
        });
    });
});