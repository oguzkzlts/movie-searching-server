import React, { useState, useEffect, useRef } from 'react';
import filmService from './services/filmService'; // Adjust path as needed
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import RecommendedMovies from './components/RecommendedMovies';

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
    const [showFooter, setShowFooter] = useState(false);

    const scrollTimeout = useRef(null);

    const loadMovies = async (query, pageNum) => {
        setLoading(true);
        try {
            const { films: newFilms, totalPages } = query
                ? await filmService.fetchMovies(query, pageNum)
                : await filmService.fetchPopularMovies(pageNum);

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
            if (pageNum === 1) {
                accumulatedFilms.current = [];
                setFilms([]);
            }
            setHasMore(false);
        }
        setLoading(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            // Show footer immediately on scroll
            setShowFooter(true);

            // Clear existing timer
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            // Hide footer after 1 second of no scrolling
            scrollTimeout.current = setTimeout(() => {
                setShowFooter(false);
            }, 15);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

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


    useEffect(() => {
        const handleScroll = () => {
            if (!initialLoadDone || loading || !hasMore) return;

            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= fullHeight - 100) {
                setPage(prev => {
                    if (prev < totalPages) {
                        return prev + 1;
                    }
                    return prev;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [initialLoadDone, loading, hasMore, totalPages]);


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
            <Footer visible={showFooter} />
        </div>
    );
}

export default App;
