import React from 'react';
import MovieCard from './MovieCard';

const RecommendedMovies = ({ films }) => {
    return (
        <div className="recommended-movies">
            <h2>Recommended Movies</h2>
            <div className="movie-list">
                {films.map(film => (
                    <MovieCard key={film.id} film={film} />
                ))}
            </div>
        </div>
    );
};

export default RecommendedMovies;