import { NavLink } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../hooks/useTheme';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.navbar}>

      <div className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <NavLink to="/" className={styles.brandLink}>
            djackson_blog
          </NavLink>
        </div>

        <div className={styles.navLinks}>
          <NavLink to="/blogs" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Blog
          </NavLink>
          <NavLink to="/tutorials" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Tutorials
          </NavLink>
          <NavLink to="/topics" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Topics
          </NavLink>
          <NavLink to="/slides" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Slides
          </NavLink>

          <button
            onClick={toggleTheme}
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
