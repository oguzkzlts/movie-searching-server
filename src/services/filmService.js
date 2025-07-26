import allFilms from '../films';

const searchFilms = async (query) => {
    if (!query) return allFilms;  // Return the full list if no query

    const lower = query.toLowerCase();

    // Filter films based on title, director, or genre
    const filtered = allFilms.filter(film =>
        film.title.toLowerCase().includes(lower) ||
        film.director.toLowerCase().includes(lower) ||
        film.genre.some(g => g.toLowerCase().includes(lower))
    );

    return filtered;
};

export default { searchFilms };
