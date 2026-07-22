const express = require('express');
const app = express();
const path = require('path');
// Importamos la instancia de supabase desde nuestro db.js
const { supabase } = require('./db');

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// --- RUTAS ---

// 1. Inicio
app.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('artistas')
            .select('*')
            .order('nombre', { ascending: true });
        
        if (error) throw error;
        res.render('index', { artistas: data }); 
    } catch (err) {
        console.error('Error al cargar inicio:', err);
        res.render('index', { artistas: [] }); 
    }
});

// 2. Lista de Artistas
app.get('/artistas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('artistas')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;

        // DEBUG: Esto te ayudará a ver en tu consola si la columna imagen_url trae datos
        console.log("Datos de artistas recibidos:", JSON.stringify(data, null, 2));

        res.render('artista', { artistas: data });
    } catch (err) {
        console.error('Error en la consulta de artistas:', err);
        res.status(500).send('Error al obtener los artistas');
    }
});

// 3. Detalle del Artista
app.get('/detalle/:id', async (req, res) => {
    try {
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

        // --- LÓGICA PARA LA ETIQUETA "NUEVO" ---
        if (videos && videos.length > 0) {
            // Calculamos el ID más alto de los registros obtenidos
            const maxId = Math.max(...videos.map(v => v.id));
            const rangoNuevos = 10; // Rango para abarcar tandas masivas de 10 a 20 elementos

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

// Middleware 404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
