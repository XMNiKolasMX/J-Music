/**
 * main.js - J-MUSIC ARCHIVE SYSTEM
 * Versión final con persistencia de estado
 */

// Protección para evitar doble inicialización
if (!window.initialized) {
    window.initialized = true;

    // --- 1. Lógica de Navegación Dinámica ---
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const url = e.target.getAttribute('href');
                
                try {
                    const response = await fetch(url);
                    const htmlText = await response.text();
                    
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    
                    const newMain = doc.querySelector('main');
                    const currentMain = document.querySelector('main');
                    
                    if (newMain && currentMain) {
                        currentMain.innerHTML = newMain.innerHTML;
                        window.history.pushState({}, '', url);
                    }
                } catch (err) {
                    console.error("Error al cargar la página:", err);
                }
            });
        });
    });

    // --- 2. Carga API YouTube ---
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player;
    window.onYouTubeIframeAPIReady = function() {
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
                    const playBtn = document.getElementById('main-play-btn');
                    if (playBtn) playBtn.style.opacity = "1";
                }
            }
        });
    };

    // --- 3. Funciones Globales ---
    window.togglePlay = function() {
        if (!player) return;
        const state = player.getPlayerState();
        const btn = document.getElementById('main-play-btn');

        if (state === 1) {
            player.pauseVideo();
            if (btn) btn.innerText = '▶';
        } else {
            player.playVideo();
            if (btn) btn.innerText = '⏸';
        }
    };

    window.nextTrack = function() { if (player) player.nextVideo(); };
    window.prevTrack = function() { if (player) player.previousVideo(); };
    window.setVolume = function(v) { if (player) player.setVolume(v); };
}
