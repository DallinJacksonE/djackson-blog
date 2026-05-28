# React + MDX Developer Blog Template

A clean, snappy blog and tutorial ecosystem template. Built with React, TypeScript, and Vite for maximum speed. It uses React Router for navigation and CSS Modules for locally scoped styling. Content is managed using the native MDX compiler.

## 🛠️ Quick Start (Local Development)

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Adding Content

All written content acts as a single source of truth inside the `src/content/` directory. Everything uses standard JavaScript exports instead of YAML frontmatter.

### Articles & Tutorials
* Articles can be added to the `blogs/`, `tutorials/`, or `topics/` subdirectories.
* You can use the provided `_template-article.mdx` structure to easily scaffold new posts.

### Slide Decks (PDFs)
* For presentations, drop your PDF into the Vite `public/slides/` folder.
* Create a matching `.mdx` file containing your metadata in `src/content/slides/`.

## 🐳 Docker Deployment

The template includes a production-ready Express server to handle client-side routing. It operates via a multi-stage Docker build.

1. Build and start the container:
   ```bash
   docker-compose up -d --build
   ```
2. By default, the container exposes port 3001. The site will be live at `http://localhost:3001`.
