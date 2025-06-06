import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { generateToken, verifyToken } from './auth.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import {
    getUsers, addUser, deleteUser, updateUser, getUserByUsername, getUserByEmail,
    addOpinion, deleteOpinion, updateOpinion, getopinionByUsername,
    getProfiles, addProfile, deleteProfile, updateProfile, getProfileByUsername, getProfileByProfile,
    getComments, addComment, deleteComment, updateComment,
    getopinions, getopinionsByMovie, getopinionsbyseries, getopinionsByRate
} from './mongodb.js';
import dotenv from 'dotenv';
dotenv.config();

const api_key = process.env.TMDB_API_KEY;

const app = express();
app.use(cors());
app.use(express.json());
//Peliculas y Series
app.get('/api/movies/popular/:count', async (req, res) => {
    const count = parseInt(req.params.count, 10) || 10;
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=es-ES&page=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results.slice(0, count));
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo películas' });
    }
});
app.get('/api/movies/search', async (req, res) => {
    const { name, year, genre, country } = req.query;

    let url;
    
    if (name) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=es-ES&query=${encodeURIComponent(name)}`;
        if (year) url += `&year=${year}`;
        if (country) url += `&region=${country}`;
    } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=es-ES&sort_by=popularity.desc`;

        if (year) url += `&primary_release_year=${year}`;
        if (country) url += `&with_origin_country=${country}`;
        if (genre) url += `&with_genres=${genre}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        let results = data.results;

        if (genre && name) {
            const genreId = Number(genre);
            results = results.filter(movie => movie.genre_ids.includes(genreId));
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error buscando películas' });
    }
});
app.get('/api/movies/genres', async (req, res) => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=es-ES`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.genres);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo géneros de películas' });
    }
});
app.get('/api/series/genres', async (req, res) => {
    const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${api_key}&language=es-ES`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.genres);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo géneros de series' });
    }
});
app.get('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=es-ES`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error buscando película por ID' });
    }
});
app.get('/api/movies/:id/videos', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}&language=es-ES`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo videos de la película' });
    }
});
app.get('/api/movies/:id/providers', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${api_key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo proveedores de la película' });
    }
});
app.get('/api/series/:id', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}&language=es-ES`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error buscando serie por ID' });
    }
});
app.get('/api/series/popular/:count', async (req, res) => {
    const count = parseInt(req.params.count, 10) || 10;
    const url = `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&language=es-ES&page=2`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results.slice(0, count));
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo series' });
    }
});
app.get('/api/seriess/search', async (req, res) => {
    const { name, year, genre, country } = req.query;

    let url;

    if (name) {
        url = `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&language=es-ES&query=${encodeURIComponent(name)}`;
        if (year) url += `&first_air_date_year=${year}`;
        if (country) url += `&region=${country}`;
    } else {
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&language=es-ES&sort_by=popularity.desc`;
        if (year) url += `&first_air_date_year=${year}`;
        if (country) url += `&with_origin_country=${country}`;
        if (genre) url += `&with_genres=${genre}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        let results = data.results;

        if (genre && name) {
            const genreId = Number(genre);
            results = results.filter(serie => serie.genre_ids.includes(genreId));
        }
        console.log('API URL:', url);
        console.log('Response status:', response.status);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error buscando series' });
    }
});

