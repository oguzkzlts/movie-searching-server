import React, { useState, useEffect } from 'react';
//import FilmList from './components/FilmList';
import filmService from './services/filmService';
import Header from './components/Header'; 
import Footer from './components/Footer'; 
import SearchBar from './components/SearchBar'; 
import RecommendedMovies from './components/RecommendedMovies'; 
import films from './films';
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
//const App = () => { const [searchResults, setSearchResults] = useState([]); consthandleSearch = (query) => { // Logic to search films and set searchResults state // You can implement this based on your search requirements }; return ( <> <Header /> <divclassName="container"> <h1>React Film Search</h1> <SearchBar onSearch={handleSearch} />{searchResults.length > 0 ? ( <RecommendedMovies films={searchResults} /> ) : (<RecommendedMovies films={films} /> )} </div> <Footer /> </> ); } export default App;
export default App;
