const fs = require('fs');
const path = require('path');

// Configuration
const CSV_FILE = 'data/blogs.csv';
const TEMPLATE_FILE = 'public/blog-post-name.html';
const OUTPUT_DIR = 'public/posts';
const LAST_RUN_FILE = 'lastRun.json';
const METADATA_FILE = 'public/blogs.json';

// Utility functions
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function loadLastRun() {
  try {
    const data = fs.readFileSync(LAST_RUN_FILE, 'utf8');
    return JSON.parse(data).lastRun;
  } catch (err) {
    return new Date(0).toISOString(); // Default to epoch if file doesn't exist
  }
}

function saveLastRun() {
  const data = {
    lastRun: new Date().toISOString()
  };
  fs.writeFileSync(LAST_RUN_FILE, JSON.stringify(data, null, 2));
}

function loadCSVData() {
  const csv = fs.readFileSync(CSV_FILE, 'utf8');
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const posts = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    if (values.length === headers.length && values.some(value => value !== '')) {
      const post = {};
      for (let j = 0; j < headers.length; j++) {
        // Map CSV headers to JSON properties
        switch (headers[j]) {
          case 'id':
            post.id = parseInt(values[j]);
            break;
          case 'title':
            post.t = values[j];
            break;
          case 'date':
            post.d = values[j];
            break;
          case 'image':
            post.i = values[j];
            break;
          case 'content':
            post.c = values[j];
            break;
          case 'tags':
            post.tg = values[j].split('|').map(tag => tag.trim());
            break;
          case 'readTime':
            post.readTime = values[j];
            break;
          case 'updatedAt':
            post.updatedAt = values[j];
            break;
          default:
            post[headers[j]] = values[j];
        }
      }
      // Add default updatedAt if not provided
      if (!post.updatedAt) {
        post.updatedAt = new Date().toISOString();
      }
      posts.push(post);
    }
  }
  
  return posts;
}

function loadTemplate() {
  return fs.readFileSync(TEMPLATE_FILE, 'utf8');
}

function generateHTML(template, post) {
  // Replace placeholders with actual post data
  let html = template;
  
  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${post.t} | Cute Finds</title>`
  );
  
  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="${post.c.substring(0, 160)}">`
  );
  
  // Replace meta keywords
  html = html.replace(
    /<meta name="keywords" content=".*?">/,
    `<meta name="keywords" content="${post.tg ? post.tg.join(', ') : ''}">`
  );
  
  // Fix CSS path for subdirectory
  html = html.replace(
    /<link rel="stylesheet" href="styles.css">/,
    `<link rel="stylesheet" href="../styles.css">`
  );
  
  // Replace post title (h1)
  html = html.replace(
    /<h1>.*?<\/h1>/,
    `<h1>${post.t}</h1>`
  );
  
  // Replace post date
  html = html.replace(
    /<span class="post-date">.*?<\/span>/,
    `<span class="post-date">${new Date(post.d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>`
  );
  
  // Replace featured image
  html = html.replace(
    /<img src=".*?" alt=".*?" class="post-featured-image" loading="lazy">/,
    `<img src="${post.i}" alt="${post.t}" class="post-featured-image" loading="lazy">`
  );
  
  // Replace content (simplified)
  html = html.replace(
    /<p>Creating an adorable and productive workspace.*?<\/p>/,
    `<p>${post.c}</p>`
  );
  
  // Fix JS path for subdirectory
  html = html.replace(
    /<script src="main.js"><\/script>/,
    `<script src="../main.js"></script>`
  );
  
  return html;
}

function saveFile(filename, content) {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, content);
}

function saveMetadata(posts) {
  const metadata = {
    lastBuild: new Date().toISOString(),
    posts: posts.map(post => ({
      id: post.id,
      title: post.t,
      slug: slugify(post.t),
      url: `posts/${slugify(post.t)}.html`,
      date: post.d,
      generatedAt: new Date().toISOString()
    }))
  };
  
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

// Main build process
async function build() {
  console.log('🚀 Starting build process...');
  
  // Load last run time
  const lastRun = loadLastRun();
  console.log(`⏱️  Last run: ${lastRun}`);
  
  // Load data from CSV
  const posts = loadCSVData();
  console.log(`📚 Loaded ${posts.length} posts from CSV`);
  
  // Load template
  const template = loadTemplate();
  console.log('📄 Loaded template file');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    console.log(`📁 Creating output directory: ${OUTPUT_DIR}`);
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Process each post
  let generatedCount = 0;
  const processedPosts = [];
  
  console.log('🔄 Processing posts...');
  for (const post of posts) {
    // Add updatedAt field if it doesn't exist
    if (!post.updatedAt) {
      post.updatedAt = new Date().toISOString();
      console.log(`⚠️  Added missing updatedAt for post: ${post.t}`);
    }
    
    // Only process posts updated since last run
    const postUpdatedAt = new Date(post.updatedAt);
    const lastRunDate = new Date(lastRun);
    
    if (postUpdatedAt > lastRunDate) {
      const slug = slugify(post.t);
      const filename = `${slug}.html`;
      
      console.log(`🔧 Generating ${filename}...`);
      const html = generateHTML(template, post);
      saveFile(filename, html);
      generatedCount++;
      console.log(`✅ Generated ${filename} successfully`);
    } else {
      console.log(`⏭️  Skipping ${post.t} (not updated since last run)`);
    }
    
    // Add to processed posts list
    processedPosts.push({
      ...post,
      slug: slugify(post.t),
      generatedAt: new Date().toISOString()
    });
  }
  
  // Save metadata to blogs.json
  console.log('💾 Saving metadata to blogs.json...');
  saveMetadata(processedPosts);
  console.log('✅ Metadata saved successfully');
  
  // Save last run time
  console.log('⏱️  Updating last run timestamp...');
  saveLastRun();
  console.log('✅ Last run timestamp updated');
  
  console.log(`🎉 Build complete! Generated ${generatedCount} files.`);
}

// Run the build
build().catch(console.error);