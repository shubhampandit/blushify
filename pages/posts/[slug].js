import Head from 'next/head';
import Layout from '../../components/Layout';
import { getBlogPostBySlug, getBlogPosts } from '../../lib/blogData';
import styles from '../../styles/BlogPost.module.css';

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <Layout>
        <div className={styles.container}>
          <h1>Post Not Found</h1>
          <p>The requested blog post could not be found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} | Cute Finds</title>
        <meta name="description" content={post.metaDescription || post.content.substring(0, 160)} />
        <meta name="keywords" content={post.keywords.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription || post.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
        <meta name="twitter:card" content="summary_large_image" />
        {post.keywords && post.keywords.length > 0 && (
          <meta name="keywords" content={post.keywords.join(', ')} />
        )}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription || post.content.substring(0, 160),
            "author": {
              "@type": "Person",
              "name": "Cute Finds Team"
            },
            "datePublished": post.date,
            "image": post.image
          })}
        </script>
      </Head>

      <article className={styles.blogPost}>
        <div className={styles.container}>
          <header className={styles.postHeader}>
            <h1>{post.title}</h1>
            <div className={styles.postMeta}>
              <span className={styles.postDate}>
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className={styles.postReadTime}>{post.readTime}</span>
            </div>
            <img 
              src={post.image} 
              alt={post.title} 
              className={styles.postFeaturedImage} 
              loading="lazy" 
            />
          </header>

          <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: post.htmlContent }}>
          </div>

          <div className={styles.postShare}>
            <h3>Share this post:</h3>
            <div className={styles.shareButtons}>
              <a href="#" className={`${styles.btn} ${styles.btnSmall}`}>
                Twitter
              </a>
              <a href="#" className={`${styles.btn} ${styles.btnSmall}`}>
                Pinterest
              </a>
              <a href="#" className={`${styles.btn} ${styles.btnSmall}`}>
                Facebook
              </a>
            </div>
          </div>
        </div>
      </article>

      <section className={styles.relatedPosts}>
        <div className={styles.container}>
          <h2>You Might Also Like</h2>
          <div className={styles.postGrid}>
            <article className={styles.postCard}>
              <img 
                src="https://via.placeholder.com/400x250" 
                alt="Best Pink Tech Gadgets" 
                loading="lazy" 
              />
              <div className={styles.postContent}>
                <h3>Best Pink Tech Gadgets for Girls</h3>
                <p className={styles.postMeta}>July 15, 2025</p>
                <a href="/posts/best-pink-tech-gadgets-for-girls" className={`${styles.btn} ${styles.btnSmall}`}>
                  Read More
                </a>
              </div>
            </article>
            <article className={styles.postCard}>
              <img 
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace" 
                alt="Aesthetic room decor" 
                loading="lazy" 
              />
              <div className={styles.postContent}>
                <h3>Aesthetic Room Decor Ideas</h3>
                <p className={styles.postMeta}>July 10, 2025</p>
                <a href="/posts/aesthetic-room-decor-ideas" className={`${styles.btn} ${styles.btnSmall}`}>
                  Read More
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const posts = getBlogPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}