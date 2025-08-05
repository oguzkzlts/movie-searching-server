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
    const [scrollY, setScrollY] = useState(0);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState(null);
    const [isScrolling, setIsScrolling] = useState(false);

    const [showStickyFilters, setShowStickyFilters] = useState(false);

    const filtersRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!initialLoadDone || loading || !hasMore) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight - 100) {
                setPage(prev => {
                    if (prev < totalPages) return prev + 1;
                    return prev;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [initialLoadDone, loading, hasMore, totalPages]);


    useEffect(() => {
        let lastY = window.scrollY;
        let timeout;

        const handleScroll = () => {
            const currentY = window.scrollY;

            // Detect scroll direction
            if (currentY > lastY) {
                setScrollDirection('down');
            } else if (currentY < lastY) {
                setScrollDirection('up');
            }
            lastY = currentY;

            // Sticky trigger logic
            if (filtersRef.current) {
                const { bottom } = filtersRef.current.getBoundingClientRect();
                setShowStickyFilters(bottom <= 0);
            }

            // Fade logic
            setIsScrolling(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsScrolling(false), 150);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!initialLoadDone) return;

        // Reset everything and fetch new movies based on updated filters
        accumulatedFilms.current = [];
        setFilms([]);
        setPage(1);
        setHasMore(true);
        loadMovies(searchTerm.trim() ? searchTerm : null, 1);
    }, [selectedGenre, selectedYear, selectedRating, sortBy]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedGenre, selectedYear, selectedRating, sortBy]);

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

            if (pageNum === 1) {
                accumulatedFilms.current = newFilms;
            } else {
                accumulatedFilms.current = [...accumulatedFilms.current, ...newFilms];
            }

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

        useEffect(() => {
        if (!searchTerm.trim()) {
            loadMovies(null, 1).then(() => setInitialLoadDone(true));
        }
    }, []);

    useEffect(() => {
        setSelectedFilm(null);
        setPage(1);
        accumulatedFilms.current = [];
        setHasMore(true);

        if (searchTerm.trim()) {
            loadMovies(searchTerm, 1).then(() => setInitialLoadDone(true));
        } else {
            loadMovies(null, 1);
        }
    }, [searchTerm]);

    useEffect(() => {
        if (page > 1) {
            loadMovies(searchTerm.trim() ? searchTerm : null, page);
        }
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

    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            const suggestions = await filmService.fetchInitialSuggestions();
            setAllFilms(suggestions);
        };
        fetchSuggestions();
    }, []);

    return (
        <div className="app-wrapper d-flex flex-column min-vh-100">
            <main className="app container py-4 flex-grow-1">
                <Header />
                <h1 className="mb-4">Movie Search</h1>

                <Filters
                    className="filters static"
                    ref={filtersRef}
                    static
                    scrollDirection={scrollDirection}
                    isScrolling={false}
                    genres={genres}
                    onGenreChange={(value) => setSelectedGenre(value)}
                    onYearChange={(value) => setSelectedYear(value)}
                    onRatingChange={(value) => setSelectedRating(value)}
                    onSortChange={(value) => setSortBy(value)}
                />



                {/* Sticky Filters that fade/hide/hover based on scroll */}
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
                            scrollDirection={scrollDirection}
                            isScrolling={isScrolling}
                            genres={genres}
                            onGenreChange={(value) => setSelectedGenre(value)}
                            onYearChange={(value) => setSelectedYear(value)}
                            onRatingChange={(value) => setSelectedRating(value)}
                            onSortChange={(value) => setSortBy(value)}
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
                </div>
            </main>
            <Footer visible={isScrolling} />
        </div>
    );
}

export default App;
