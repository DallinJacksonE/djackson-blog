import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome to the <span className={styles.highlight}>Knowledge Base</span>.
        </h1>
        <h2 className={styles.subtitle}>Thoughts, tutorials, and technical deep dives.</h2>
        <p className={styles.description}>
          This is my dedicated space for blogging, sharing development guides, and storing presentation slide decks.
        </p>

        <div className={styles.buttonGroup}>
          <Link to="/slides" className={styles.primaryButton}>
            Slide Decks
          </Link>
          <Link to="/blogs" className={styles.secondaryButton}>
            Read the Blog
          </Link>
        </div>
      </div>

      <div className={styles.imageWrapper}>
        {/* New 3D Animated Bookshelf */}
        <Link to="/topics">
          <div className={styles.shelfContainer}>
            <div className={styles.book}></div>
            <div className={styles.book}></div>

            {/* The highlighted book that pulls out */}
            <div className={`${styles.book} ${styles.activeBook}`}>
              <span className={styles.spineText}>TOPICS</span>
            </div>

            <div className={styles.book}></div>
            <div className={styles.book}></div>
          </div>
        </Link>
      </div>
    </div>
  );
}
