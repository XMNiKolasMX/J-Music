const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const translate = require('translate-google');

// Importamos la instancia de supabase desde nuestro db.js
const { supabase } = require('./db');

// Configuración de archivos estáticos y vistas
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(cookieParser());

// ==========================================
// MIDDLEWARE GLOBAL DE TRADUCCIÓN (MULTIDIOMA)
// ==========================================
app.use((req, res, next) => {
    // Detecta el idioma por la URL (?lang=en, ?lang=ja, etc.), por cookie, o usa 'es' por defecto
    const lang = req.query.lang || req.cookies.userLang || 'es';
    
    // Guarda la preferencia del idioma en una cookie por 30 días
    res.cookie('userLang', lang, { maxAge: 30 * 24 * 60 * 60 * 1000 });

    // Carga el archivo JSON correspondiente de la carpeta 'locales'
    const filePath = path.join(__dirname, 'locales', `${lang}.json`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (!err) {
            res.locals.t = JSON.parse(data); // Inyecta las traducciones globalmente en todas las vistas
        } else {
            // Fallback por seguridad si falta el archivo (carga español)
            const fallbackPath = path.join(__dirname, 'locales', 'es.json');
            res.locals.t = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
        }
        res.locals.currentLang = lang; // Para resaltar el idioma activo en el header
        next();
    });
});

// Función auxiliar para traducir textos de Supabase al vuelo si el idioma no es español
async function traducirTexto(texto, targetLang) {
    if (!texto || targetLang === 'es') return texto;
    try {
        const res = await translate(texto, { to: targetLang });
        return res;
    } catch (e) {
        console.error('Error de traducción automática:', e);
        return texto; // Si falla por red/límite, devuelve el original en español
    }
}

// --- RUTAS ---

// 1. Inicio (Con Artistas y los últimos 5 agregados desde Supabase traducidos)
app.get('/', async (req, res) => {
    try {
        const lang = req.cookies.userLang || 'es';

        const { data: artistas, error: errorArtistas } = await supabase
            .from('artistas')
            .select('*')
            .order('nombre', { ascending: true });
        
        if (errorArtistas) throw errorArtistas;

        // Consulta para traer los últimos 5 agregados de la videografía
        const { data: ultimosAgregados, error: errorVideos } = await supabase
            .from('videografia')
            .select('*')
            .order('id', { ascending: false })
            .limit(5);

        if (errorVideos) console.error('Error al cargar últimos agregados:', errorVideos);

        // Traducir títulos de los últimos agregados si es necesario
        const videosTraducidos = await Promise.all((ultimosAgregados || []).map(async (video) => {
            return {
                ...video,
                titulo: await traducirTexto(video.titulo, lang)
            };
        }));

        res.render('index', { 
            artistas: artistas || [], 
            ultimosAgregados: videosTraducidos 
        }); 
    } catch (err) {
        console.error('Error al cargar inicio:', err);
        res.render('index', { artistas: [], ultimosAgregados: [] }); 
    }
});

// 2. Lista de Artistas (Con biografías traducidas automáticamente)
app.get('/artistas', async (req, res) => {
    try {
        const lang = req.cookies.userLang || 'es';
        const { data, error } = await supabase
            .from('artistas')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        // Traducir las biografías al idioma activo
        const artistasTraducidos = await Promise.all((data || []).map(async (artista) => {
            return {
                ...artista,
                biografia: await traducirTexto(artista.biografia, lang)
            };
        }));

        res.render('artista', { artistas: artistasTraducidos });
    } catch (err) {
        console.error('Error en la consulta de artistas:', err);
        res.status(500).send('Error al obtener los artistas');
    }
});

// 3. Detalle del Artista
app.get('/detalle/:id', async (req, res) => {
    try {
        const lang = req.cookies.userLang || 'es';
        const artistaId = req.params.id;

        const { data: artista, error: errorArtista } = await supabase
            .from('artistas')
            .select('*')
            .eq('id', artistaId)
            .single();

        let { data: videos, error: errorVideos } = await supabase
            .from('videografia')
            .select('*')
            .eq('artista_id', artistaId)
            .order('fecha_lanzamiento', { ascending: true });

        if (errorArtista) throw errorArtista;
        if (errorVideos) throw errorVideos;

        // Traducir biografía del artista y títulos de videos
        if (artista) {
            artista.biografia = await traducirTexto(artista.biografia, lang);
        }

        if (videos && videos.length > 0) {
            videos = await Promise.all(videos.map(async (video) => {
                return {
                    ...video,
                    titulo: await traducirTexto(video.titulo, lang)
                };
            }));
        }

        // --- LÓGICA PARA LA ETIQUETA "NUEVO" ---
        if (videos && videos.length > 0) {
            const maxId = Math.max(...videos.map(v => v.id));
            const rangoNuevos = 10; 

            videos = videos.map(video => {
                return {
                    ...video,
                    esNuevo: (maxId - video.id) < rangoNuevos
                };
            });
        }
        // ----------------------------------------

        if (artista) {
            res.render('detalle', { 
                artista: artista, 
                videos: videos || []
            });
        } else {
            res.status(404).send('Artista no encontrado');
        }
    } catch (err) {
        console.error('Error al cargar detalle:', err);
        res.status(500).send('Error interno del servidor: ' + err.message);
    }
});

// 4. Sobre nosotros
app.get('/sobre-nosotros', (req, res) => {
    res.render('sobre-nosotros');
});

// 5. Ruta para Criterios y Guía de Reproducción (CORREGIDO ANTES DEL 404)
app.get('/criterios', (req, res) => {
    res.render('criterios');
});

// Middleware 404 (Siempre debe ir al final de todas las rutas válidas)
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
