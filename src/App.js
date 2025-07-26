import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import RecommendedMovies from './components/RecommendedMovies';
import filmService from './services/filmService';
import allFilms from './films';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [films, setFilms] = useState(allFilms);

    useEffect(() => {
        // If searchTerm is empty or only spaces, show all films
        if (searchTerm.trim()) {
            filmService.searchFilms(searchTerm).then((hits) => {
                if (Array.isArray(hits)) {
                    setFilms(hits);
                } else {
                    // fallback to empty array if unexpected result
                    setFilms([]);
                }
            }).catch((error) => {
                // Optional: handle errors from searchFilms promise
                console.error("Search failed:", error);
                setFilms([]);
            });
        } else {
            setFilms(allFilms);
        }
    }, [searchTerm]);

    // Called when SearchBar triggers a new search
    const handleSearch = (query) => {
        setSearchTerm(query);
    };

    return (
        <div className="app container py-4">
            <Header/>
            <h1 className="mb-4">Movie Search</h1>

            <div className="search-container mb-5">
                <SearchBar onSearch={handleSearch} suggestions={allFilms}/>
            </div>

            <div className="movies-container">
                <RecommendedMovies films={films}/>
            </div>

            <Footer/>
        </div>

    );
}

export default App;
