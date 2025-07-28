import Head from 'next/head';
import Layout from '../../components/Layout';
import { getPaginatedBlogPosts, getBlogPosts } from '../../lib/blogData';
import Link from 'next/link';
import styles from '../../styles/Blogs.module.css';

export default function BlogPage({ posts, totalPages, currentPage }) {
  return (
    <Layout>
      <Head>
        <title>Blog - Cute Finds | Kawaii & Girly Product Reviews</title>
        <meta name="description" content="Read our latest blog posts featuring reviews of the cutest kawaii accessories, pastel gifts, and girly tech gadgets." />
        <meta name="keywords" content="kawaii blog, cute product reviews, girly accessories, pastel decor ideas" />
      </Head>

      <section className={styles.blogHeader}>
        <div className={styles.container}>
          <h1>Our Blog</h1>
          <p>Discover the latest cute finds and product reviews</p>
        </div>
      </section>

      <section className={styles.blogContent}>
        <div className={styles.container}>
          <div className={styles.blogLayout}>
            <div className={styles.blogMain}>
              {posts.map((post) => (
                <article key={post.id} className={styles.blogPostPreview}>
                  <img 
                    src={post.image || "https://via.placeholder.com/400x250"} 
                    alt={post.title} 
                    loading="lazy" 
                  />
                  <div className={styles.postPreviewContent}>
                    <h2>{post.title}</h2>
                    <p className={styles.postMeta}>
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} • {post.readTime}
                    </p>
                    <p>{post.content.substring(0, 100)}...</p>
                    <Link href={post.url} className={`${styles.btn} ${styles.btnSmall}`}>
                      Read More
                    </Link>
                  </div>
                </article>
              ))}

              <div className={styles.pagination}>
                {currentPage > 1 && (
                  <Link href={`/blogs/${currentPage - 1}`} className={`${styles.btn} ${styles.btnSecondary}`}>
                    Previous
                  </Link>
                )}
                <span>Page {currentPage} of {totalPages}</span>
                {currentPage < totalPages && (
                  <Link href={`/blogs/${currentPage + 1}`} className={`${styles.btn} ${styles.btnPrimary}`}>
                    Next
                  </Link>
                )}
              </div>
            </div>

            <aside className={styles.blogSidebar}>
              <div className={styles.sidebarWidget}>
                <h3>Categories</h3>
                <ul className={styles.categoryList}>
                  <li><a href="#">Beauty</a></li>
                  <li><a href="#">Fashion</a></li>
                  <li><a href="#">Decor</a></li>
                  <li><a href="#">Tech</a></li>
                  <li><a href="#">Lifestyle</a></li>
                </ul>
              </div>

              <div className={styles.sidebarWidget}>
                <h3>Popular Posts</h3>
                <div className={styles.popularPost}>
                  <img 
                    src="https://images.unsplash.com/photo-1600857062241-98e5dba7f214" 
                    alt="Pastel phone case" 
                    loading="lazy" 
                  />
                  <div>
                    <h4><a href="#">Top 5 Cute Planners</a></h4>
                    <p>June 28, 2025</p>
                  </div>
                </div>
                <div className={styles.popularPost}>
                  <img 
                    src="https://via.placeholder.com/100" 
                    alt="Popular Post" 
                    loading="lazy" 
                  />
                  <div>
                    <h4><a href="#">Pastel Phone Cases</a></h4>
                    <p>June 20, 2025</p>
                  </div>
                </div>
              </div>

              <div className={styles.sidebarWidget}>
                <h3>Newsletter</h3>
                <p>Get the latest cute finds straight to your inbox</p>
                <form className={styles.sidebarNewsletter}>
                  <input type="email" placeholder="Your email" required />
                  <button type="submit" className={`${styles.btn} ${styles.btnSmall}`}>
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const posts = getBlogPosts();
  const postsPerPage = 3;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // Generate paths for all pages
  const paths = [];
  for (let page = 1; page <= totalPages; page++) {
    paths.push({ params: { page: page.toString() } });
  }
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const page = parseInt(params.page);
  const postsPerPage = 3;
  
  const { posts, totalPages, currentPage } = getPaginatedBlogPosts(page, postsPerPage);
  
  return {
    props: {
      posts,
      totalPages,
      currentPage
    }
  };
}