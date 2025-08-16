import Head from 'next/head';
import Layout from '../../components/Layout';
import { getBlogPostBySlug, getBlogPosts } from '../../lib/blogData';
import Link from 'next/link';
import styles from '../../styles/BlogPost.module.css';

export default function BlogPost({ post, relatedPosts }) {
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
        <title>{post.title} | blushify</title>
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
              "name": "blushify Team"
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
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className={styles.postCard}>
                <img 
                  src={relatedPost.image} 
                  alt={relatedPost.title} 
                  loading="lazy" 
                />
                <div className={styles.postContent}>
                  <h3>{relatedPost.title}</h3>
                  <p className={styles.postMeta}>
                    {new Date(relatedPost.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <Link href={relatedPost.url} className={`${styles.btn} ${styles.btnSmall}`}>
                    Read More
                  </Link>
                </div>
              </article>
            ))}
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

  // Get all posts and find related posts (same tags)
  const allPosts = getBlogPosts();
  
  // Find posts with similar tags (at least one matching tag)
  let relatedPosts = [];
  if (post.tags && post.tags.length > 0) {
    relatedPosts = allPosts.filter(otherPost => {
      // Skip the current post
      if (otherPost.id === post.id) return false;
      
      // Check if any tags match
      if (otherPost.tags && otherPost.tags.length > 0) {
        return post.tags.some(tag => otherPost.tags.includes(tag));
      }
      return false;
    });
  }

  // If we don't have enough related posts, add some recent posts
  if (relatedPosts.length < 2) {
    const recentPosts = allPosts
      .filter(p => p.id !== post.id) // Exclude current post
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date
      .slice(0, 2 - relatedPosts.length); // Get enough to fill up to 2
    
    relatedPosts = [...relatedPosts, ...recentPosts];
  }

  // Limit to 2 related posts
  relatedPosts = relatedPosts.slice(0, 2);

  return {
    props: {
      post,
      relatedPosts
    },
  };
}