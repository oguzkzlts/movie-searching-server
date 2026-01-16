import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';

import filmService from './services/filmService';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import RecommendedMovies from './components/RecommendedMovies';
import Filters from './components/Filters';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
    const [allFilms, setAllFilms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [films, setFilms] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const accumulatedFilms = useRef([]);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [genres, setGenres] = useState([]);
    const [scrollDirection, setScrollDirection] = useState('up');
    const [isScrolling, setIsScrolling] = useState(false);
    const [showStickyFilters, setShowStickyFilters] = useState(false);

    const filtersRef = useRef(null);

    // Fetch initial suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            const suggestions = await filmService.fetchInitialSuggestions();
            setAllFilms(suggestions);
        };
        fetchSuggestions();
    }, []);

    // Fetch genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
                );
                const data = await res.json();
                setGenres(data.genres || []);
            } catch (error) {
                console.error('Failed to fetch genres:', error);
            }
        };
        fetchGenres();
    }, []);

    // Load movies
    const loadMovies = async (query, pageNum) => {
        setLoading(true);
        try {
            const filterParams = {
                genre: selectedGenre,
                year: selectedYear,
                rating: selectedRating,
                sortBy,
            };

            const { films: newFilms, totalPages } = await filmService.fetchMovies(query, pageNum, filterParams);

            accumulatedFilms.current = pageNum === 1 ? newFilms : [...accumulatedFilms.current, ...newFilms];

            setFilms(accumulatedFilms.current);
            setTotalPages(totalPages);
            setHasMore(pageNum < totalPages);
        } catch (error) {
            console.error('Fetch failed:', error);
            setFilms([]);
            setHasMore(false);
        }
        setLoading(false);
    };

    const reloadMovies = () => {
        accumulatedFilms.current = [];
        setFilms([]);
        setPage(1);
        setHasMore(true);
        loadMovies(searchTerm.trim() ? searchTerm : null, 1);
    };

    useEffect(() => {
        if (initialLoadDone) reloadMovies();
    }, [selectedGenre, selectedYear, selectedRating, sortBy]);

    // Search debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            accumulatedFilms.current = [];
            setFilms([]);
            setPage(1);
            setHasMore(true);
            loadMovies(searchTerm.trim() ? searchTerm : null, 1);
            setInitialLoadDone(true);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Scroll handling
    useEffect(() => {
        let lastY = window.scrollY;
        let timeout;

        const handleScroll = () => {
            const currentY = window.scrollY;

            if (initialLoadDone && !loading && hasMore) {
                const windowHeight = window.innerHeight;
                const fullHeight = document.documentElement.scrollHeight;
                if (currentY + windowHeight >= fullHeight - 100 && page < totalPages) {
                    setPage(prev => prev + 1);
                }
            }

            setScrollDirection(currentY > lastY ? 'down' : 'up');
            lastY = currentY;

            if (filtersRef.current) {
                const { bottom } = filtersRef.current.getBoundingClientRect();
                setShowStickyFilters(bottom <= 0);
            }

            setIsScrolling(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsScrolling(false), 150);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [initialLoadDone, loading, hasMore, page, totalPages]);

    useEffect(() => {
        if (page > 1) loadMovies(searchTerm.trim() ? searchTerm : null, page);
    }, [page]);

    const handleSelect = async (film) => {
        try {
            const enrichedFilm = await filmService.fetchMovieDetails(film.id);
            setSelectedFilm(enrichedFilm);
        } catch (error) {
            console.error('Failed to fetch details:', error);
            setSelectedFilm(null);
        }
    };

    const handleSearch = (query) => setSearchTerm(query);

    return (
        <div className="app-wrapper d-flex flex-column min-vh-100">
            <Header />
            <main className="app container-fluid py-4 flex-grow-1">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>
                                <h1 className="mb-4">Movie Search</h1>

                                <Filters
                                    className="filters static"
                                    ref={filtersRef}
                                    static
                                    scrollDirection={scrollDirection}
                                    isScrolling={false}
                                    genres={genres}
                                    onGenreChange={setSelectedGenre}
                                    onYearChange={setSelectedYear}
                                    onRatingChange={setSelectedRating}
                                    onSortChange={setSortBy}
                                />

                                {showStickyFilters && (
                                    <div
                                        className={`filters sticky-filters ${
                                            scrollDirection === 'down'
                                                ? 'filters-hidden' // If going down, HIDE (regardless of whether you stop)
                                                : isScrolling
                                                    ? 'filters-visible'     // If going up + moving -> Fully Opaque
                                                    : 'filters-transparent' // If going up + stopped -> Semi-transparent
                                        }`}
                                    >
                                        <Filters
                                            genres={genres}
                                            onGenreChange={setSelectedGenre}
                                            onYearChange={setSelectedYear}
                                            onRatingChange={setSelectedRating}
                                            onSortChange={setSortBy}
                                        />
                                    </div>
                                )}

                                <div className="search-container mb-5">
                                    <SearchBar
                                        onSearch={handleSearch}
                                        suggestions={allFilms}
                                        onFilmSelect={handleSelect}
                                    />
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

                                    {loading && (
                                        <p className="text-center mt-3 text-primary">Loading more movies...</p>
                                    )}

                                    {!hasMore && films.length > 0 && (
                                        <p className="text-center text-muted mt-3">No more movies to load.</p>
                                    )}

                                    {!loading && films.length === 0 && (
                                        <p className="text-center text-muted mt-3">No movies found.</p>
                                    )}
                                </div>
                            </div>
                        }
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
            <Footer visible={isScrolling} />
        </div>
    );
}

export default App;
