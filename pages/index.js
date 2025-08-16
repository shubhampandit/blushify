import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import { getBlogPosts } from '../lib/blogData';

export async function getStaticProps() {
  // Fetch blog posts
  const blogPosts = getBlogPosts();
  
  // Sort posts by date (newest first) and take only the latest 2
  const latestPosts = blogPosts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 2);

  return {
    props: {
      latestPosts,
    },
  };
}

export default function Home({ latestPosts }) {
  return (
    <Layout>
      <Head>
        <title>blushify - Top Kawaii & Girly Products for 2025</title>
        <meta name="description" content="Discover the cutest kawaii accessories, pastel gifts, and girly tech gadgets. Your source for adorable decor ideas and aesthetic must-haves for 2025." />
        <meta name="keywords" content="cute products for girls, kawaii accessories, best pastel gifts, top girly tech gadgets, adorable decor ideas, aesthetic must-haves" />
      </Head>

      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Discover the Cutest Kawaii Products for 2025</h1>
          <p>Your ultimate guide to adorable girly must-haves and aesthetic room essentials</p>
          <div className={styles.ctaButtons}>
            <a href="/blogs" className={`${styles.btn} ${styles.btnPrimary}`}>
              Read Blog
            </a>
          </div>
        </div>
      </section>

      <section className={styles.featuredCategories}>
        <div className={styles.container}>
          <h2>Top Blog Categories</h2>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryCard}>
              <img src="/home/Beauty.webp" alt="Kawaii Beauty Products" loading="lazy" />
              <h3>Beauty</h3>
              <p>Adorable makeup and skincare essentials</p>
              <a href="#" className={`${styles.btn} ${styles.btnSmall}`}>
                View Products
              </a>
            </div>
            <div className={styles.categoryCard}>
              <img
                src="/home/Fashion.webp"
                alt="Cute fashion accessories"
                loading="lazy"
              />
              <h3>Fashion</h3>
              <p>Trendy girly accessories and clothes</p>
              <a href="#" className={`${styles.btn} ${styles.btnSmall}`}>
                View Products
              </a>
            </div>
            <div className={styles.categoryCard}>
              <img src="/home/Decor.webp" alt="Pastel Room Decor" loading="lazy" />
              <h3>Decor</h3>
              <p>Aesthetic room decor ideas</p>
              <a href="#" className={`${styles.btn} ${styles.btnSmall}`}>
                View Products
              </a>
            </div>
            <div className={styles.categoryCard}>
              <img
                src="/home/Tech.webp"
                alt="Girly tech gadgets"
                loading="lazy"
              />
              <h3>Tech</h3>
              <p>Cute pink gadgets and electronics</p>
              <a href="#" className={`${styles.btn} ${styles.btnSmall}`}>
                View Products
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuredPosts}>
        <div className={styles.container}>
          <h2>Latest Blog Posts</h2>
          <div className={`${styles.postGrid} ${latestPosts.length === 1 ? styles.singlePost : ''}`}>
            {latestPosts.map((post) => (
              <article key={post.id} className={styles.postCard}>
                <a href={post.url} className={styles.postCardLink}>
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className={styles.postImage}
                  />
                  <div className={styles.postContent}>
                    <h3>{post.title}</h3>
                    <p className={styles.postMeta}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p>{post.metaDescription || 'Check out this adorable blog post for kawaii inspiration!'}</p>
                    <span className={`${styles.btn} ${styles.btnSmall}`}>
                      Read More
                    </span>
                  </div>
                </a>
              </article>
            ))}
          </div>
          <div className={styles.textCenter}>
            <a href="/blogs" className={`${styles.btn} ${styles.btnPrimary}`}>
              View All Posts
            </a>
          </div>
        </div>
      </section>

      <section className={styles.newsletter}>
        <div className={styles.container}>
          <h2>Get the Cutest Finds Straight to Your Inbox</h2>
          <p>Subscribe for weekly updates on the most adorable products</p>
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Your email address" required />
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
}