import { NavbarFilmes } from '../NavbarFilmes'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import LogoStrangerThings from '../../../assets/logo-strangerthigns.png'
import axios from "axios"
import '../../../styles/Movies.css'
import { Link } from 'react-router-dom';
const apiKey = import.meta.env.VITE_OMDB_API_KEY;

export const Movies = () => {
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [dramaMovies, setDramaMovies] = useState([]);
    const [acaoMovies, setAcaoMovies] = useState([]);
    const [stranger, setStranger] = useState([]);

   
    const fetchMovies = async (query, setter) => {
        try {
            const response = await axios.get(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
            console.log(apiKey)
          
            if (response.data && response.data.Search) {
                const movies = response.data.Search;

               
                const detailedMoviesPromises = movies.map(async (movie) => {
                    const detailsResponse = await axios.get(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
                    return detailsResponse.data;
                });

                const detailedMovies = await Promise.all(detailedMoviesPromises);
                setter(detailedMovies);
            } else {
               
                setter([]);
            }
        } catch (error) {
            console.error(`Erro ao buscar filmes (${query}): `, error);
        }
    };

    useEffect(() => {

        Promise.all([
            fetchMovies('Inception', setTopRatedMovies),
            fetchMovies('Drama', setDramaMovies),
            fetchMovies('Acao', setAcaoMovies),
            fetchMovies('Stranger Things', setStranger)
        ]).catch((error) => {
            console.error('Erro ao buscar filmes:', error);
        });
    }, []);

    
    const handleSearch = (query) => {
        fetchMovies(query, setTopRatedMovies);  
    };

    return (
        <main>
            <NavbarFilmes onSearch={handleSearch} />
            <div className="filmes">
                <img src={LogoStrangerThings} alt="Logo Stranger Things" />
                <div className='Container'>
                    {stranger.slice(0, 1).map((movie) => (
                        <div className='SerieContainer' key={movie.imdbID}>
                            <h3>{movie.Title}</h3>
                            <div className='list'>
                                <span className='gray'>{movie.Year}</span>
                                <span className='space'>|</span>
                                <p className='A16'> A16 </p>
                                <span className='space'>|</span>
                                <span className='gray'>4 Temporadas </span>
                                <span className='space'>|</span>
                                <span className='gray'> {movie.Genre}</span>
                            </div>
                            <p className='description'>
                                Quando um garoto desaparece, a cidade toda participa nas buscas. Mas o que encontram são segredos, forças sobrenaturais e uma menina.
                            </p>
                            <span className='gray'>Elenco: </span>{movie.Actors} <br />
                            <p className='gray'>Criação: <span className='white'>{movie.Writer}</span></p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='moviesPainel'>
                <div className='MoviesContainer'>
                    <h2>Mais Votados</h2>
                    <div className='MovieSection'>
                        {topRatedMovies && topRatedMovies.slice(0, 7).map((movie) => (
                            <div className='MovieCard' key={movie.imdbID}>
                                <Link className='links' to={`/movie/${movie.imdbID}`}>
                                    <img src={movie.Poster} alt={`${movie.Title} Poster`} />
                                    <h3>{movie.Title}</h3>
                                    <p>{movie.Year}</p>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <h2>Dramas</h2>
                    <div className='MovieSection'>
                        {dramaMovies && dramaMovies.slice(0, 7).map((movie) => (
                            <div className='MovieCard' key={movie.imdbID}>
                                <Link className='links' to={`/movie/${movie.imdbID}`}>
                                    <img src={movie.Poster} alt={`${movie.Title} Poster`} />
                                    <h3>{movie.Title}</h3>
                                    <p>{movie.Year}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <h2>Ação</h2>
                    <div className='MovieSection'>
                        {acaoMovies && acaoMovies.slice(0, 7).map((movie) => (
                            <div className='MovieCard' key={movie.imdbID}>
                                <Link className='links' to={`/movie/${movie.imdbID}`}>
                                    <img src={movie.Poster} alt={`${movie.Title} Poster`} />
                                    <h3>{movie.Title}</h3>
                                    <p>{movie.Year}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

export const MovieDetails = () => {
    const { id } = useParams(); 
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
                setMovie(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do filme:", error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (!movie) {
        return <div>Carregando...</div>;
    }

    return (
        <>
            <NavbarFilmes />
            <div className="movie-details">
                <div className="movie-poster">
                    <img src={movie.Poster} alt={`${movie.Title} Poster`} />
                </div>
                <div className="movie-info">
                    <h1>{movie.Title}</h1>
                    <p><strong>Year:</strong> {movie.Year}</p>
                    <p><strong>Genre:</strong> {movie.Genre}</p>
                    <p><strong>Director:</strong> {movie.Director}</p>
                    <p><strong>Actors:</strong> {movie.Actors}</p>
                    <p><strong>Plot:</strong> {movie.Plot}</p>
                    <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
                    <p><strong>Runtime:</strong> {movie.Runtime}</p>
                    <p><strong>Language:</strong> {movie.Language}</p>
                    <p><strong>Country:</strong> {movie.Country}</p>
                </div>
            </div>
        </>
    );
};
