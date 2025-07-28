const { getBlogPosts } = require('./lib/blogData');

const posts = getBlogPosts();
console.log('Number of posts:', posts.length);
if (posts.length > 0) {
  const firstPost = posts[0];
  console.log('First post title:', firstPost.title);
  console.log('First post keywords:', firstPost.keywords);
  console.log('Type of keywords:', typeof firstPost.keywords);
  console.log('Is keywords an array:', Array.isArray(firstPost.keywords));
  if (Array.isArray(firstPost.keywords)) {
    console.log('Keywords joined:', firstPost.keywords.join(', '));
  }
}