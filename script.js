document.addEventListener('DOMContentLoaded', () => {
    /* ══════════════════ NAVIGATION & MOBILE MENU ══════════════════ */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = document.querySelectorAll('.nav-link');

    // Scroll Effect (Don't force if already scrolled class is there from HTML)
    window.addEventListener('scroll', () => {
        if (!navbar.classList.contains('scrolled-fixed')) { // Optional: if we want to fix it on subpages
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else if (!navbar.hasAttribute('data-fixed')) {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Toggle Mobile Menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        // Close menu on click
        navLinkItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.classList.remove('open');
            });
        });
    }

    /* ══════════════════ THEME TOGGLE ══════════════════ */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if (themeIcon) updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
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

    /* ══════════════════ SCROLL REVEAL ══════════════════ */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.9) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    /* ══════════════════ PARTICLE CANVAS ══════════════════ */
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
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
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
        
        // Update colors when theme changes
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                particles.forEach(p => p.updateColor());
            });
        }
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

