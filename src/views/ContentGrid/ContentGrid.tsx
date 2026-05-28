import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ContentGrid.module.css';

type ContentMeta = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  is_pinned?: number;
};

type ContentItem = {
  slug: string;
  meta: ContentMeta;
};

type Props = {
  type: 'blogs' | 'tutorials' | 'topics' | 'slides';
};

// Eagerly grab ALL MDX files in the content tree. 
// Vite processes this at build-time, not run-time!
const allModules = import.meta.glob('/src/content/**/*.mdx', { eager: true });

export default function ContentGrid({ type }: Props) {
  const [contentList, setContentList] = useState<ContentItem[]>([]);

  useEffect(() => {
    const loadedContent: ContentItem[] = [];

    // Filter the loaded modules down to just the folder we are currently viewing
    for (const path in allModules) {
      if (path.includes(`/src/content/${type}/`)) {
        const module = allModules[path] as { meta: ContentMeta };
        const slug = path.split('/').pop()?.replace('.mdx', '') || '';

        if (module.meta) {
          loadedContent.push({ slug, meta: module.meta });
        }
      }
    }

    // Sort matching your portfolio logic: Pinned items first, then reverse chronological
    loadedContent.sort((a, b) => {
      const pinA = a.meta.is_pinned || 999;
      const pinB = b.meta.is_pinned || 999;

      if (pinA !== pinB) {
        return pinA - pinB;
      }
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
    });

    setContentList(loadedContent);
  }, [type]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}</h1>

      <div className={styles.grid}>
        {contentList.map((item) => (
          <Link to={`/${type}/${item.slug}`} key={item.slug} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.title}>{item.meta.title}</h2>
              <span className={styles.date}>{item.meta.date}</span>
            </div>
            <p className={styles.description}>{item.meta.description}</p>
            <div className={styles.tagContainer}>
              {item.meta.tags?.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
