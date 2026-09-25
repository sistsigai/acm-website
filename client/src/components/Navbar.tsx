import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import sc from '../assets/acm-loader-logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let title = 'SIST ACM SIGAI Student chapter';
    switch (location.pathname) {
      case '/about': title = 'ABOUT US - SIST ACM SIGAI Student chapter'; break;
      case '/membership': title = 'MEMBERSHIP - SIST ACM SIGAI Student chapter'; break;
      case '/archives': title = 'ARCHIVES - SIST ACM SIGAI Student chapter'; break;
      case '/blogs': title = 'BLOGS - SIST ACM SIGAI Student chapter'; break;
      case '/our-roots': title = 'ROOTS - SIST ACM SIGAI Student chapter'; break;
      case '/join-us': title = 'RECRUITMENT - SIST ACM SIGAI Student chapter'; break;
      case '/events': title = 'EVENTS - SIST ACM SIGAI Student chapter'; break;
      default: title = 'SIST ACM SIGAI Student chapter';
    }
    document.title = title;
  }, [location.pathname]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="menu-logo-container">
          <div className="logo">
            <Link to="/">
              <img src={sc} alt="SIST ACM SIGAI logo" />
            </Link>
          </div>
        </div>

        <ul className={menuOpen ? 'menu open' : 'menu'}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
          <li><Link to="/membership" onClick={closeMenu}>Membership</Link></li>
          <li><Link to="/archives" onClick={closeMenu}>Archives</Link></li>
          <li><Link to="/blogs" onClick={closeMenu}>Blogs</Link></li>
          <li><Link to="/our-roots" onClick={closeMenu}>Our Roots</Link></li>
          <li><Link to="/join-us" onClick={closeMenu}>WANNA JOIN US?</Link></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '-8px' }}>
          <Link to="/events" className="button-fest" onClick={closeMenu}>
            <span className="nav-btn-text">EVENTS</span>
          </Link>

          <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;