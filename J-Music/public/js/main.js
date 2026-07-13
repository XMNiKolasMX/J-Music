document.addEventListener('DOMContentLoaded', () => {
    console.log("¡Bienvenido al archivo de J-Music!");

    // 1. Efecto de aparición suave para el título principal
    const mainTitle = document.querySelector('h1');
    if (mainTitle) {
        mainTitle.style.opacity = 0;
        mainTitle.style.transform = 'translateY(-20px)';
        mainTitle.style.transition = 'all 1.5s ease-out';
        
        setTimeout(() => {
            mainTitle.style.opacity = 1;
            mainTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    // 2. Efecto de "Flicker" (parpadeo) dramático al pasar el mouse por los títulos
    const headers = document.querySelectorAll('h1, h2');
    headers.forEach(h => {
        h.addEventListener('mouseover', () => {
            h.style.textShadow = '0 0 10px #ff0000, 0 0 20px #ff0000';
            setTimeout(() => { h.style.textShadow = 'none'; }, 500);
        });
    });

    // 3. Aparición escalonada para las tarjetas de artistas (Scroll Reveal simple)
    const cards = document.querySelectorAll('.artista-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Aparecen una por una con retraso
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
});