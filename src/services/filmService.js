// Simulates API call by filtering the static film list
import allFilms from '../films';

const searchFilms = async (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return allFilms.filter(film =>
        film.title.toLowerCase().includes(lowerQuery) ||
        film.director.toLowerCase().includes(lowerQuery) ||
        film.genre.some(g => g.toLowerCase().includes(lowerQuery))
    );
};

const filmService = { searchFilms };
export default filmService;