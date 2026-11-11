/* Spatial interaction stays optional: all content works without it. */
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const scene = document.getElementById('dev-scene');
    const world = document.getElementById('scene-world');
    const motionButton = document.getElementById('motion-toggle');
    let userPaused = false;
    try { userPaused = localStorage.getItem('motion-paused') === 'true'; } catch (_) { /* Optional storage. */ }
    let frame = 0;
    let pointer = null;
    const resetScene = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        pointer = null;
        world.style.removeProperty('--scene-x');
        world.style.removeProperty('--scene-y');
    };
    const applyMotion = () => {
        const paused = userPaused || reducedMotion.matches;
        root.classList.toggle('motion-paused', paused);
        motionButton.setAttribute('aria-pressed', String(paused));
        motionButton.disabled = reducedMotion.matches;
        motionButton.textContent = reducedMotion.matches ? 'Gerakan dikurangi sesuai pengaturan perangkat' : paused ? 'Aktifkan animasi' : 'Jeda animasi';
        if (paused) resetScene();
    };
    motionButton.addEventListener('click', () => {
        userPaused = !userPaused;
        try { localStorage.setItem('motion-paused', String(userPaused)); } catch (_) { /* Optional storage. */ }
        applyMotion();
    });
    reducedMotion.addEventListener('change', applyMotion);
    finePointer.addEventListener('change', resetScene);
    applyMotion();
    scene.addEventListener('pointermove', event => {
        if (!finePointer.matches || root.classList.contains('motion-paused')) return;
        pointer = { x: event.clientX, y: event.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
            const rect = scene.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (pointer.x - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (pointer.y - rect.top) / rect.height));
            world.style.setProperty('--scene-x', `${-6 + (0.5 - y) * 12}deg`);
            world.style.setProperty('--scene-y', `${-12 + (x - 0.5) * 18}deg`);
            frame = 0;
        });
    }, { passive: true });
    scene.addEventListener('pointerleave', resetScene);
    scene.addEventListener('pointercancel', resetScene);
    document.addEventListener('visibilitychange', () => { if (document.hidden) resetScene(); });

    const layers = {
        frontend: { stack: "'React.js'", description: 'React.js · Antarmuka responsif, dari ide menjadi interaksi.' },
        backend: { stack: "'Node.js / CI4'", description: 'Node.js, Laravel & CodeIgniter 4 · Logika aplikasi dan REST API.' },
        database: { stack: "'MongoDB / MySQL'", description: 'MongoDB & MySQL · Data terstruktur untuk aplikasi fullstack.' }
    };
    const layerButtons = [...document.querySelectorAll('.scene-controls button')];
    layerButtons.forEach(button => button.addEventListener('click', () => {
        const layer = button.dataset.layer;
        scene.dataset.layer = layer;
        document.getElementById('scene-stack').textContent = layers[layer].stack;
        document.getElementById('scene-caption').textContent = layers[layer].description;
        layerButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));

    const filterButtons = [...document.querySelectorAll('[data-filter]')];
    const projects = [...document.querySelectorAll('.project-card[data-category]')];
    filterButtons.forEach(button => button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        let count = 0;
        projects.forEach(project => {
            project.hidden = filter !== 'all' && project.dataset.category !== filter;
            if (!project.hidden) {
                count += 1;
                project.classList.add('revealed');
            }
        });
        filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        document.getElementById('project-count').textContent = `${count} proyek`;
    }));
    // A deep link to the featured project should work even after filtering it out.
    document.querySelectorAll('a[href="#project-buatdokumen"]').forEach(link => link.addEventListener('click', () => {
        if (document.getElementById('project-buatdokumen').hidden) filterButtons[0].click();
    }));

    const progress = document.querySelector('.reading-progress');
    let progressFrame = 0;
    const updateProgress = () => {
        const max = root.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
        progressFrame = 0;
    };
    const scheduleProgress = () => { if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress); };
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress);
    new ResizeObserver(scheduleProgress).observe(document.body);
    updateProgress();
});
