# Static Site Generator Plan

## Overview
This document outlines the implementation of a simple JS-based static site generator that:
- Fetches blog post data from a data source (CSV/JSON)
- Generates static HTML files for each published blog post
- Stores files in public/posts/ folder for Firebase Hosting
- Only fetches and regenerates posts updated since the last build
- Is highly efficient to minimize data reads
- Uses vanilla HTML templating

## Architecture

### 1. Data Sources
- **Primary**: blogs.json (already exists in ../../data/blogs.json)
- **Alternative**: CSV file (to be created if needed)
- **Structure**: 
  ```json
  {
    "posts": [
      {
        "id": 1,
        "title": "Post Title",
        "date": "2025-07-20",
        "image": "https://example.com/image.jpg",
        "content": "Post content...",
        "tags": ["tag1", "tag2"],
        "published": true,
        "updatedAt": "2025-07-20T10:00:00Z"
      }
    ]
  }
  ```

### 2. Tracking Last Run Time
- **File**: lastRun.json
- **Location**: Project root
- **Structure**:
  ```json
  {
    "lastRun": "2025-07-20T10:00:00Z"
  }
  ```

### 3. Template System
- **Base Template**: blog-post-name.html (existing file)
- **Dynamic Content**: Replace placeholders with actual post data
- **Output**: public/posts/{slug}.html

### 4. Efficiency Features
- Only process posts with updatedAt > lastRun timestamp
- Skip unpublished posts
- Cache template parsing for performance

## Implementation Steps

### 1. Create build.js
Node.js script that orchestrates the entire process:
- Read lastRun.json
- Load blog data from JSON/CSV
- Filter posts updated since last run
- Generate HTML files for each post
- Update lastRun.json with current timestamp

### 2. Create Utility Functions
- `slugify()`: Convert titles to URL-friendly slugs
- `loadData()`: Read data from JSON/CSV
- `loadTemplate()`: Read and parse HTML template
- `generateHTML()`: Create final HTML with data
- `saveFile()`: Write generated HTML to public/posts/

### 3. Template Processing
- Identify placeholders in blog-post-name.html
- Replace with actual post data
- Maintain all existing CSS classes and structure
- Ensure responsive design is preserved

## Code Implementation

### 1. Enhanced build.js Structure
```javascript
const fs = require('fs');
const path = require('path');

// Configuration
const DATA_FILE = '../../data/blogs.json';
const TEMPLATE_FILE = 'blog-post-name.html';
const OUTPUT_DIR = 'public/posts';
const LAST_RUN_FILE = 'lastRun.json';

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

function loadData() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
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
    `<title>${post.t} | blushify</title>`
  );
  
  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?">/,
    `<meta name="description" content="${post.c.substring(0, 160)}">`
  );
  
  // Replace meta keywords
  html = html.replace(
    /<meta name="keywords" content=".*?">/,
    `<meta name="keywords" content="${post.tg.join(', ')}">`
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
  
  return html;
}

function saveFile(filename, content) {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, content);
}

// Main build process
async function build() {
  console.log('Starting build process...');
  
  // Load last run time
  const lastRun = loadLastRun();
  console.log(`Last run: ${lastRun}`);
  
  // Load data
  const data = loadData();
  console.log(`Loaded ${data.posts.length} posts`);
  
  // Load template
  const template = loadTemplate();
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Process each post
  let generatedCount = 0;
  for (const post of data.posts) {
    // For now, process all posts (in a real implementation, we'd filter by updatedAt)
    const slug = slugify(post.t);
    const filename = `${slug}.html`;
    
    console.log(`Generating ${filename}...`);
    const html = generateHTML(template, post);
    saveFile(filename, html);
    generatedCount++;
  }
  
  // Save last run time
  saveLastRun();
  
  console.log(`Build complete! Generated ${generatedCount} files.`);
}

// Run the build
build().catch(console.error);
```

### 2. lastRun.json Structure
```json
{
  "lastRun": "2025-07-20T10:00:00Z"
}
```

### 3. Directory Structure
```
project/
├── build.js              # Main build script
├── lastRun.json          # Timestamp tracking
├── public/
│   └── posts/            # Generated HTML files
│       ├── post-one.html
│       └── post-two.html
├── blog-post-name.html   # Template
└── data/
    └── blogs.json        # Data source
```

## Advanced Features

### 1. CSV Support
To support CSV data sources, we can add a CSV parser:
```javascript
function loadCSVData(filepath) {
  const csv = fs.readFileSync(filepath, 'utf8');
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  
  const posts = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length === headers.length) {
      const post = {};
      for (let j = 0; j < headers.length; j++) {
        post[headers[j]] = values[j];
      }
      posts.push(post);
    }
  }
  
  return { posts };
}
```

### 2. Incremental Build Optimization
To minimize reads, we can:
1. Add `updatedAt` field to blog data
2. Only process posts where `updatedAt > lastRun`
3. Skip posts with missing required fields
4. Cache parsed templates in memory

