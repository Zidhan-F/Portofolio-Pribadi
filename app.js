document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Theme Management (Light / Dark Mode)
    // ==========================================
    // Tema awal sudah diterapkan oleh skrip inline di <head> (mencegah kedipan).
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    // 4. Background Code Snippets Parallax
    // ==========================================
    const snippets = document.querySelectorAll('.code-snippet');
    
    if (snippets.length > 0 && window.innerWidth > 768 && !prefersReducedMotion) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            snippets.forEach((snippet, index) => {
                const speed = (index + 1) * 10;
                const moveX = (mouseX - 0.5) * speed;
                const moveY = (mouseY - 0.5) * speed;
                snippet.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }, { passive: true });
    }

    // ==========================================
    // 5. Tab Switches for Project Cards
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
    // 6. Contact Form Validation
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

        const validateField = (input, test) => {
            const ok = test(input.value.trim());
            input.closest('.form-group').classList.toggle('invalid', !ok);
            input.setAttribute('aria-invalid', String(!ok));
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
    // 7. Interactive Terminal
    // ==========================================
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.getElementById('terminal-output');
    const termBody = document.getElementById('terminal-body');

    if (termInput && termOutput && termBody) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const rawCommand = termInput.value;
                const command = rawCommand.trim().toLowerCase();
                termInput.value = '';

                if (!command) return;

                const userLine = document.createElement('p');
                userLine.className = 'terminal-log log-success';
                userLine.innerHTML = `<span class="terminal-prompt">zidhan@portfolio:~$</span> ${rawCommand}`;
                termOutput.appendChild(userLine);

                const responseLine = document.createElement('p');
                responseLine.className = 'terminal-log';

                switch (command) {
                    case 'help':
                        responseLine.innerHTML = `Commands:<br> - <span class="text-highlight">about</span> : Tentang saya<br> - <span class="text-highlight">stack</span> : Tech stack<br> - <span class="text-highlight">contact</span> : Info kontak<br> - <span class="text-highlight">experience</span> : Pengalaman kerja<br> - <span class="text-highlight">education</span> : Pendidikan<br> - <span class="text-highlight">clear</span> : Bersihkan terminal`;
                        break;
                    case 'about':
                        responseLine.textContent = 'Muhammad Zidhan Fadillah — Junior Web Developer & Mahasiswa S1 Teknik Informatika di Universitas Dian Nusantara (UNDIRA). Berpengalaman dalam MERN Stack & CodeIgniter 4 untuk membangun aplikasi web fullstack.';
                        break;
                    case 'stack':
                        responseLine.innerHTML = `<pre style="font-family: var(--font-mono); margin: 0.25rem 0;">{
  "frontend": ["React.js", "HTML5", "CSS3", "JavaScript"],
  "backend": ["Node.js", "Express.js", "CodeIgniter 4", "Laravel", "PHP"],
  "database": ["MongoDB", "MySQL"]
}</pre>`;
                        break;
                    case 'contact':
                        responseLine.innerHTML = `Email: <span class="text-highlight">muzidhan@gmail.com</span><br>Phone: (+62) 812-1878-4571<br>GitHub: <span class="text-highlight">github.com/Zidhan-F</span><br>LinkedIn: <span class="text-highlight">linkedin.com/in/muhammadzidhanfadillah</span><br>Location: Jakarta Barat, Indonesia`;
                        break;
                    case 'experience':
                        responseLine.innerHTML = `1. <span class="text-highlight">PT Dinamika Agung</span> — Junior Web Developer (Internship)<br>   Apr 2026 - Jul 2026 | Fullstack Payroll System<br>2. <span class="text-highlight">Favehotel LTC Glodok</span> — Housekeeping Attendant<br>   Mar 2023 - Apr 2026<br>3. <span class="text-highlight">Jayakarta Hotels</span> — Room Attendant (Part-time)<br>   Jan 2023 - Mar 2023`;
                        break;
                    case 'education':
                        responseLine.innerHTML = `1. <span class="text-highlight">Universitas Dian Nusantara (UNDIRA)</span><br>   S1 Teknik Informatika | Agt 2023 - Sekarang<br>2. <span class="text-highlight">SMKN 60 Jakarta</span><br>   Housekeeping & Front Office Operation`;
                        break;
                    case 'clear':
                        termOutput.innerHTML = '';
                        return;
                    default:
                        responseLine.className = 'terminal-log log-error';
                        responseLine.textContent = `bash: command not found: ${rawCommand}. Ketik 'help' untuk melihat commands.`;
                }

                termOutput.appendChild(responseLine);

                setTimeout(() => {
                    termBody.scrollTop = termBody.scrollHeight;
                }, 10);
            }
        });

        termBody.addEventListener('click', () => {
            termInput.focus();
        });
    }

    // ==========================================
    // 8. Scroll Spy for Navigation
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
    // 9. Scroll Reveal Animations
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

    // ==========================================
    // 10. Animated Counter for Metrics
    // ==========================================
    const counters = document.querySelectorAll('[data-count]');

    if (counters.length > 0 && !prefersReducedMotion) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    animateCounter(entry.target, 0, target, 1200);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(start + (end - start) * eased);
            
            element.textContent = current + '+';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

});
