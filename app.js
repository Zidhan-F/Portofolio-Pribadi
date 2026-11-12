document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Theme Management (Light / Dark Mode)
    // ==========================================
    // Tema awal sudah diterapkan oleh skrip inline di <head> (mencegah kedipan).
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    const safeStorage = {
        get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
        set(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* storage diblokir */ } }
    };

    const applyTheme = (theme) => {
        if (theme === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');
        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-pressed', String(isDark));
    };

    applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

    themeToggle.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        safeStorage.set('theme', next);
    });

    // Ikuti perubahan tema sistem selama pengguna belum memilih manual
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkQuery.addEventListener?.('change', (e) => {
        if (!safeStorage.get('theme')) applyTheme(e.matches ? 'dark' : 'light');
    });

    // ==========================================
    // 2. Mobile Hamburger Menu
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        const setMenu = (open) => {
            hamburger.classList.toggle('active', open);
            navLinks.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', String(open));
            hamburger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
        };
        const isOpen = () => navLinks.classList.contains('active');

        hamburger.addEventListener('click', () => {
            setMenu(!isOpen());
            if (isOpen()) navLinks.querySelector('.nav-link')?.focus();
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });

        document.addEventListener('click', (e) => {
            if (isOpen() && !hamburger.contains(e.target) && !navLinks.contains(e.target)) setMenu(false);
        });

        // Escape menutup menu dan mengembalikan fokus ke tombol
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen()) {
                setMenu(false);
                hamburger.focus();
            }
        });

        // Reset saat layar diperlebar melewati breakpoint mobile
        window.matchMedia('(min-width: 769px)').addEventListener?.('change', (e) => {
            if (e.matches) setMenu(false);
        });
    }

    // ==========================================
    // 3. Navbar scroll effect
    // ==========================================
    const navbar = document.getElementById('navbar');
    
    const handleNavScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ==========================================
    // 4. Tab Switches for Project Cards
    // ==========================================
    const tabContainers = document.querySelectorAll('.tab-container');
    
    // Pola ARIA Tabs: roving tabindex + navigasi panah, Home, End.
    tabContainers.forEach(container => {
        const tabBtns = Array.from(container.querySelectorAll('.tab-btn'));
        const tabPanels = container.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            const panelId = btn.getAttribute('data-tab');
            const panel = container.querySelector(`#${panelId}`);
            btn.id = btn.id || `tab-${panelId}`;
            btn.setAttribute('aria-controls', panelId);
            btn.tabIndex = btn.classList.contains('active') ? 0 : -1;
            if (panel) {
                panel.setAttribute('aria-labelledby', btn.id);
                panel.tabIndex = 0;
                panel.hidden = !btn.classList.contains('active');
            }
        });

        const activate = (btn, moveFocus) => {
            tabBtns.forEach(b => {
                const selected = b === btn;
                b.classList.toggle('active', selected);
                b.setAttribute('aria-selected', String(selected));
                b.tabIndex = selected ? 0 : -1;
            });
            tabPanels.forEach(p => {
                const show = p.id === btn.getAttribute('data-tab');
                p.classList.toggle('active', show);
                p.hidden = !show;
            });
            if (moveFocus) btn.focus();
        };

        tabBtns.forEach((btn, i) => {
            btn.addEventListener('click', () => activate(btn, false));
            btn.addEventListener('keydown', (e) => {
                let next = null;
                if (e.key === 'ArrowRight') next = tabBtns[(i + 1) % tabBtns.length];
                else if (e.key === 'ArrowLeft') next = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
                else if (e.key === 'Home') next = tabBtns[0];
                else if (e.key === 'End') next = tabBtns[tabBtns.length - 1];
                if (next) {
                    e.preventDefault();
                    activate(next, true);
                }
            });
        });
    });

    // ==========================================
    // 5. Contact Form Validation
    // ==========================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const successFeedback = document.getElementById('form-success-feedback');
    const errorFeedback = document.getElementById('form-error-feedback');

    if (contactForm) {
        const nameInput = document.getElementById('input-name');
        const emailInput = document.getElementById('input-email');
        const messageInput = document.getElementById('input-message');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const rules = [
            [nameInput, v => v.length > 0],
            [emailInput, v => emailPattern.test(v)],
            [messageInput, v => v.length > 0]
        ];

        // Pesan error hanya dihubungkan ke input saat memang tampil, agar
        // screen reader tidak membacakan error pada isian yang sudah benar.
        rules.forEach(([input]) => {
            input.dataset.errorId = input.getAttribute('aria-describedby') || '';
            input.removeAttribute('aria-describedby');
        });

        const validateField = (input, test) => {
            const ok = test(input.value.trim());
            input.closest('.form-group').classList.toggle('invalid', !ok);
            input.setAttribute('aria-invalid', String(!ok));
            if (ok || !input.dataset.errorId) input.removeAttribute('aria-describedby');
            else input.setAttribute('aria-describedby', input.dataset.errorId);
            return ok;
        };

        // Setelah ada error, validasi ulang saat pengguna memperbaikinya
        rules.forEach(([input, test]) => {
            input.addEventListener('input', () => {
                if (input.getAttribute('aria-invalid') === 'true') validateField(input, test);
            });
        });

        const showFeedback = (el) => {
            [successFeedback, errorFeedback].forEach(f => f.classList.remove('visible'));
            if (el) {
                el.classList.add('visible');
                el.focus();
            }
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showFeedback(null);

            const invalid = rules.filter(([input, test]) => !validateField(input, test));
            const isValid = invalid.length === 0;
            if (!isValid) invalid[0][0].focus();

            if (isValid) {
                const submitBtn = document.getElementById('btn-submit-form');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Mengirim...';
                submitBtn.disabled = true;
                
                const formData = new FormData(contactForm);
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    if (response.ok) {
                        contactForm.reset();
                        showFeedback(successFeedback);
                    } else {
                        showFeedback(errorFeedback);
                    }
                })
                .catch(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    showFeedback(errorFeedback);
                });
            }
        });
    }

    // ==========================================
    // 6. Scroll Spy for Navigation
    // ==========================================
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (allNavLinks.length > 0 && sections.length > 0) {
        const onScroll = () => {
            let activeId = '';
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    activeId = section.getAttribute('id');
                }
            });

            allNavLinks.forEach(link => {
                const current = link.getAttribute('href') === `#${activeId}`;
                link.classList.toggle('active', current);
                if (current) link.setAttribute('aria-current', 'true');
                else link.removeAttribute('aria-current');
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ==========================================
    // 7. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

});
