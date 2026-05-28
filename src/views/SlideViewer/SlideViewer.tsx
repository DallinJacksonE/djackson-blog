import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './SlideViewer.module.css';

export default function SlideViewer() {
  const { slug } = useParams();
  const [meta, setMeta] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLObjectElement>(null);
  // Fetch the MDX metadata for the title and date
  useEffect(() => {
    if (!slug) return;

    const loadMeta = async () => {
      try {
        const module = await import(`../../content/slides/${slug}.mdx`);
        setMeta(module.meta);
      } catch (error) {
        console.error("Failed to load slide metadata", error);
      }
    };

    loadMeta();
  }, [slug]);

  // Handle Fullscreen Toggle for Presenter Mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Keep state synced if the user presses 'Escape' to exit fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);

      // NEW: Force focus onto the PDF immediately after entering fullscreen
      if (isFull) {
        setTimeout(() => {
          pdfRef.current?.focus();
        }, 50); // 50ms delay allows the browser UI to settle first
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);


  if (!slug) return <div className={styles.loading}>Loading deck...</div>;

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.header}>
        <Link to="/slides" className={styles.backButton}>
          &larr; Back to Slides
        </Link>
        {meta && (
          <div className={styles.metaInfo}>
            <h1 className={styles.title}>{meta.title}</h1>
            <p className={styles.date}>{meta.date}</p>
          </div>
        )}
      </div>

      {/* Interactive PDF Viewer Container */}
      <div
        className={`${styles.viewerWrapper} ${isFullscreen ? styles.fullscreen : ''}`}
        ref={viewerRef}
      >
        {/* We hide the custom toolbar when in true Presenter Mode */}
        {!isFullscreen && (
          <div className={styles.toolbar}>
            <span className={styles.helperText}>Read-Through Mode</span>
            <button onClick={toggleFullscreen} className={styles.fullscreenBtn}>
              Enter Presenter Mode ⛶
            </button>
          </div>
        )}

        {/* Natively embeds the PDF from the public folder. 
            The hash parameters disable the native browser toolbar for a cleaner look. 
        */}
        <object
          data={`/slides/${slug}.pdf#toolbar=0&navpanes=0&view=FitH`}
          type="application/pdf"
          className={styles.pdfObject}
        >
          {/* Fallback for mobile browsers that don't support inline PDFs */}
          <div className={styles.fallback}>
            <p>It appears your browser doesn't support inline PDFs.</p>
            <a href={`/slides/${slug}.pdf`} download className={styles.downloadBtn}>
              Download the Presentation
            </a>
          </div>
        </object>
      </div>
    </div>
  );
}