app.get('/api/series/:id/videos', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${api_key}&language=es-ES`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo videos de la serie' });
    }
});
app.get('/api/series/:id/providers', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${api_key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        res.status(500).json({ error: 'Error obteniendo proveedores de la serie' });
    }
});

//propia
// Usuarios
app.get('/api/users', verifyToken, async (req, res) => res.json(await getUsers()));
app.post('/api/user', verifyToken, async (req, res) => res.json(await addUser(req.body)));
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await getUserByUsername(username);
    if (existingUser.found) return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });

    const existingEmail = await getUserByEmail(email);
    if (existingEmail.found) return res.status(400).json({ error: 'El correo electrónico ya está en uso' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };
    const result = await addUser(newUser);
    res.status(201).json(result);
});
app.post('/api/login', async (req, res) => {
    const { username, email, password } = req.body;
    let result;
    if (username) {
        result = await getUserByUsername(username);
    } else if (email) {
        result = await getUserByEmail(email);
    } else {
        return res.status(400).json({ error: 'Debe proporcionar nombre de usuario o correo electrónico' });
    }
    if (!result.found) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const user = result.user;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const token = generateToken({ username: user.username, email: user.email });
    const { password: _, ...userData } = user;
    res.json({ token, user: userData });
});
app.get('/api/user/:username', verifyToken, async (req, res) => res.json(await getUserByUsername(req.params.username)));
app.get('/api/user/email/:email', verifyToken, async (req, res) => res.json(await getUserByEmail(req.params.email)));
app.delete('/api/user/:username', verifyToken, async (req, res) => res.json(await deleteUser(req.params.username)));
app.put('/api/user/:username', verifyToken, async (req, res) => res.json(await updateUser(req.params.username, req.body)));

// Opiniones
app.get('/api/opinions', verifyToken, async (req, res) => res.json(await getopinions()));
app.post('/api/opinion', verifyToken, async (req, res) => res.json(await addOpinion(req.body)));
app.get('/api/opinion/:username', verifyToken, async (req, res) => res.json(await getopinionByUsername(req.params.username)));
app.delete('/api/opinion/:username', verifyToken, async (req, res) => res.json(await deleteOpinion(req.params.username)));
app.put('/api/opinion/:username', verifyToken, async (req, res) => res.json(await updateOpinion(req.params.username, req.body)));
app.get('/api/opinions/movie/:movie', verifyToken, async (req, res) => res.json(await getopinionsByMovie(req.params.movie)));
app.get('/api/opinions/series/:series', verifyToken, async (req, res) => res.json(await getopinionsbyseries(req.params.series)));
app.get('/api/opinions/rate/:rate', verifyToken, async (req, res) => res.json(await getopinionsByRate(Number(req.params.rate))));

// Perfiles
app.get('/api/profiles', verifyToken, async (req, res) => res.json(await getProfiles()));
app.post('/api/profile', verifyToken, async (req, res) => res.json(await addProfile(req.body)));
app.get('/api/profile/:username', verifyToken, async (req, res) => res.json(await getProfileByUsername(req.params.username)));
app.delete('/api/profile/:username', verifyToken, async (req, res) => res.json(await deleteProfile(req.params.username)));
app.put('/api/profile/:username', verifyToken, async (req, res) => res.json(await updateProfile(req.params.username, req.body)));

// Comentarios
app.get('/api/comments', verifyToken, async (req, res) => res.json(await getComments()));
app.post('/api/comment', verifyToken, async (req, res) => res.json(await addComment(req.body)));
app.put('/api/commentt/:id', async (req, res) => {
  try {
    const commentId = req.params.id;
    const updatedData = req.body;

    const result = await updateComment(commentId, updatedData);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Comentario no encontrado o sin cambios.' });
    }

    res.json({ message: 'Comentario actualizado correctamente.' });
  } catch (err) {           
    console.error('Error al actualizar comentario:', err);
    res.status(500).json({ message: 'Error interno al actualizar el comentario.' });
  }
});
app.get('/api/comment/:username', verifyToken, async (req, res) => res.json(await getCommentByUsername(req.params.username)));


app.delete('/api/comments/:id', verifyToken, async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID de comentario no válido' });
        }

        const result = await deleteComment(req.params.id);
        console.log('Resultado de deleteComment:', result);

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Comentario no encontrado' });
        }

        res.status(200).json({ message: 'Comentario eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar comentario:', err);
        res.status(500).json({ error: 'Error interno al eliminar el comentario' });
    }
});

app.put('/api/comment/:id', verifyToken, async (req, res) => res.json(await updateComment(req.params.id, req.body)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));