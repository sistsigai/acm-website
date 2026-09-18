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
      <style>{`
        /* --- Base Navbar Styles --- */
        .navbar {
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(45deg, #F5F7F6, #5CA0F2);
          background-size: 300% 300%;
          animation: gradientShift 12s ease-in-out infinite;
          height: 80px;
          width: 100%;
          position: fixed;
          top: 0;
          z-index: 1000;
          font-family: "Noto Sans JP", sans-serif;
          padding: 0 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        @keyframes gradientShift {
          0% { background-position: 0 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        /* --- Logo Animation --- */
        .menu-logo-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          z-index: 1001;
        }

        .logo img {
          width: 90px;
          height: 90px;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: float 3s ease-in-out infinite;
        }

        .logo img:hover {
          transform: rotate(5deg) scale(1.1);
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        /* --- Navigation Links --- */
        nav ul {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
          margin-top: -6px;
        }

        nav ul li {
          display: inline-block;
          margin: 0 10px;
          position: relative;
        }

        nav ul li a {
          color: #000000;
          font-size: 16px;
          font-weight: 600;
          padding: 8px 12px;
          text-transform: uppercase;
          text-decoration: none;
          position: relative;
          transition: color 0.3s ease;
        }

        nav ul li a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background-color: #000000;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          transform: translateX(-50%);
        }

        nav ul li a:hover::after {
          width: 80%;
        }

        nav ul li a:hover {
          color: #333;
          text-decoration: none;
        }

        /* --- 'Events' Button Styles --- */
        .button-fest {
          display: inline-flex;
          position: relative;
          height: 50px;
          margin-left: 20px;
          margin-right: 10px;
          align-items: center;
          overflow: hidden;
          background: #000000;
          color: #ffffff;
          border-radius: 30px;
          box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
          font-size: 15px;
          font-weight: 700;
          padding: 0 30px;
          text-decoration: unset;
          transition: all 0.3s ease;
          z-index: 1001;
        }

        .button-fest::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: 0.5s;
        }

        .button-fest:hover::before {
          left: 100%;
        }

        .button-fest:hover {
          box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.3);
          color: #fffafaff;
          text-decoration: none;
        }

        .button-fest:active {
          transform: translateY(-1px) scale(0.98);
        }

        /* --- Hamburger Menu Icon --- */
        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
          z-index: 1002;
          margin-left: 15px;
        }

        .bar {
          width: 25px;
          height: 3px;
          background-color: #000;
          transition: all 0.3s ease;
          border-radius: 5px;
        }

        .hamburger.active .bar:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .hamburger.active .bar:nth-child(2) {
          opacity: 0;
        }
        .hamburger.active .bar:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* --- Mobile Responsive Styles --- */
        @media (max-width: 960px) {
          .hamburger {
            display: flex;
          }

          .logo img {
            width: 70px;
            height: 70px;
          }

          nav ul {
            position: fixed;
            width: 100%;
            height: 100vh;
            background: linear-gradient(45deg, #83EAF1, #63A4FF);
            background-size: 300% 300%;
            animation: gradientShift 12s ease-in-out infinite;
            top: 0;
            left: -100%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: left 0.5s cubic-bezier(0.77, 0, 0.175, 1);
            z-index: 999;
          }

          nav ul.menu.open {
            left: 0;
          }

          nav ul li {
            margin: 20px 0;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
          }

          nav ul.menu.open li {
            opacity: 1;
            transform: translateY(0);
          }
          nav ul.menu.open li:nth-child(1) { transition-delay: 0.1s; }
          nav ul.menu.open li:nth-child(2) { transition-delay: 0.2s; }
          nav ul.menu.open li:nth-child(3) { transition-delay: 0.3s; }
          nav ul.menu.open li:nth-child(4) { transition-delay: 0.4s; }
          nav ul.menu.open li:nth-child(5) { transition-delay: 0.5s; }
          nav ul.menu.open li:nth-child(6) { transition-delay: 0.6s; }
          nav ul.menu.open li:nth-child(7) { transition-delay: 0.7s; }

          nav ul li a {
            font-size: 22px;
            font-weight: 700;
          }
          
          .button-fest {
            font-size: 14px;
            padding: 0 20px;
            height: 40px;
          }
        }
      `}</style>

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