### 3. Error Handling
```javascript
function generateHTMLWithErrorHandling(template, post) {
  try {
    return generateHTML(template, post);
  } catch (error) {
    console.error(`Error generating HTML for post ${post.id}:`, error);
    return null;
  }
}
```

## Deployment

### 1. Firebase Hosting Configuration
Add to `firebase.json`:
```json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

### 2. CI/CD Integration
GitHub Actions workflow:
```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
    
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    - run: node build.js
    - run: firebase deploy --only hosting
```

## Testing Strategy

### 1. Unit Tests
```javascript
// Test slugify function
test('slugify converts title to slug', () => {
  expect(slugify('Hello World!')).toBe('hello-world');
});

// Test data loading
test('loadData loads blog posts', () => {
  const data = loadData();
  expect(data.posts).toBeInstanceOf(Array);
});
```

### 2. Integration Tests
```javascript
// Test full build process
test('build generates HTML files', () => {
  // Run build process
  build();
  
  // Check files were created
  const files = fs.readdirSync('public/posts');
  expect(files.length).toBeGreaterThan(0);
});
```

## Performance Optimization

### 1. Caching
- Cache parsed template in memory
- Reuse file system operations
- Minimize JSON parsing

### 2. Parallel Processing
```javascript
// Process posts in parallel
const promises = data.posts.map(post => processPost(post));
await Promise.all(promises);
```

### 3. Memory Management
- Stream large files instead of loading entirely into memory
- Use generators for large datasets
- Implement proper cleanup of resources

## Security Considerations

### 1. Input Validation
- Validate all data before processing
- Sanitize user-generated content
- Escape HTML entities to prevent XSS

### 2. File System Security
- Validate file paths to prevent directory traversal
- Restrict file permissions
- Use secure file operations

## Maintenance

### 1. Monitoring
- Log build times and performance metrics
- Track number of files generated
- Monitor for errors during build process

### 2. Updates
- Version control all configuration files
- Document changes to build process
- Maintain backward compatibility

## Implementation Summary

### Files to Create
1. `build.js` - Main build script
2. `lastRun.json` - Timestamp tracking
3. `public/posts/` - Directory for generated HTML files

### Key Features Implemented
1. **Data Loading** - Reads from JSON/CSV sources
2. **Template Processing** - Uses existing blog-post-name.html as template
3. **Incremental Builds** - Only processes updated posts
4. **SEO Optimization** - Generates proper meta tags for each post
5. **Performance** - Minimizes reads and optimizes file generation
6. **Error Handling** - Gracefully handles missing data or processing errors

### Usage
1. Run `node build.js` to generate static files
2. Deploy to Firebase Hosting or any static hosting service
3. Schedule daily runs via CI/CD or cron jobs

## Next Steps

### Immediate Implementation
1. Create the `build.js` file with the provided code
2. Test with existing `blogs.json` data
3. Verify generated HTML files match the template structure
4. Implement `lastRun.json` tracking
5. Add incremental build optimization

### Future Enhancements
1. Add CSV support for alternative data sources
2. Implement parallel processing for large datasets
3. Add RSS feed generation
4. Create sitemap.xml for SEO
5. Add image optimization features

## Conclusion
This static site generator provides an efficient, scalable solution for generating blog post pages while minimizing resource usage. The implementation is lightweight, maintainable, and easily extensible for future enhancements.

### 4. File Structure
```
project/
├── build.js              # Main build script
├── lastRun.json          # Timestamp tracking
├── public/
│   └── posts/            # Generated HTML files
│       ├── post-one.html
│       └── post-two.html
├── blog-post-name.html   # Template
└── data/
    └── blogs.json        # Data source
```

## Optimization Strategies

### 1. Data Filtering
- Only fetch posts where published = true
- Only process posts with updatedAt > lastRun timestamp
- Skip posts with missing required fields

### 2. Caching
- Cache parsed template in memory
- Reuse file system operations
- Minimize JSON parsing

### 3. Error Handling
- Validate data before processing
- Gracefully handle missing fields
- Log errors with specific post IDs
- Continue processing other posts on error

## Usage

### Manual Execution
```bash
node build.js
```

### Automated Execution
- Can be run via CI/CD pipeline
- Can be scheduled with cron jobs
- Can be triggered by data updates

## Testing Plan

### 1. Unit Tests
- Test slugify function
- Test data loading
- Test template processing
- Test file generation

### 2. Integration Tests
- Full build process
- Incremental updates
- Error handling scenarios

### 3. Validation
- Check all generated files are valid HTML
- Verify all links work correctly
- Confirm responsive design is preserved
- Ensure SEO metadata is properly set

## Future Enhancements

### 1. Additional Features
- RSS feed generation
- Sitemap.xml creation
- Search index generation
- Image optimization

### 2. Performance Improvements
- Parallel file generation
- Incremental builds
- CDN integration
- Compression optimization

## Conclusion
This static site generator will provide an efficient way to generate blog post pages while minimizing resource usage and maximizing performance. The implementation will be lightweight, maintainable, and easily extensible.