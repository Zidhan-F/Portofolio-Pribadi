document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Theme Management (Light / Dark Mode)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme');
        if (activeTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================
    // 2. Mobile Hamburger Menu
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
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
    
    if (snippets.length > 0 && window.innerWidth > 768) {
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
    
    tabContainers.forEach(container => {
        const tabBtns = container.querySelectorAll('.tab-btn');
        const tabPanels = container.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTabId = btn.getAttribute('data-tab');
                
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                
                tabPanels.forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                
                const targetPanel = container.querySelector(`#${targetTabId}`);
                if (targetPanel) targetPanel.classList.add('active');
            });
        });
    });

    // ==========================================
    // 6. Contact Form Validation
    // ==========================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const successFeedback = document.getElementById('form-success-feedback');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('input-name');
            const emailInput = document.getElementById('input-email');
            const messageInput = document.getElementById('input-message');
            
            let isValid = true;
            
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('invalid');
            });
            successFeedback.style.display = 'none';
            
            if (!nameInput.value.trim()) {
                nameInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
                emailInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            if (!messageInput.value.trim()) {
                messageInput.closest('.form-group').classList.add('invalid');
                isValid = false;
            }
            
            if (isValid) {
                const submitBtn = document.getElementById('btn-submit-form');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Mengirim...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    successFeedback.style.display = 'block';
                    contactForm.reset();
                }, 1200);
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
  "backend": ["Node.js", "Express.js", "CodeIgniter 4", "PHP"],
  "database": ["MongoDB", "MySQL"]
}</pre>`;
                        break;
                    case 'contact':
                        responseLine.innerHTML = `Email: <span class="text-highlight">muzidhan@gmail.com</span><br>Phone: (+62) 812-1878-4571<br>GitHub: <span class="text-highlight">github.com/Zidhan-F</span><br>Location: Jakarta Barat, Indonesia`;
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
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeId}`) {
                    link.classList.add('active');
                }
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

    if (counters.length > 0) {
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
