import { useState, useEffect, Suspense } from 'react';
import styles from './Article.module.css';
import { useParams, Link } from 'react-router-dom'; // Added Link import

export default function Article() {
  const { type, slug } = useParams();
  const [ContentComponent, setContentComponent] = useState<React.ElementType | null>(null);
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    if (!type || !slug) return;

    const loadContent = async () => {
      try {
        // Vite interprets this dynamic path and bundles the target files automatically
        const module = await import(`../../content/${type}/${slug}.mdx`);

        // MDX default export is the actual React component containing your text
        setContentComponent(() => module.default);
        setMeta(module.meta);
      } catch (error) {
        console.error("Failed to load article:", error);
        setContentComponent(() => () => <h2 style={{ color: 'var(--color-text-primary)' }}>404 - Article Not Found</h2>);
      }
    };

    loadContent();
  }, [type, slug]);

  if (!ContentComponent) {
    return <div className={styles.loading}>Loading content...</div>;
  }

  return (
    <article className={styles.container}>
      <Link to={`/${type}`} className={styles.backButton}>
        &larr; Back to {type}
      </Link>
      {meta && (
        <div className={styles.header}>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.date}>{meta.date}</p>
        </div>
      )}

      {/* We wrap the dynamically loaded component in Suspense to prevent UI freezing */}
      <div className={styles.content}>
        <Suspense fallback={<div className={styles.loading}>Rendering...</div>}>
          <ContentComponent />
        </Suspense>
      </div>
    </article>
  );
}
