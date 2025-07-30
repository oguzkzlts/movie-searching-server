const API_KEY = '891b3c23e8efceb9531c877d720898e8';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

async function fetchMovies(query, pageNum = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${pageNum}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) return { films: [], totalPages: 1 };

    const films = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : null,
        image: movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : null,
        rating: movie.vote_average,
        synopsis: movie.overview,
        genre: [],
        director: null,
    }));

    return { films, totalPages: data.total_pages || 1 };
}

async function fetchPopularMovies(pageNum = 1) {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) return { films: [], totalPages: 1 };

    const films = data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : null,
        image: movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : null,
        rating: movie.vote_average,
        synopsis: movie.overview,
        genre: [],
        director: null,
    }));

    return { films, totalPages: data.total_pages || 1 };
}

async function fetchMovieDetails(movieId) {
    const detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
    const details = await detailsRes.json();

    const creditsRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
    const credits = await creditsRes.json();
    const director = credits.crew?.find(member => member.job === 'Director');

    return {
        id: details.id,
        title: details.title,
        year: details.release_date ? parseInt(details.release_date.slice(0, 4)) : null,
        genre: details.genres ? details.genres.map(g => g.name) : [],
        director: director ? director.name : null,
        synopsis: details.overview,
        rating: details.vote_average,
        runtime: details.runtime ? `${details.runtime} min` : null,
        image: details.poster_path ? IMAGE_BASE_URL + details.poster_path : null,
    };
}

async function fetchInitialSuggestions() {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split('-')[0] || 'N/A',
    }));
}

export default {
    fetchMovies,
    fetchPopularMovies,
    fetchMovieDetails,
    fetchInitialSuggestions,
};
