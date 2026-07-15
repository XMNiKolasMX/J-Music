/**
 * main.js - Sistema J-Music Archive
 * Integración con YouTube Iframe API
 */

// --- 1. Inicialización de UI y Efectos ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema de Archivo J-Music Cargado.");

    // Barra de progreso
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Efecto de Glitch
    const titles = document.querySelectorAll('h1, h2');
    titles.forEach(t => setInterval(() => { if(Math.random() > 0.85) {
        t.style.textShadow = '3px 0 #ff0000, -3px 0 #000';
        t.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
        setTimeout(() => { t.style.textShadow = '0 0 10px #ff0000'; t.style.transform = 'translateX(0)'; }, 100);
    }}, 3000));

    // Seguimiento de mouse y observadores (Tu lógica original)
    // ...
});

// --- 2. Carga API YouTube ---
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

// Esta función es llamada automáticamente por la API de YouTube
window.onYouTubeIframeAPIReady = function() {
    console.log("YouTube API Ready. Creando reproductor...");
    player = new YT.Player('player', {
        height: '360', 
        width: '640',
        playerVars: { 
            'listType': 'playlist', 
            'list': 'PLj0WVlmQfWtiY_cmCHq-mz7EVzg3dzV11',
            'origin': window.location.origin
        },
        events: {
            'onReady': () => console.log("Reproductor listo para comandos."),
            'onError': (e) => console.error("Error de YouTube (Código):", e.data),
            'onStateChange': (e) => console.log("Estado del reproductor:", e.data)
        }
    });
};

// --- 3. Funciones de Control (Exposición Global) ---
window.togglePlay = function() {
    if (!player || typeof player.getPlayerState !== 'function') {
        console.error("El objeto 'player' no está inicializado.");
        return;
    }

    const state = player.getPlayerState();
    const btn = document.getElementById('main-play-btn');
    
    if (state === 1) { // 1 = Reproduciendo
        player.pauseVideo();
        if(btn) btn.innerText = '▶';
    } else {
        player.playVideo();
        if(btn) btn.innerText = '⏸';
    }
};

window.nextTrack = function() { if (player) player.nextVideo(); };
window.prevTrack = function() { if (player) player.previousVideo(); };
window.setVolume = function(v) { if (player) player.setVolume(v); };

// --- 4. Estilos inyectados ---
const style = document.createElement('style');
style.innerHTML = `
    #progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: #ff0000; z-index: 10000; }
    #player { display: block; opacity: 0; position: absolute; }
`;
document.head.appendChild(style);
