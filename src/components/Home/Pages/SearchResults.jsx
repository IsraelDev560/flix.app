import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { NavbarFilmes } from '../NavbarFilmes';
const apiKey = import.meta.env.VITE_OMDB_API_KEY;
import '../../../styles/Movies.css'

export const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);

                if (response.data && response.data.Search) {
                    const movies = response.data.Search;

                    const detailedMoviesPromises = movies.map(async (movie) => {
                        const detailsResponse = await axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`);
                        return detailsResponse.data;
                    });

                    const detailedMovies = await Promise.all(detailedMoviesPromises);
                    setSearchResults(detailedMovies);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Erro ao buscar filmes:", error);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <>
        <NavbarFilmes/>
            <div className="search-results">
                <h1>Resultados de busca para: "{query}"</h1>
                <div className='MovieSection'>
                    {searchResults.map((movie) => (
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
        </>
    );
};
