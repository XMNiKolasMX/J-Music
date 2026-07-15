document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de Archivo J-Music Cargado. Inicializando protocolos de preservación...");

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

    // 2. Efecto de Glitch
    const titles = document.querySelectorAll('h1, h2');
    const triggerGlitch = (el) => {
        el.style.textShadow = '3px 0 #ff0000, -3px 0 #000';
        el.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
        setTimeout(() => { 
            el.style.textShadow = '0 0 10px #ff0000'; 
            el.style.transform = 'translateX(0)';
        }, 100);
    };
    titles.forEach(t => {
        setInterval(() => { if(Math.random() > 0.85) triggerGlitch(t); }, 3000);
    });

    // 3. Seguimiento de mouse
    const cards = document.querySelectorAll('.artista-card, section');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--y', `${e.clientY - rect.top}px`);
        });
    });

    // 4. Observador de aparición
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0) rotate(0deg)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.artista-card, .epoca-img-container, section').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(50px) rotate(-1deg)';
        el.style.transition = 'all 0.9s cubic-bezier(0.19, 1, 0.22, 1)';
        observer.observe(el);
    });

    // 5. Efecto Terminal
    const terminal = document.createElement('div');
    terminal.id = "terminal-msg";
    terminal.style.cssText = "position:fixed; bottom:10px; left:10px; color: #550000; font-family: monospace; font-size: 9px; pointer-events:none; z-index:9999;";
    document.body.appendChild(terminal);
    let logs = ["SCANNING_DATABASE...", "LOCATING_VHS_FILES...", "SYNCING_SERVERS...", "ACCESS_GRANTED_2026"];
    let i = 0;
    setInterval(() => { terminal.innerText = `> ${logs[i % logs.length]}`; i++; }, 4000);

    // 6. Ruido Visual
    const glitchOverlay = document.createElement('div');
    glitchOverlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:9998; opacity:0; background: rgba(255,0,0,0.05);";
    document.body.appendChild(glitchOverlay);
    setInterval(() => {
        glitchOverlay.style.opacity = 0.1;
        setTimeout(() => glitchOverlay.style.opacity = 0, 50);
    }, 10000);

    // 7. Cursor
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseenter', () => { link.style.letterSpacing = "4px"; link.style.textShadow = "0 0 15px #ff0000"; });
        link.addEventListener('mouseleave', () => { link.style.letterSpacing = "2px"; link.style.textShadow = "none"; });
    });
});

// 8. Carga API YouTube
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '0', 
        width: '0',
        playerVars: { 
            'listType': 'playlist', 
            'list': 'PLj0WVlmQfWtiY_cmCHq-mz7EVzg3dzV11' 
        },
        events: {
            'onError': (e) => console.error("Error en reproductor YouTube:", e.data)
        }
    });
};

// Funciones control
function togglePlay() {
    const btn = document.getElementById('main-play-btn');
    if (!player) { console.error("El reproductor aún no se ha cargado."); return; }
    
    if (player.getPlayerState() === 1) {
        player.pauseVideo();
        btn.innerText = '▶';
    } else {
        player.playVideo();
        btn.innerText = '⏸';
    }
}
function nextTrack() { if (player) player.nextVideo(); }
function prevTrack() { if (player) player.previousVideo(); }
function setVolume(v) { if (player) player.setVolume(v); }

// Estilos inyectados
const style = document.createElement('style');
style.innerHTML = `
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    h1, h2 { animation: pulse 3s infinite; }
    .artista-card { position: relative; overflow: hidden; transition: all 0.4s ease; }
    .container { border-left: 1px solid #1a0000; border-right: 1px solid #1a0000; min-height: 100vh; }
`;
document.head.appendChild(style);
