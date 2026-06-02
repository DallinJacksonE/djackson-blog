import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  // State to track if the mobile menu is open
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <NavLink to="/" className={styles.brandLink} onClick={closeMenu}>
            djackson_blog
          </NavLink>
        </div>

        {/* Hamburger Icon (Hidden on Desktop via CSS) */}
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Append mobileOpen class conditionally based on state */}
        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <NavLink to="/blogs" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Blog
          </NavLink>
          <NavLink to="/tutorials" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Tutorials
          </NavLink>
          <NavLink to="/topics" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Topics
          </NavLink>
          <NavLink to="/slides" onClick={closeMenu} className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Slides
          </NavLink>

          <button
            onClick={() => { toggleTheme(); closeMenu(); }}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
        </div>
      </div>
    </nav>
  );
}
