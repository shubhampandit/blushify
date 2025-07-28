# Cute Finds Blog

A kawaii-themed blog built with Next.js, featuring cute product reviews and lifestyle content.

## Features

- Responsive design with mobile-friendly navigation
- Blog posts with markdown content and frontmatter metadata
- SEO optimized with proper meta tags and structured data
- Kawaii-themed styling with animations and special elements
- Static site generation for fast loading times

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

### Deployment

#### Vercel Deployment (Recommended)

This project is configured for automated deployment with Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up for a [Vercel account](https://vercel.com/signup)
3. Create a new project and import your repository
4. Vercel will automatically detect the Next.js framework and configure the build settings
5. Deploy your site with a single click

The project is already configured with:
- `vercel.json` for build settings
- Next.js output tracing for optimized deployments
- Static export mode for maximum performance

#### Manual Deployment

To manually deploy the static files:

1. Build the project:
   ```bash
   npm run build
   ```

2. The static files will be generated in the `out` directory
3. Upload the contents of the `out` directory to your preferred hosting provider

## Project Structure

```
.
├── components/          # React components
├── data/                # Blog data (CSV files)
├── lib/                 # Utility functions
├── pages/               # Next.js pages
├── public/              # Static assets
├── styles/              # CSS styles
├── next.config.js       # Next.js configuration
└── vercel.json          # Vercel deployment configuration
```

## Blog Content Management

Blog posts are managed through CSV files in the `data/` directory:

1. Edit `data/blogs.csv` to add or modify blog posts
2. Each post can include markdown content with frontmatter metadata
3. The site automatically generates static pages for each blog post

## Customization

### Styling

The site uses CSS modules for component-level styling:
- Global styles: `styles/globals.css`
- Component styles: `styles/[ComponentName].module.css`

### Adding New Pages

1. Create a new file in `pages/` with the desired route name
2. Export a React component as the default export
3. The page will be automatically available at the corresponding route

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.