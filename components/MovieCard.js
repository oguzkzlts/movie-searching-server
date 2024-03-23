import React from 'react'; 
const MovieCard = ({ film }) => { 
  return ( 
  <divclassName="movie-card"> 
    <img src={film.image} alt={film.title} /> 
    <h3>{film.title}</h3><p>{film.director}, {film.year}</p> 
    <p>{film.genre.join(', ')}</p> <p>Rating: {film.rating}</p> 
    <p>{film.synopsis}</p> 
  </div> ); } 
export default MovieCard;
