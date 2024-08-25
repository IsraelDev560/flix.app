// src/components/Layout.js
import { Outlet, Link, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  
  // Condicionalmente exibir navegação com base na rota
  const shouldShowNav = location.pathname !== '/Movies';

  return (
    <>
      {shouldShowNav && (
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Movies">Movies</Link>
            </li>
            <li>
              <Link to="/Users">Users</Link>
            </li>
          </ul>
        </nav>
      )}
      <Outlet />
    </>
  );
};

export default Layout;
