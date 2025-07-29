import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import RecommendedMovies from './components/RecommendedMovies';

const API_KEY = '891b3c23e8efceb9531c877d720898e8';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BATCH_SIZE = 20;

function App() {
    const [allFilms, setAllFilms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [films, setFilms] = useState([]); //const [films, setFilms] = useState(allFilms);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Keep a ref for accumulated films in searches
    const accumulatedFilms = useRef([]);

    // Fetch TMDb movies for searchTerm and page
    const fetchMovies = async (query, pageNum) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${pageNum}`
            );
            const data = await res.json();

            if (data.results) {
                const mapped = data.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : null,
                    image: movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : null,
                    rating: movie.vote_average,
                    synopsis: movie.overview,
                    genre: [],
                    director: null,
                }));

                if (pageNum === 1) {
                    accumulatedFilms.current = mapped;
                } else {
                    accumulatedFilms.current = [...accumulatedFilms.current, ...mapped];
                }
                setFilms(accumulatedFilms.current);
                setTotalPages(data.total_pages || 1);
                setHasMore(pageNum < data.total_pages);
            } else {
                if (pageNum === 1) {
                    accumulatedFilms.current = [];
                    setFilms([]);
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error('Search failed:', error);
            if (pageNum === 1) {
                accumulatedFilms.current = [];
                setFilms([]);
            }
            setHasMore(false);
        }
        setLoading(false);
    };

    // On mount, load popular movies if no search
    useEffect(() => {
        if (!searchTerm.trim()) {
            fetchPopularMovies(1);
        }
    }, []);

    // Handle searchTerm changes
    useEffect(() => {
        setSelectedFilm(null);
        setPage(1);
        accumulatedFilms.current = [];
        setHasMore(true);

        if (searchTerm.trim()) {
            fetchMovies(searchTerm, 1);
        } else {
            fetchPopularMovies(1);
        }
    }, [searchTerm]);

    const fetchPopularMovies = async (pageNum = 1) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNum}`
            );
            const data = await res.json();

            if (data.results) {
                const mapped = data.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? parseInt(movie.release_date.slice(0, 4)) : null,
                    image: movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : null,
                    rating: movie.vote_average,
                    synopsis: movie.overview,
                    genre: [],
                    director: null,
                }));

                if (pageNum === 1) {
                    accumulatedFilms.current = mapped;
                } else {
                    accumulatedFilms.current = [...accumulatedFilms.current, ...mapped];
                }
                setFilms(accumulatedFilms.current);
                setTotalPages(data.total_pages || 1);
                setHasMore(pageNum < data.total_pages);
            } else {
                if (pageNum === 1) {
                    accumulatedFilms.current = [];
                    setFilms([]);
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error('Popular movies fetch failed:', error);
            if (pageNum === 1) {
                accumulatedFilms.current = [];
                setFilms([]);
            }
            setHasMore(false);
        }
        setLoading(false);
    };

    // Infinite scroll handler
    useEffect(() => {
        const onScroll = () => {
            if (loading || !hasMore) return;
            if (
                window.innerHeight + window.scrollY >=
                document.documentElement.offsetHeight - 300
            ) {
                // Load more pages either for search or popular
                if (page < totalPages) {
                    setPage((prevPage) => prevPage + 1);
                }
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [loading, hasMore, page, totalPages]);

    // Fetch next page when page state increments
    useEffect(() => {
        if (page > 1) {
            if (searchTerm.trim()) {
                fetchMovies(searchTerm, page);
            } else {
                fetchPopularMovies(page);
            }
        }
    }, [page]);


    // Handle selecting a movie to get detailed info including director
    const handleSelect = async (film) => {
        try {
            const resDetails = await fetch(
                `https://api.themoviedb.org/3/movie/${film.id}?api_key=${API_KEY}&language=en-US`
            );
            const details = await resDetails.json();

            const resCredits = await fetch(
                `https://api.themoviedb.org/3/movie/${film.id}/credits?api_key=${API_KEY}`
            );
            const credits = await resCredits.json();
            const director = credits.crew.find((member) => member.job === 'Director');

            const enriched = {
                id: details.id,
                title: details.title,
                year: details.release_date ? parseInt(details.release_date.slice(0, 4)) : null,
                genre: details.genres ? details.genres.map((g) => g.name) : [],
                director: director ? director.name : null,
                synopsis: details.overview,
                rating: details.vote_average,
                runtime: details.runtime ? `${details.runtime} min` : null,
                image: details.poster_path ? IMAGE_BASE_URL + details.poster_path : null,
            };

            setSelectedFilm(enriched);
        } catch (err) {
            console.error('TMDb fetch failed:', err);
            setSelectedFilm(null);
        }
    };

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    useEffect(() => {
        const fetchInitialSuggestions = async () => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
            const data = await res.json();
            if (data.results) {
                const formatted = data.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date?.split('-')[0] || 'N/A',
                }));
                setAllFilms(formatted);
            }
        };
        fetchInitialSuggestions();
    }, []);

    return (
        <div className="app container py-4">
            <Header />
            <h1 className="mb-4">Movie Search</h1>

            <div className="search-container mb-5">
                <SearchBar onSearch={handleSearch} suggestions={allFilms} onSelect={handleSelect} />
            </div>

            {selectedFilm && (
                <div className="mb-5">
                    <h4 className="mb-3">Selected Movie</h4>
                    <RecommendedMovies films={[selectedFilm]} />
                </div>
            )}

            <div className="movies-container">
                <h4 className="mb-3">Recommended Movies</h4>
                <RecommendedMovies films={films} />
                {loading && <p className="text-center mt-3">Loading more movies...</p>}
                {!hasMore && films.length > 0 && (
                    <p className="text-center text-muted mt-3">No more movies to load.</p>
                )}
            </div>

            <Footer />
        </div>
    );

}

export default App;
