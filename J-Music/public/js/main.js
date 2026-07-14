document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de Archivo J-Music Cargado.");

    // 1. Barra de progreso de lectura (Gótica)
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // 2. Efecto de Glitch aleatorio en títulos (añade inestabilidad estética)
    const titles = document.querySelectorAll('h1, h2');
    const triggerGlitch = (el) => {
        el.style.textShadow = '3px 0 #ff0000, -3px 0 #000';
        setTimeout(() => { el.style.textShadow = '0 0 10px #ff0000'; }, 100);
    };
    
    titles.forEach(t => {
        setInterval(() => {
            if(Math.random() > 0.8) triggerGlitch(t);
        }, 2000);
    });

    // 3. Seguimiento de mouse sutil para las tarjetas de artista
    const cards = document.querySelectorAll('.artista-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // 4. Aparición dramática con ScrollReveal (Avanzado)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Aparecen con un ligero retraso escalonado
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0) rotate(0deg)';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.artista-card, .epoca-img-container').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(50px) rotate(-2deg)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        observer.observe(el);
    });

    // 5. Efecto de "Carga de Sistema" (Opcional: aparece un mensaje fugaz)
    const body = document.querySelector('body');
    const loadMsg = document.createElement('div');
    loadMsg.innerHTML = "INICIALIZANDO ARCHIVO... VISUAL KEI DETECTADO";
    loadMsg.style.cssText = "position:fixed; bottom:20px; right:20px; color: #ff0000; font-size: 10px; opacity:0.5; pointer-events:none;";
    body.appendChild(loadMsg);
    setTimeout(() => loadMsg.style.opacity = 0, 3000);
});

// Estilos dinámicos inyectados
const style = document.createElement('style');
style.innerHTML = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
    h1, h2 { animation: pulse 2s infinite; }
    .artista-card { position: relative; overflow: hidden; }
    .artista-card::before {
        content: ''; position: absolute; top: var(--y); left: var(--x);
        width: 100px; height: 100px; background: rgba(255, 0, 0, 0.1);
        border-radius: 50%; transform: translate(-50%, -50%);
        pointer-events: none; filter: blur(20px);
    }
`;
document.head.appendChild(style);
