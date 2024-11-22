import { useEffect, useState } from "react";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const API_KEY = "70449a";
// const query = "Avengers";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearch] = useState("");
  const [isOpen2, setIsOpen2] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setisLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}}`
          );

          if (!res.ok)
            throw new Error("Something went wrong, please check your network.");

          const data = await res.json();

          if (data.Response === "False")
            throw new Error("Movie not found. Try a different title.");

          setMovies(data.Search);
        } catch (err) {
          setError(err.message);
        } finally {
          setisLoading(false);
        }
      }

      if (searchQuery.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    },
    [searchQuery]
  );

  return (
    <>
      <Nav>
        <Search search={searchQuery} onSearch={setSearch} />
        <Results movies={movies} />
      </Nav>
      <Main>
        <MovieBox>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              selectedMovie={selectedMovie}
              onSelectedMovie={setSelectedMovie}
            />
          )}
          {error && <ErrorMsg message={error} />}
        </MovieBox>

        <MovieBox>
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && (
            <>
              {selectedMovie ? (
                <SelectMovie movieID={selectedMovie} />
              ) : (
                <>
                  <Summary watched={watched} />
                  <WatchedList watched={watched} />
                </>
              )}
            </>
          )}
        </MovieBox>
      </Main>
    </>
  );
}

function SelectMovie({ movieID }) {
  const [movie, setMovie] = useState({});

  useEffect(
    function () {
      async function getMovie() {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movieID}`
        );

        const data = await res.json();
        console.log(data);
        // setMovie(data);
      }

      getMovie();
    },
    [movieID]
  );

  // console.log(movie);
  return (
    <div>
      <p>This is a movie component</p>
      <p>This is the ID: ${movie.imdbID}</p>
    </div>
  );
}

function Loader() {
  return (
    <div className="loader">
      <p>Loading Movies....</p>
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <div className="error">
      <span>⛔</span>
      <p>{message}</p>
    </div>
  );
}

function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ search, onSearch }) {
  // const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={search}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

function Results({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MovieBox({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

function MovieList({ movies, selectedMovie, onSelectedMovie }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          onSelectedMovie={onSelectedMovie}
        >
          <span>🗓</span>
          <span>{movie.Year}</span>
        </Movie>
      ))}
    </ul>
  );
}

function Movie({ movie, children, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        {/* <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p> */}
        {children}
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

// function WatchedMovie({ movie }) {
//   return (
//     <li>
//       <img src={movie.Poster} alt={`${movie.Title} poster`} />
//       <h3>{movie.Title}</h3>
//       <div>
//         <p>
//           <span>⭐️</span>
//           <span>{movie.imdbRating}</span>
//         </p>
//         <p>
//           <span>🌟</span>
//           <span>{movie.userRating}</span>
//         </p>
//         <p>
//           <span>⏳</span>
//           <span>{movie.runtime} min</span>
//         </p>
//       </div>
//     </li>
//   );
// }

function WatchedList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Movie key={movie.imdbID} movie={movie}>
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </Movie>
      ))}
    </ul>
  );
}
