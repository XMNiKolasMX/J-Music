document.addEventListener('DOMContentLoaded', () => {
    // 1. Barra de progreso de lectura
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // 2. Efecto de "Pulso" para títulos (hace que respiren)
    const titles = document.querySelectorAll('h1, h2');
    titles.forEach(t => {
        t.style.animation = 'pulse 3s infinite';
    });

    // 3. Aparición dramática con ScrollReveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.artista-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(card);
    });
});

// Estilo de animación para el pulso (puedes añadirlo a tu CSS o aquí)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(style);
