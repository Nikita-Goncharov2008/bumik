document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeDropdowns();
    initializeMessages();
    initializeThemeToggle();
    initializeMobileMenu();
    initializeTooltips();
    initializeAnimations();
});

/**
 * Dropdown functionality
 */
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown__trigger');
        const menu = dropdown.querySelector('.dropdown__menu');
        
        if (trigger && menu) {
            // Toggle dropdown on click
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('dropdown--open');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('dropdown--open');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('dropdown--open');
                }
            });
            
            // Close dropdown on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    dropdown.classList.remove('dropdown--open');
                }
            });
        }
    });
}

/**
 * Message notifications
 */
function initializeMessages() {
    const messages = document.querySelectorAll('.message');
    
    messages.forEach(message => {
        const closeBtn = message.querySelector('.message__close');
        const autoHide = message.dataset.autoHide === 'true';
        
        // Close button functionality
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                hideMessage(message);
            });
        }
        
        // Auto-hide messages
        if (autoHide) {
            setTimeout(() => {
                hideMessage(message);
            }, 5000);
        }
        
        // Show message with animation
        setTimeout(() => {
            message.classList.add('message--visible');
        }, 100);
    });
}

function hideMessage(message) {
    message.style.opacity = '0';
    message.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 300);
}

function showMessage(text, type = 'info') {
    const messagesContainer = document.querySelector('.messages') || createMessagesContainer();
    
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert-triangle',
        info: 'info'
    };
    
    const messageEl = document.createElement('div');
    messageEl.className = `message message--${type}`;
    messageEl.innerHTML = `
        <div class="message__content">
            <i class="message__icon" data-feather="${icons[type] || 'info'}"></i>
            <span class="message__text">${text}</span>
        </div>
        <button class="message__close" data-feather="x"></button>
    `;
    
    messagesContainer.appendChild(messageEl);
    
    // Initialize feather icons for new message
    feather.replace();
    
    // Add event listeners
    const closeBtn = messageEl.querySelector('.message__close');
    closeBtn.addEventListener('click', () => hideMessage(messageEl));
    
    // Show and auto-hide
    setTimeout(() => messageEl.classList.add('message--visible'), 100);
    setTimeout(() => hideMessage(messageEl), 5000);
}

function createMessagesContainer() {
    const container = document.createElement('div');
    container.className = 'messages';
    document.body.appendChild(container);
    return container;
}

/**
 * Theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const isDark = html.classList.contains('theme-dark');
            
            if (isDark) {
                html.classList.remove('theme-dark');
                html.classList.add('theme-light');
                localStorage.setItem('theme', 'light');
                updateThemeIcon(this, false);
            } else {
                html.classList.remove('theme-light');
                html.classList.add('theme-dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon(this, true);
            }
            
            // Send AJAX request to update user preference
            updateUserTheme(!isDark);
        });
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.className = `theme-${savedTheme}`;
        if (themeToggle) {
            updateThemeIcon(themeToggle, savedTheme === 'dark');
        }
    }
}

function updateThemeIcon(button, isDark) {
    const icon = button.querySelector('i');
    if (icon) {
        icon.setAttribute('data-feather', isDark ? 'sun' : 'moon');
        feather.replace();
    }
}

function updateUserTheme(isDark) {
    fetch('/api/user/theme/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ dark_theme: isDark })
    }).catch(console.error);
}

/**
 * Mobile menu functionality
 */
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const nav = document.querySelector('.header__nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('nav--open');
            this.classList.toggle('header__mobile-toggle--open');
            
            // Update icon
            const icon = this.querySelector('i');
            if (icon) {
                const isOpen = nav.classList.contains('nav--open');
                icon.setAttribute('data-feather', isOpen ? 'x' : 'menu');
                feather.replace();
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('nav--open');
                mobileToggle.classList.remove('header__mobile-toggle--open');
                
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-feather', 'menu');
                    feather.replace();
                }
            }
        });
    }
}

/**
 * Tooltip functionality
 */
function initializeTooltips() {
    const elements = document.querySelectorAll('[title]');
    
    elements.forEach(element => {
        const title = element.getAttribute('title');
        if (title) {
            element.removeAttribute('title');
            element.dataset.tooltip = title;
            
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
        }
    });
}

function showTooltip(e) {
    const text = e.target.dataset.tooltip;
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
    tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
    
    setTimeout(() => tooltip.classList.add('tooltip--visible'), 10);
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    const tooltip = e.target._tooltip;
    if (tooltip) {
        tooltip.classList.remove('tooltip--visible');
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 200);
        delete e.target._tooltip;
    }
}

/**
 * Animation observers
 */
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Utility functions
 */
function getCSRFToken() {
    const token = document.querySelector('[name=csrfmiddlewaretoken]');
    return token ? token.value : '';
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other modules
window.ProjectManager = {
    showMessage,
    hideMessage,
    getCSRFToken,
    debounce,
    throttle
};