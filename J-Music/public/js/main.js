/**
 * main.js - J-MUSIC ARCHIVE SYSTEM
 * Versión de diagnóstico total
 */

// --- 1. Lógica de UI ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema cargado...");
    
    // Observador para la aparición suave de elementos (ej. reproductores)
    const playerWrapper = document.querySelector('.youtube-player-wrapper');
    if (playerWrapper) {
        playerWrapper.style.opacity = 0;
        playerWrapper.style.transition = 'opacity 2s ease';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(playerWrapper);
    }
});

// --- 2. Carga API YouTube ---
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

window.onYouTubeIframeAPIReady = function() {
    console.log("API de YouTube inicializada.");
    player = new YT.Player('player', {
        height: '1',
        width: '1',
        playerVars: { 
            'listType': 'playlist', 
            'list': 'PLj0WVlmQfWtiY_cmCHq-mz7EVzg3dzV11',
            'autoplay': 0,
            'rel': 0
        },
        events: {
            'onReady': (e) => {
                console.log("¡Reproductor listo para recibir comandos!");
                const playBtn = document.getElementById('main-play-btn');
                if(playBtn) playBtn.style.opacity = "1";
            },
            'onError': (e) => {
                console.error("ERROR CRÍTICO DE YOUTUBE. Código:", e.data);
            },
            'onStateChange': (e) => {
                console.log("Estado de la API:", e.data);
            }
        }
    });
};

// --- 3. Funciones Globales ---
window.togglePlay = function() {
    if (!player || typeof player.getPlayerState !== 'function') {
        alert("El reproductor aún no se ha cargado. Espera un segundo.");
        return;
    }

    const state = player.getPlayerState();
    const btn = document.getElementById('main-play-btn');

    if (state === 1) {
        player.pauseVideo();
        if(btn) btn.innerText = '▶';
    } else {
        console.log("Intentando reproducir...");
        player.playVideo();
        if(btn) btn.innerText = '⏸';
    }
};

window.nextTrack = function() { if (player) player.nextVideo(); };
window.prevTrack = function() { if (player) player.previousVideo(); };
window.setVolume = function(v) { if (player) player.setVolume(v); };
