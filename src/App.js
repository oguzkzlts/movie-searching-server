import React, { useState, useEffect } from 'react';
import filmService from './services/filmService';
import Header from './components/header';
import Footer from './components/footer';
import SearchBar from './components/SearchBar';
import RecommendedMovies from './components/RecommendedMovies';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [films, setFilms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFilms = async () => {
      setIsLoading(true);
      try {
        const fetchedFilms = await filmService.searchFilms(searchTerm);
        setFilms(fetchedFilms);
      } catch (error) {
        console.error('Error fetching films:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm.trim()) {
      fetchFilms();
    } else {
      setFilms([]);
    }
  }, [searchTerm]);

  const handleSearch = (query) => {
    setSearchTerm(query);
  };

  return (
      <div className="app">
        <Header />
        <h1>Film Search</h1>
        <SearchBar onSearch={handleSearch} />
        {isLoading ? (
            <div>Loading...</div>
        ) : (
            <RecommendedMovies films={films} />
        )}
        <Footer />
      </div>
  );
}

export default App;
