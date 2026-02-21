document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Menu Mobile (Hamburguer) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('nav-active');
            hamburger.classList.toggle('toggle');
            body.classList.toggle('menu-open'); // Trava o scroll do body
        };

        hamburger.addEventListener('click', toggleMenu);

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if(navLinks.classList.contains('nav-active')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- 2. Preparar Elementos para Animação de Scroll ---
    const animatedElements = document.querySelectorAll('.fade-up, .reveal-left, .reveal-right, .reveal-bottom');
    animatedElements.forEach(el => el.classList.remove('active'));

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px" // Dispara quando elemento atinge 10% do fundo da tela
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- 3. Navbar com Background Dinâmico ---
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        // Usa requestAnimationFrame para não gargalar o scroll
        window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                nav.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)";
                nav.style.padding = "8px 0";
            } else {
                nav.style.boxShadow = "0 2px 15px rgba(0,0,0,0.05)";
                nav.style.padding = "15px 0";
            }
        });
    });

    // --- 4. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- 5. Smooth Scroll com Offset ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 90; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 6. Animação de Números (Estatísticas do Hero) ---
    const animateCounter = (element, target, isDecimal = false) => {
        let start = 0;
        const duration = 2000;
        // Divide o alvo pelos frames (assumindo 60fps -> ~120 frames em 2s)
        const increment = target / 120; 
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                clearInterval(timer);
                element.textContent = isDecimal 
                    ? target.toFixed(1) + '★' 
                    : target.toLocaleString('pt-BR');
            } else {
                element.textContent = isDecimal 
                    ? start.toFixed(1) + '★' 
                    : Math.floor(start).toLocaleString('pt-BR');
            }
        }, 16);
    };

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        if (stat.dataset.animated) return; // Flag mais segura que class
                        stat.dataset.animated = "true";

                        const text = stat.textContent;
                        if (text.includes('★')) {
                            const number = parseFloat(text.replace(',', '.'));
                            stat.textContent = "0.0★"; // Zera antes de começar
                            animateCounter(stat, number, true);
                        } else {
                            const number = parseInt(text.replace(/\D/g, ''));
                            stat.textContent = "0"; // Zera antes de começar
                            animateCounter(stat, number, false);
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(heroStats);
    }

    // --- 7. Efeito Parallax Suave (Apenas Desktop) ---
    const hero = document.querySelector('.hero');
    // Verifica se não é mobile para não causar jank no scroll de celulares
    if (hero && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < hero.offsetHeight) {
                    hero.style.backgroundPositionY = (scrolled * 0.4) + 'px';
                }
            });
        });
    }

    // --- 8. Botão WhatsApp Flutuante ---
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.visibility = 'visible';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.visibility = 'hidden';
            }
        });
    }

    document.body.style.visibility = 'visible';
});