import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <section className="error-page">
        <div className="error-container fade-in">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page not found</h2>
          <p className="error-message">
            The page you&#39;re looking for doesn&#39;t exist or has been moved.
          </p>
          <Link href="/" className="btn btn-primary btn-large">Return Home</Link>
        </div>
      </section>
    </div>
  );
}
