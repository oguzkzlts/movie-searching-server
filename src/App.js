import React, { useState, useEffect, useRef } from 'react';
import filmService from './services/filmService'; // Adjust path as needed
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import RecommendedMovies from './components/RecommendedMovies';
import Filters from "./components/Filters";

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
    const [scrollDirection, setScrollDirection] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [showStickyFilters, setShowStickyFilters] = useState(false);

    const filtersRef = useRef(null);

    // Fetch initial movie suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            const suggestions = await filmService.fetchInitialSuggestions();
            setAllFilms(suggestions);
        };
        fetchSuggestions();
    }, []);

    // Fetch genres once
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
                const data = await res.json();
                setGenres(data.genres || []);
            } catch (error) {
                console.error('Failed to fetch genres:', error);
            }
        };
        fetchGenres();
    }, []);

    // Load movies function
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

    // Reload movies on filter changes
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

    // Scroll handling (infinite scroll + sticky filters + fade)
    useEffect(() => {
        let lastY = window.scrollY;
        let timeout;

        const handleScroll = () => {
            const currentY = window.scrollY;

            // Infinite scroll
            if (initialLoadDone && !loading && hasMore) {
                const windowHeight = window.innerHeight;
                const fullHeight = document.documentElement.scrollHeight;
                if (currentY + windowHeight >= fullHeight - 100 && page < totalPages) {
                    setPage(prev => prev + 1);
                }
            }

            // Detect scroll direction
            setScrollDirection(currentY > lastY ? 'down' : 'up');
            lastY = currentY;

            // Sticky filters
            if (filtersRef.current) {
                const { bottom } = filtersRef.current.getBoundingClientRect();
                setShowStickyFilters(bottom <= 0);
            }

            // Fade effect
            setIsScrolling(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsScrolling(false), 150);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [initialLoadDone, loading, hasMore, page, totalPages]);

    // Load more on page change
    useEffect(() => {
        if (page > 1) loadMovies(searchTerm.trim() ? searchTerm : null, page);
    }, [page]);

    // Select a movie
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
            <main className="app container-fluid py-4 flex-grow-1">
                <Header/>
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

                {/* Sticky Filters */}
                {showStickyFilters && (
                    <div
                        className={`filters sticky-filters ${
                            scrollDirection === 'down' && isScrolling
                                ? 'filters-hidden'
                                : !isScrolling
                                    ? 'filters-transparent'
                                    : 'filters-visible'
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
                        onSelect={handleSelect}
                    />
                </div>

                {selectedFilm && (
                    <div className="mb-5">
                        <h4 className="mb-3">Selected Movie</h4>
                        <RecommendedMovies films={[selectedFilm]}/>
                    </div>
                )}

                <div className="movies-container">
                    <h4 className="mb-3">Recommended Movies</h4>
                    <RecommendedMovies films={films}/>

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
            </main>
            <Footer visible={isScrolling}/>
        </div>
    );
}

export default App;
