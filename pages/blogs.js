import Head from 'next/head';
import Layout from '../components/Layout';
import { getPaginatedBlogPosts, getBlogPosts } from '../lib/blogData';
import Link from 'next/link';
import styles from '../styles/Blogs.module.css';

export default function Blogs({ posts, totalPages, currentPage, popularPosts, categories }) {
  return (
    <Layout>
      <Head>
        <title>Blog - Cute Finds | Kawaii & Girly Product Reviews</title>
        <meta name="description" content="Read our latest blog posts featuring reviews of the cutest kawaii accessories, pastel gifts, and girly tech gadgets." />
        <meta name="keywords" content="kawaii blog, cute product reviews, girly accessories, pastel decor ideas" />
        <link rel="canonical" href="https://cutefindsblog.com/blogs" />
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
                  <Link href={post.url}>
                    <img
                      src={post.image || "https://via.placeholder.com/400x250"}
                      alt={post.title}
                      loading="lazy"
                      width="400"
                      height="250"
                    />
                  </Link>
                  <div className={styles.postPreviewContent}>
                    <h2>
                      <Link href={post.url}>{post.title}</Link>
                    </h2>
                    <p className={styles.postMeta}>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      {post.readTime && <> • {post.readTime}</>}
                    </p>
                    <p>{post.content.substring(0, 150)}...</p>
                    <Link href={post.url} className={`${styles.btn} ${styles.btnSmall}`}>
                      Read More
                    </Link>
                  </div>
                </article>
              ))}

              <nav className={styles.pagination} aria-label="Blog pagination">
                {currentPage > 1 && (
                  <Link
                    href={currentPage === 2 ? '/blogs' : `/blogs/${currentPage - 1}`}
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    aria-label="Go to previous page"
                  >
                    Previous
                  </Link>
                )}
                <span aria-current="page">Page {currentPage} of {totalPages}</span>
                {currentPage < totalPages && (
                  <Link
                    href={`/blogs/${currentPage + 1}`}
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    aria-label="Go to next page"
                  >
                    Next
                  </Link>
                )}
              </nav>
            </div>

            <aside className={styles.blogSidebar}>
              {/* Search Widget */}
              <div className={styles.sidebarWidget}>
                <div className={styles.widgetHeader}>
                  <span className={styles.widgetIcon}>🔍</span>
                  <h3>Search Posts</h3>
                </div>
                <form className={styles.searchForm}>
                  <input
                    type="search"
                    placeholder="Search for cute finds..."
                    className={styles.searchInput}
                  />
                  <button type="submit" className={styles.searchBtn}>
                    Search
                  </button>
                </form>
              </div>

              {/* Categories Widget */}
              <div className={styles.sidebarWidget}>
                <div className={styles.widgetHeader}>
                  <span className={styles.widgetIcon}>📂</span>
                  <h3>Categories</h3>
                </div>
                <div className={styles.categoryGrid}>
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={`/category/${category.slug}`}
                      className={styles.categoryCard}
                    >
                      <span className={styles.categoryName}>{category.name}</span>
                      <span className={styles.categoryCount}>{category.count}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Posts Widget */}
              <div className={styles.sidebarWidget}>
                <div className={styles.widgetHeader}>
                  <span className={styles.widgetIcon}>⭐</span>
                  <h3>Trending Posts</h3>
                </div>
                <div className={styles.popularPostsList}>
                  {popularPosts.map((post, index) => (
                    <article key={post.id} className={styles.popularPost}>
                      <div className={styles.postRank}>#{index + 1}</div>
                      <Link href={post.url} className={styles.postImageLink}>
                        <img
                          src={post.image || "https://via.placeholder.com/100x80"}
                          alt={post.title}
                          loading="lazy"
                          width="100"
                          height="80"
                          className={styles.postImage}
                        />
                      </Link>
                      <div className={styles.postInfo}>
                        <h4 className={styles.postTitle}>
                          <Link href={post.url}>{post.title}</Link>
                        </h4>
                        <div className={styles.postMeta}>
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                          {post.readTime && <span> • {post.readTime}</span>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Newsletter Widget */}
              <div className={`${styles.sidebarWidget} ${styles.newsletterWidget}`}>
                <div className={styles.widgetHeader}>
                  <span className={styles.widgetIcon}>💌</span>
                  <h3>Stay Updated</h3>
                </div>
                <p className={styles.newsletterDescription}>
                  Join our kawaii community and never miss the cutest finds! ✨
                </p>
                <form className={styles.newsletterForm} action="#" method="post">
                  <div className={styles.inputGroup}>
                    <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                    <input
                      type="email"
                      id="newsletter-email"
                      name="email"
                      placeholder="your@email.com"
                      required
                      className={styles.newsletterInput}
                    />
                    <button type="submit" className={styles.newsletterBtn}>
                      Subscribe 💕
                    </button>
                  </div>
                  <p className={styles.newsletterNote}>
                    No spam, just cute finds! Unsubscribe anytime.
                  </p>
                </form>
              </div>

              {/* Social Links Widget */}
              <div className={styles.sidebarWidget}>
                <div className={styles.widgetHeader}>
                  <span className={styles.widgetIcon}>🌸</span>
                  <h3>Follow Us</h3>
                </div>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.socialLink} aria-label="Instagram">
                    <span className={styles.socialIcon}>📷</span>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className={styles.socialLink} aria-label="Pinterest">
                    <span className={styles.socialIcon}>📌</span>
                    <span>Pinterest</span>
                  </a>
                  <a href="#" className={styles.socialLink} aria-label="TikTok">
                    <span className={styles.socialIcon}>🎵</span>
                    <span>TikTok</span>
                  </a>
                  <a href="#" className={styles.socialLink} aria-label="YouTube">
                    <span className={styles.socialIcon}>📺</span>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>

              {/* Quick Stats Widget */}
              <div className={styles.sidebarWidget}>
                <div className={styles.widgetHeader}>
                  <span className={styles.widgetIcon}>📊</span>
                  <h3>Blog Stats</h3>
                </div>
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{posts.length * 10}</span>
                    <span className={styles.statLabel}>Total Posts</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>{categories.length}</span>
                    <span className={styles.statLabel}>Categories</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>1.2K</span>
                    <span className={styles.statLabel}>Happy Readers</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>500+</span>
                    <span className={styles.statLabel}>Cute Finds</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  // Get first page of posts (this makes /blogs equivalent to /blogs/1)
  const { posts, totalPages, currentPage } = getPaginatedBlogPosts(1, 3);
  
  // Get all posts for generating categories and popular posts
  const allPosts = getBlogPosts();
  
  // Generate categories from tags
  const categoryMap = new Map();
  allPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        const slug = tag.toLowerCase().replace(/\s+/g, '-');
        if (categoryMap.has(tag)) {
          categoryMap.set(tag, { ...categoryMap.get(tag), count: categoryMap.get(tag).count + 1 });
        } else {
          categoryMap.set(tag, { name: tag, slug, count: 1 });
        }
      });
    }
  });
  
  const categories = Array.from(categoryMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 categories
  
  // Get popular posts (most recent 3 posts as a simple implementation)
  const popularPosts = allPosts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  return {
    props: {
      posts,
      totalPages,
      currentPage,
      popularPosts,
      categories
    }
  };
}