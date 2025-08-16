import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

// Path to the blogs CSV file
const blogsCSVPath = path.join(process.cwd(), 'data', 'blogs.csv');

// Function to read and parse the CSV file
export function getBlogPosts() {
  // Read the CSV file
  const csvData = fs.readFileSync(blogsCSVPath, 'utf8');
  
  // Parse the CSV data
  const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });
  
  // Transform the data to match our needs
  const posts = records.map((record, index) => {
    // Split tags by | and trim whitespace
    const tags = record.tags ? record.tags.split('|').map(tag => tag.trim()) : [];
    
    // Generate slug from title
    const slug = generateSlug(record.title);
    
    // Process markdown content to HTML and extract front matter
    const { htmlContent, frontMatter, cleanContent } = processMarkdownContent(record.content);
    
    return {
      id: parseInt(record.id) || index + 1,
      title: frontMatter.title || record.title,
      date: record.date,
      image: frontMatter.image || record.image,
      content: cleanContent, // Clean markdown content without frontmatter
      htmlContent: htmlContent, // Processed HTML content
      description: frontMatter.description || '', // Extracted description from frontmatter
      tags: frontMatter.tags || tags,
      readTime: record.readTime,
      updatedAt: record.updatedAt,
      slug: slug,
      url: `/posts/${slug}`,
      metaDescription: frontMatter.metaDescription || frontMatter['meta-description'] || frontMatter.description || '',
      keywords: frontMatter.keywords ? (Array.isArray(frontMatter.keywords) ? frontMatter.keywords : frontMatter.keywords.split(',').map(k => k.trim())) : []
    };
  });
  
  return posts;
}

// Function to get a single blog post by slug
export function getBlogPostBySlug(slug) {
  const posts = getBlogPosts();
  return posts.find(post => post.slug === slug);
}

// Function to generate URL-friendly slugs from titles
export function generateSlug(title) {
  return title.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Function to get paginated blog posts
export function getPaginatedBlogPosts(page = 1, postsPerPage = 3) {
  const posts = getBlogPosts();
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Calculate start and end indices
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  
  // Get posts for current page
  const postsToShow = posts.slice(startIndex, endIndex);
  
  return {
    posts: postsToShow,
    totalPages: totalPages,
    currentPage: page,
    totalPosts: totalPosts
  };
}

// Function to process markdown content to HTML and extract front matter
function processMarkdownContent(markdown) {
  // Parse front matter using gray-matter
  const { data: frontMatter, content } = matter(markdown);
  
  // Configure marked options for better HTML output
  marked.setOptions({
    breaks: true,
    gfm: true,
    smartypants: true
  });
  
  // Process the markdown content to HTML (excluding front matter)
  let html = marked.parse(content);
  
  // Additional processing for kawaii elements
  // Replace markdown image syntax with HTML img tags with proper classes
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');
  
  // Replace markdown links with HTML links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Add special classes for kawaii elements
  html = html.replace(/✨/g, '<span class="sparkle">✨</span>');
  html = html.replace(/🌸/g, '<span class="flower">🌸</span>');
  html = html.replace(/💕/g, '<span class="heart">💕</span>');
  html = html.replace(/😅/g, '<span class="sweat">😅</span>');
  html = html.replace(/🌈/g, '<span class="rainbow">🌈</span>');
  html = html.replace(/🐣/g, '<span class="chick">🐣</span>');
  html = html.replace(/🌟/g, '<span class="star">🌟</span>');
  html = html.replace(/💖/g, '<span class="heart2">💖</span>');
  html = html.replace(/💬/g, '<span class="speech">💬</span>');
  html = html.replace(/🔖/g, '<span class="bookmark">🔖</span>');
  html = html.replace(/🏷️/g, '<span class="tag">🏷️</span>');
  
  return { htmlContent: html, frontMatter: frontMatter, cleanContent: content };
}