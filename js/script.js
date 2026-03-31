document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;

    /* ══════════════════ UTILS ══════════════════ */
    const debounce = (fn, delay = 100) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    /* ══════════════════ NAVIGATION & MOBILE MENU ══════════════════ */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Scroll Effect with Throttle-like check
    const handleScroll = () => {
        if (!navbar.classList.contains('scrolled-fixed')) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else if (!navbar.hasAttribute('data-fixed')) {
                navbar.classList.remove('scrolled');
            }
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Toggle Mobile Menu
    if (hamburger && navLinks) {
        const toggleMenu = (forceClose = false) => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            const shouldOpen = forceClose ? false : !isExpanded;
            
            hamburger.setAttribute('aria-expanded', shouldOpen);
            navLinks.classList.toggle('active', shouldOpen);
            hamburger.classList.toggle('open', shouldOpen);
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = shouldOpen ? 'hidden' : '';
        };

        hamburger.addEventListener('click', () => toggleMenu());

        // Close menu on link click
        navLinkItems.forEach(item => {
            item.addEventListener('click', () => toggleMenu(true));
        });
    }

    /* ══════════════════ THEME TOGGLE ══════════════════ */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    const updateThemeIcon = (theme) => {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
        }
    };

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Event for particles
            window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
        });
    }

    /* ══════════════════ TYPEWRITER EFFECT ══════════════════ */
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        const words = [
            "Étudiant en Informatique",
            "Passionné de Data",
            "S'oriente vers la Cyber",
            "Explore l'IA",
            "Développeur Créatif"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    /* ══════════════════ INTERSECTION OBSERVER (REVEAL) ══════════════════ */
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ══════════════════ PARTICLE CANVAS ══════════════════ */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener('resize', debounce(resizeCanvas, 200));
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.8 - 0.4;
                this.speedY = Math.random() * 0.8 - 0.4;
                this.updateColor();
            }

            updateColor() {
                const isDark = htmlElement.getAttribute('data-theme') === 'dark';
                this.color = isDark ? 'rgba(255, 235, 59, 0.2)' : 'rgba(241, 196, 15, 0.2)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.floor(window.innerWidth / 12);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animateParticles);
        }

        animateParticles();
        
        window.addEventListener('themeChanged', () => {
            particles.forEach(p => p.updateColor());
        });
    }

    /* ══════════════════ SMOOTH SCROLL FOR ANCHORS ══════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
