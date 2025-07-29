const API_KEY = '891b3c23e8efceb9531c877d720898e8'; // Replace this with your TMDb API key
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const films = [
  { id: 1, title: "The Shawshank Redemption", year: 1994 },
  { id: 2, title: "The Godfather", year: 1972 },
  { id: 3, title: "The Dark Knight", year: 2008 },
  { id: 4, title: "Schindler's List", year: 1993 },
  { id: 5, title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { id: 6, title: "Pulp Fiction", year: 1994 },
  { id: 7, title: "Fight Club", year: 1999 },
  { id: 8, title: "Forrest Gump", year: 1994 },
  { id: 9, title: "Inception", year: 2010 },
  { id: 10, title: "The Matrix", year: 1999 },
  { id: 11, title: "Goodfellas", year: 1990 },
  { id: 12, title: "Se7en", year: 1995 },
  { id: 13, title: "The Silence of the Lambs", year: 1991 },
  { id: 14, title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { id: 15, title: "Inglourious Basterds", year: 2009 },
  { id: 16, title: "The Departed", year: 2006 },
  { id: 17, title: "The Prestige", year: 2006 },
  { id: 18, title: "The Green Mile", year: 1999 },
  { id: 19, title: "City of God", year: 2002 },
  { id: 20, title: "The Usual Suspects", year: 1995 },
  { id: 21, title: "Gladiator", year: 2000 },
  { id: 22, title: "Interstellar", year: 2014 },
  { id: 23, title: "Saving Private Ryan", year: 1998 },
  { id: 24, title: "The Intouchables", year: 2011 }
];

// Fetch the list of genres from TMDb once and map IDs to names
async function getGenresMap() {
  const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  if (!data.genres) return {};
  return data.genres.reduce((map, genre) => {
    map[genre.id] = genre.name;
    return map;
  }, {});
}

// Get director name from movie credits
async function getDirector(movieId) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`);
  const data = await res.json();
  if (!data.crew) return null;
  const director = data.crew.find(member => member.job === 'Director');
  return director ? director.name : null;
}

// Main enrichment function to update films with TMDb data
async function enrichWithTMDb() {
  const genresMap = await getGenresMap();

  for (let film of films) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(film.title)}&year=${film.year}`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];

      film.tmdb_id = movie.id;
      film.image = movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : null;
      film.rating = movie.vote_average;
      film.genre = movie.genre_ids.map(id => genresMap[id]).filter(Boolean);
      film.synopsis = movie.overview;
      film.director = await getDirector(movie.id);
    } else {
      console.warn(`No TMDb data found for "${film.title}"`);
    }
  }

  console.log(JSON.stringify(films, null, 2));
}

enrichWithTMDb();

export default films;
