import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About Us | blushify - Your Guide to Kawaii & Girly Products</title>
        <meta name="description" content="Learn about blushify - your trusted source for discovering the most adorable kawaii accessories, pastel gifts, and girly tech gadgets." />
        <meta name="keywords" content="about blushify, kawaii blog, cute product reviews, girly accessories" />
      </Head>

      <section className={styles.aboutHero}>
        <div className={styles.container}>
          <h1>About blushify</h1>
          <p>Your trusted source for discovering adorable products</p>
        </div>
      </section>

      <section className={styles.aboutContent}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <h2>Our Story</h2>
              <p>
                blushify was founded in 2025 by two best friends who shared a passion for all things 
                kawaii and aesthetic. What started as a hobby of sharing cute product discoveries with 
                friends quickly grew into a full-fledged blog and community.
              </p>
              
              <h2>Our Mission</h2>
              <p>
                We're on a mission to help girls and women find the most adorable, high-quality products 
                that bring joy to everyday life. Whether you're looking for the perfect pastel planner 
                or the cutest tech accessories, we've got you covered.
              </p>
              
              <h2>Why Trust Us?</h2>
              <p>
                All our recommendations are thoroughly researched and tested. We only feature products 
                we genuinely love and believe in. Our affiliate partnerships allow us to keep the site 
                running while maintaining honest, unbiased reviews.
              </p>
            </div>
            <div className={styles.aboutImage}>
              <img 
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1" 
                alt="blushify team" 
                loading="lazy" 
              />
            </div>
          </div>

          <div className={styles.teamSection}>
            <h2>Meet The Team</h2>
            <div className={styles.teamGrid}>
              <div className={styles.teamMember}>
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
                  alt="Aya" 
                  loading="lazy" 
                />
                <h3>Aya</h3>
                <p className={styles.role}>Founder & Chief Kawaii Officer</p>
                <p>
                  Aya's passion for cute stationery and decor inspired the creation of blushify.
                </p>
              </div>
              <div className={styles.teamMember}>
                <img 
                  src="https://via.placeholder.com/200x200" 
                  alt="Omnia" 
                  loading="lazy" 
                />
                <h3>Omnia</h3>
                <p className={styles.role}>Co-Founder & Product Expert</p>
                <p>
                  Omnia has an eye for finding the most aesthetic tech gadgets and fashion accessories.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.contactSection}>
            <h2>Get In Touch</h2>
            <p>Have questions or suggestions? We'd love to hear from you!</p>
            <div className={styles.contactMethods}>
              <div className={styles.contactMethod}>
                <h3>Email</h3>
                <p>hello@cutefinds.com</p>
              </div>
              <div className={styles.contactMethod}>
                <h3>Social Media</h3>
                <div className={styles.socialLinks}>
                  <a href="#" aria-label="Instagram"><span className={styles.icon}>📸</span></a>
                  <a href="#" aria-label="Pinterest"><span className={styles.icon}>📌</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}