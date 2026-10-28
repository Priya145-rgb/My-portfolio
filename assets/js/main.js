/**
 * Portfolio JavaScript - Priya Kumari
 * High performance, accessible interactions, throttled animations, and responsive navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    /*===== SHOW & HIDE MOBILE MENU =====*/
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('show');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('show') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        });
    }

    /*===== SCROLL SECTIONS ACTIVE LINK (SCROLLSPY) =====*/
    const sections = document.querySelectorAll('section[id]');
    let isScrollTicking = false;

    function scrollActive() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute('id');
            const link = document.querySelector(`.nav__list a[href*="#${sectionId}"]`);

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active-link');
                } else {
                    link.classList.remove('active-link');
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                scrollActive();
                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }, { passive: true });

    // Initial highlight on page load
    scrollActive();

    /*===== 3D PERSPECTIVE TILT ON TERMINAL WINDOW =====*/
    const terminalWindow = document.getElementById('terminal-window');
    if (terminalWindow && window.matchMedia('(pointer: fine)').matches) {
        let tiltTicking = false;
        let cardRect = null;
        let mouseX = 0;
        let mouseY = 0;

        terminalWindow.addEventListener('mouseenter', () => {
            cardRect = terminalWindow.getBoundingClientRect();
            terminalWindow.style.transition = 'none';
        });

        terminalWindow.addEventListener('mousemove', (e) => {
            if (!cardRect) cardRect = terminalWindow.getBoundingClientRect();
            mouseX = e.clientX - cardRect.left - cardRect.width / 2;
            mouseY = e.clientY - cardRect.top - cardRect.height / 2;

            if (!tiltTicking) {
                window.requestAnimationFrame(() => {
                    const rotateX = (-mouseY / (cardRect.height / 2)) * 6;
                    const rotateY = (mouseX / (cardRect.width / 2)) * 6;
                    terminalWindow.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
                    tiltTicking = false;
                });
                tiltTicking = true;
            }
        });

        terminalWindow.addEventListener('mouseleave', () => {
            cardRect = null;
            terminalWindow.style.transition = 'transform 0.45s ease';
            terminalWindow.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    /*===== CONTACT COPY TO CLIPBOARD =====*/
    const copyBtns = document.querySelectorAll('.info-item__copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            let success = false;
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    success = true;
                } catch (err) {
                    success = false;
                }
            }

            // Fallback for non-https or older browsers
            if (!success) {
                try {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = textToCopy;
                    tempInput.style.position = 'fixed';
                    tempInput.style.opacity = '0';
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    success = document.execCommand('copy');
                    document.body.removeChild(tempInput);
                } catch (err) {
                    success = false;
                }
            }

            if (success) {
                btn.classList.add('copied');
                const origIcon = btn.innerHTML;
                btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
                btn.setAttribute('title', 'Copied!');

                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = origIcon;
                    btn.setAttribute('title', 'Copy to clipboard');
                }, 2200);
            }
        });
    });

    /*===== CONTACT FORM HANDLING =====*/
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('contact-submit');
    let alertTimeout = null;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Native form validity check
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<ion-icon name="hourglass-outline" class="btn-icon"></ion-icon> <span>Sending...</span>`;
            }

            // Simulate AJAX request
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<ion-icon name="paper-plane" class="btn-icon"></ion-icon> <span>Send Message</span> <ion-icon name="arrow-forward-outline" class="btn-arrow"></ion-icon>`;
                }

                if (formAlert) {
                    formAlert.className = 'cyber-form__alert success';
                    formAlert.textContent = '✓ Thank you! Your message has been sent successfully. I will get back to you shortly.';

                    clearTimeout(alertTimeout);
                    alertTimeout = setTimeout(() => {
                        formAlert.className = 'cyber-form__alert';
                        formAlert.textContent = '';
                    }, 6000);
                }

                contactForm.reset();
            }, 750);
        });
    }

    /*===== GSAP ENTRANCE ANIMATIONS (RESPECTS PREFERS-REDUCED-MOTION) =====*/
    if (typeof gsap !== 'undefined') {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Dismiss curtain overlays immediately without motion
            const overlays = document.querySelectorAll('.overlay');
            overlays.forEach(el => {
                el.style.display = 'none';
            });
        } else {
            // Curtain Reveal
            gsap.to(".first", { duration: 1.1, delay: 0.2, top: "-100%", ease: "power3.inOut" });
            gsap.to(".second", { duration: 1.1, delay: 0.4, top: "-100%", ease: "power3.inOut" });
            gsap.to(".third", { duration: 1.1, delay: 0.6, top: "-100%", ease: "power3.inOut" });

            // Floating Navbar
            gsap.from('.nav__pill', { opacity: 0, duration: 1.5, delay: 1.2, y: -25, ease: 'expo.out' });
            gsap.from('.nav__connect-btn', { opacity: 0, duration: 1.5, delay: 1.3, y: -25, ease: 'expo.out' });

            // Left Hero Content
            gsap.from('.home__greeting-wrap', { opacity: 0, duration: 1.6, delay: 1.3, x: -25, ease: 'expo.out' });
            gsap.from('.home__title', { opacity: 0, duration: 1.8, delay: 1.4, y: 30, ease: 'expo.out' });
            gsap.from('.home__subtitle-box', { opacity: 0, duration: 1.8, delay: 1.5, y: 20, ease: 'expo.out' });
            gsap.from('.home__badges-row', { opacity: 0, duration: 1.8, delay: 1.6, y: 20, ease: 'expo.out' });
            gsap.from('.home__actions', { opacity: 0, duration: 1.8, delay: 1.7, y: 20, ease: 'expo.out' });

            // Right Hero Visual Elements
            gsap.from('.visual__halo', { opacity: 0, scale: 0.6, duration: 2, delay: 1.4, ease: 'expo.out' });
            gsap.from('.terminal__window', { opacity: 0, duration: 1.8, delay: 1.6, x: -30, ease: 'expo.out' });
            gsap.from('.sticky__note', { opacity: 0, scale: 0.7, duration: 1.5, delay: 1.8, rotate: 12, ease: 'back.out(1.7)' });
            gsap.from('.tech__dock', { opacity: 0, duration: 1.6, delay: 1.9, x: 30, ease: 'expo.out' });
            gsap.from('.learning__card', { opacity: 0, duration: 1.8, delay: 2.0, y: 30, ease: 'expo.out' });

            // Stats Strip
            gsap.from('.home__stats-bar', { opacity: 0, duration: 2, delay: 2.1, y: 30, ease: 'expo.out' });
            gsap.from('.home__scrolldown', { opacity: 0, duration: 2, delay: 2.3, y: 15, ease: 'expo.out' });
        }
    }

    /*===== CUSTOM THEME CURSOR (#c90018) =====*/
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursor && cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = -100;
        let mouseY = -100;
        let ringX = -100;
        let ringY = -100;
        let isVisible = false;
        let isHovered = false;
        let isClicked = false;
        let isText = false;

        const lerp = (start, end, factor) => start + (end - start) * factor;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                isVisible = true;
                cursor.classList.remove('cursor--hidden');
                ringX = mouseX;
                ringY = mouseY;
            }

            // Direct instant movement for inner dot
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) ${isHovered ? 'scale(0.8)' : isClicked ? 'scale(1.2)' : 'scale(1)'}`;
        }, { passive: true });

        function renderCursor() {
            if (isVisible) {
                ringX = lerp(ringX, mouseX, 0.18);
                ringY = lerp(ringY, mouseY, 0.18);

                let ringScale = 1;
                if (isClicked) ringScale = 0.82;
                else if (isHovered) ringScale = 1.45;
                else if (isText) ringScale = 0.9;

                cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
            }
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        document.addEventListener('mouseleave', () => {
            isVisible = false;
            cursor.classList.add('cursor--hidden');
        });

        document.addEventListener('mouseenter', () => {
            isVisible = true;
            cursor.classList.remove('cursor--hidden');
        });

        window.addEventListener('mousedown', () => {
            isClicked = true;
            cursor.classList.add('cursor--active');
        });

        window.addEventListener('mouseup', () => {
            isClicked = false;
            cursor.classList.remove('cursor--active');
        });

        // Event delegation for interactive elements
        const interactiveSelector = 'a, button, [role="button"], input[type="submit"], .btn, .nav__link, .tool-badge, .skill-category-card, .action__card, .footer__link, .info__card, .contact__feature-card, .dock__item, .concept-item, .home__scrolldown, [data-cursor="hover"]';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                isHovered = true;
                cursor.classList.add('cursor--hover');
            } else if (e.target.closest('input[type="text"], input[type="email"], textarea')) {
                isText = true;
                cursor.classList.add('cursor--text');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                isHovered = false;
                cursor.classList.remove('cursor--hover');
            } else if (e.target.closest('input[type="text"], input[type="email"], textarea')) {
                isText = false;
                cursor.classList.remove('cursor--text');
            }
        });
    }
});