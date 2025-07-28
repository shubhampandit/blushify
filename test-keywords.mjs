import { getBlogPosts } from './lib/blogData.js';

// Test the keywords parsing
const posts = getBlogPosts();
if (posts.length > 0) {
  const firstPost = posts[0];
  console.log('Post title:', firstPost.title);
  console.log('Keywords:', firstPost.keywords);
  console.log('Keywords type:', typeof firstPost.keywords);
  console.log('Is array:', Array.isArray(firstPost.keywords));
  
  // Test if we can join the keywords
  try {
    if (Array.isArray(firstPost.keywords)) {
      const joined = firstPost.keywords.join(', ');
      console.log('Keywords joined successfully:', joined);
    } else {
      console.log('Keywords is not an array, cannot join');
    }
  } catch (error) {
    console.error('Error joining keywords:', error.message);
  }
} else {
  console.log('No posts found');
}