import Logo from '../../assets/logo.png'
import Lupa from '../../assets/lupa.svg'
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext, useState } from 'react';
import { UserContext } from '.././contexts/UserContext';

export const NavbarFilmes = ({ onSearch }) => {
    const { selectedUser } = useContext(UserContext);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    }

    const handleSearch = () => {
        onSearch(query); 
        navigate(`/search?query=${query}`);
    }

    const toggleMenu = () => {
        setMenuOpen(prevState => !prevState);
    };

    return (
        <nav>
             <div className={`navbar ${menuOpen ? 'active' : ''}`}>
                <Link to="/">
                    <img className='logo' src={Logo} alt="Netflix logo" />
                </Link>
                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li>TV Shows</li>
                    <li>Movies/Series</li>
                    <li>Recently Added</li>
                    <li>My List</li>
                </ul>
                <div className='User'>
                    {selectedUser ? (
                        <div className='selected-user'>
                            <img src={selectedUser.image} alt={selectedUser.name} className='user-image' />
                            <p>{selectedUser.name}</p>
                        </div>
                    ) : (
                        <div className='unselected-user'>
                            <p className='select-one-user'>Select one user</p>
                        </div>
                    )}
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search for a movie..."
                        className='searchSession'
                    />
                    <button className='searchButton' onClick={handleSearch}>
                        <img src={Lupa} alt="" />
                    </button>
                </div>
                <button className="menu-toggle" onClick={toggleMenu}>
                    &#9776;
                </button>
            </div>
        </nav>
    )
}
