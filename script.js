/**
 * Personal Portfolio Script
 * Handles theme toggling, mobile menu, smooth scrolling, and scroll interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Dark/Light Mode Toggle
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check localStorage or System Preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update Icon
        if (themeToggleBtn) {
            const iconName = theme === 'dark' ? 'sun' : 'moon';
            themeToggleBtn.innerHTML = `<i data-feather="${iconName}"></i>`;
        }

        // Re-initialize icons
        if (window.feather) feather.replace();
    }

    // Initialize Theme
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Initialize Feather Icons Globally
    if (window.feather) feather.replace();


    // ==========================================
    // 2. Mobile Menu Toggle
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        if (!mobileMenu) return;
        const isActive = mobileMenu.classList.contains('active');

        if (isActive) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });


    // ==========================================
    // 3. Smooth Scroll for Nav Links
    // ==========================================
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    const headerHeight = 80;

    allNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================
    // 4. Scroll Reveal & Active Link
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const revealElements = document.querySelectorAll('.reveal');
    const backToTopBtn = document.getElementById('back-to-top');

    // A. Intersection Observer for Reveal
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach(element => element.classList.add('active'));
    }

    // B. Window Scroll Handler
    function onScroll() {
        const scrollY = window.scrollY;

        // Active Link Highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - (headerHeight + 50);
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });

        // Back to Top Button
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial check

    // ==========================================
    // 5. Back to Top Action
    // ==========================================
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get Field Values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Basic Validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Construct Mailto Link
            // Using encodeURIComponent to handle special characters safely
            const subject = `Portfolio Contact from ${name}`;
            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

            const mailtoLink = `mailto:jeevanm.bit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Open Email Client
            window.location.href = mailtoLink;

            // Optional: Reset form
            contactForm.reset();
        });
    }
});
