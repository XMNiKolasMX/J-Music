/**
 * main.js - J-MUSIC ARCHIVE SYSTEM
 * Versión de diagnóstico total
 */

// --- 1. Lógica de UI ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistema cargado...");
    // [Aquí mantén tus efectos de Glitch, Barra de progreso, Terminal, etc.]
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
                // Habilitamos el botón visualmente
                document.getElementById('main-play-btn').style.opacity = "1";
            },
            'onError': (e) => {
                console.error("ERROR CRÍTICO DE YOUTUBE. Código:", e.data);
                console.error("Si el código es 100 o 150, la lista está bloqueada por Copyright.");
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

    // 1: Reproduciendo, 2: Pausado, -1: No iniciado, 3: Buffering
    if (state === 1) {
        player.pauseVideo();
        btn.innerText = '▶';
    } else {
        console.log("Intentando reproducir...");
        player.playVideo();
        btn.innerText = '⏸';
    }
};

window.nextTrack = function() { if (player) player.nextVideo(); };
window.prevTrack = function() { if (player) player.previousVideo(); };
window.setVolume = function(v) { if (player) player.setVolume(v); };
