import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import FilmList from './components/FilmList';
import filmService from './services/filmService';

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
      }
      setIsLoading(false);
    };

    if (searchTerm.trim() !== '') {
      fetchFilms();
    } else {
      setFilms([]);
    }
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="App">
      <h1>Film Search</h1>
      <SearchBar onSearch={handleSearch} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <FilmList films={films} />
      )}
    </div>
  );
}

export default App;
