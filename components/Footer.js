import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <h3>Cute Finds</h3>
            <p>Your ultimate destination for discovering the most adorable kawaii products and lifestyle inspiration. Join our community of cute enthusiasts!</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blogs">Blog</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Categories</h4>
            <ul>
              <li><Link href="/category/beauty">Beauty</Link></li>
              <li><Link href="/category/fashion">Fashion</Link></li>
              <li><Link href="/category/decor">Decor</Link></li>
              <li><Link href="/category/tech">Tech</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Follow Us</h4>
            <p>Stay connected for daily kawaii inspiration!</p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <span className={styles.icon}>📷</span>
              </a>
              <a href="#" aria-label="Pinterest" target="_blank" rel="noopener noreferrer">
                <span className={styles.icon}>📌</span>
              </a>
              <a href="#" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <span className={styles.icon}>🎵</span>
              </a>
              <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <span className={styles.icon}>📺</span>
              </a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>&copy; 2025 Cute Finds. Made with 💕 for kawaii lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
}