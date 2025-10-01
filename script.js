document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIAL ANIMATIONS & OBSERVERS ---
    
    /**
     * Handles the initial Hero section entrance animations.
     */
    function initHeroAnimations() {
        const heroHeadline = document.querySelector('#hero h1');
        const heroCTAs = document.querySelectorAll('#hero a.button, #hero a.link');

        // Start the headline animation slightly after page load
        setTimeout(() => {
            if (heroHeadline) heroHeadline.classList.add('animate');
            // Animate CTAs after the headline finishes (delay set in CSS)
            heroCTAs.forEach(cta => cta.classList.add('animate'));
        }, 100);
    }

    /**
     * Implements the Fade-in-on-Scroll effect using Intersection Observer.
     */
    function setupScrollReveal() {
        const sectionsToReveal = document.querySelectorAll('.section:not(#hero)');

        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% of the section is visible
        };

        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sectionsToReveal.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // --- 2. NAVIGATION & SCROLL INTERACTIVITY ---

    /**
     * Implements smooth scrolling for internal anchor links.
     */
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    e.preventDefault();
                    const targetElement = document.getElementById(href.substring(1));

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                        // Update history state for back/forward navigation
                        history.pushState(null, '', href);
                    }
                }
            });
        });
    }
    
    /**
     * Manages sticky nav (CSS handles stickiness) and active link highlighting.
     */
    function setupStickyNavHighlight() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.header ul a');

        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px', // Center of viewport
            threshold: 0 // Observe entry/exit at the center
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove 'active' from all links
                    navLinks.forEach(link => link.classList.remove('active'));

                    // Add 'active' to the corresponding link
                    const activeLink = document.querySelector(`.header ul a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }
    
    /**
     * Creates and manages a scroll-to-top button.
     */
    function setupScrollToTopButton() {
        // Create the button element
        const btn = document.createElement('button');
        btn.innerHTML = '&#9650;'; // Up arrow
        btn.id = 'scrollToTopBtn';
        btn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(btn);

        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        };

        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        window.addEventListener('scroll', toggleVisibility);
        btn.addEventListener('click', scrollToTop);
    }
    
    // --- 3. ACCORDION (FAQ) ---

    /**
     * Implements a custom, smooth animating FAQ accordion.
     */
    function setupFAQAccordion() {
        const details = document.querySelectorAll('.faq-item');

        details.forEach(detail => {
            detail.addEventListener('toggle', (event) => {
                const content = detail.querySelector('p');
                if (event.target.open) {
                    // Set height explicitly before opening for smooth transition
                    content.style.height = content.scrollHeight + 'px';
                    content.style.opacity = 1;
                } else {
                    // Collapse smoothly
                    content.style.height = '0';
                    content.style.opacity = 0;
                }
            });

            // Initial setup for CSS transition on the content paragraph
            const content = detail.querySelector('p');
            if (content) {
                content.style.overflow = 'hidden';
                content.style.transition = 'height 0.3s ease-out, opacity 0.3s ease-out';
                // Initially collapsed state
                if (!detail.open) {
                    content.style.height = '0';
                    content.style.opacity = 0;
                }
            }

            // Ensure keyboard access and roles
            const summary = detail.querySelector('summary');
            if (summary) {
                 summary.setAttribute('role', 'button');
                 summary.setAttribute('aria-expanded', detail.open);
                 detail.addEventListener('toggle', () => {
                    summary.setAttribute('aria-expanded', detail.open);
                 });
            }
        });
    }


    // --- 4. FORM VALIDATION & SUBMISSION ---

    /**
     * Validates an email address.
     * @param {string} email - The email string to validate.
     * @returns {boolean} - True if valid, false otherwise.
     */
    function isValidEmail(email) {
        // Simple regex for basic email format
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * Handles form validation, feedback, and simulated submission.
     */
    function setupLeadCaptureForm() {
        const form = document.querySelector('#cta form');
        const emailInput = document.getElementById('email');

        // Add hidden input for name (simulated, using a visible one for email)
        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.id = 'name_placeholder';
        nameInput.name = 'name';
        nameInput.value = 'Subscriber'; // Default name for the lead
        form.prepend(nameInput); 
        
        // Add accessibility for error display
        emailInput.setAttribute('aria-invalid', 'false');
        emailInput.setAttribute('aria-describedby', 'email-error');
        const errorSpan = document.createElement('span');
        errorSpan.id = 'email-error';
        errorSpan.classList.add('error-message');
        errorSpan.style.color = 'red';
        errorSpan.style.fontSize = '0.85rem';
        errorSpan.style.display = 'block';
        emailInput.after(errorSpan);


        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            const emailValue = emailInput.value.trim();

            errorSpan.textContent = '';
            emailInput.classList.remove('error');
            emailInput.setAttribute('aria-invalid', 'false');

            if (!emailValue) {
                errorSpan.textContent = 'Email is required.';
                isValid = false;
            } else if (!isValidEmail(emailValue)) {
                errorSpan.textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            if (!isValid) {
                emailInput.classList.add('error');
                emailInput.setAttribute('aria-invalid', 'true');
                emailInput.focus();
                return;
            }

            // --- Simulated Successful Submission ---
            const submitButton = form.querySelector('.submit-cta');
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;

            setTimeout(() => {
                alert(`Thank you for subscribing, ${nameInput.value}! Your 10% off code has been sent to ${emailValue}.`);
                form.reset();
                submitButton.textContent = 'Subscribed!';
                
                // Reset state after a short delay
                setTimeout(() => {
                    submitButton.textContent = 'Get My 10% Off Code';
                    submitButton.disabled = false;
                }, 2000);

            }, 1000); 
        });
    }

    // --- 5. PARALLAX EFFECT ---

    /**
     * Applies a subtle parallax effect to the Hero background.
     */
    function setupHeroParallax() {
        const hero = document.getElementById('hero');
        if (!hero) return;

        // Apply a slight transform based on scroll position
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            // Use a slow factor (e.g., 0.3)
            hero.style.backgroundPositionY = -scrollPosition * 0.3 + 'px';
        });
        
        // Ensure background-attachment is set to fixed or scroll with a large image 
        // in CSS to make the parallax visible, but here we control Y position directly
        // to avoid issues with fixed backgrounds on mobile.
        hero.style.backgroundAttachment = 'scroll';
        hero.style.backgroundRepeat = 'no-repeat';
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundImage = 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 70%), linear-gradient(135deg, var(--color-pink) 0%, var(--color-lavender) 100%)';

    }
    
    
    // --- RUN ALL FUNCTIONS ---
    initHeroAnimations();
    setupSmoothScrolling();
    setupScrollReveal();
    setupFAQAccordion();
    setupLeadCaptureForm();
    setupStickyNavHighlight();
    setupScrollToTopButton();
    setupHeroParallax();

    // ...existing code...
  document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
  
    // --- Footer Fade-in Animation ---    // ...existing code...
    
        // --- Footer Fade-in Animation ---
        const footer = document.getElementById('footer');
        const showFooter = () => {
          const rect = footer.getBoundingClientRect();
          if (rect.top < window.innerHeight - 80) {
            footer.classList.add('visible');
            window.removeEventListener('scroll', showFooter);
          }
        };
        window.addEventListener('scroll', showFooter);
        showFooter();
    
    });
    const footer = document.getElementById('footer');
    const showFooter = () => {
      const rect = footer.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        footer.classList.add('visible');
        window.removeEventListener('scroll', showFooter);
      }
    };
    window.addEventListener('scroll', showFooter);
    showFooter();
  
    // ...existing code...
  });