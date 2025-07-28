import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <h3>Cute Finds</h3>
            <p>Helping you discover the most adorable products online since 2025</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/blogs">Blog</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Connect</h4>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Instagram"><span className={styles.icon}>📸</span></a>
              <a href="#" aria-label="Pinterest"><span className={styles.icon}>📌</span></a>
              <a href="#" aria-label="TikTok"><span className={styles.icon}>🎵</span></a>
            </div>
          </div>
        </div>
        <div className={styles.copyright}>
          <p>&copy; 2025 Cute Finds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}