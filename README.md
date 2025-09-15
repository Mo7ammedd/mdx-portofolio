# Mohammed Mostafa - Portfolio Website

> Modern MDX-powered portfolio website showcasing software engineering expertise and technical blog posts.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![MDX](https://img.shields.io/badge/MDX-3.0-orange?style=flat-square&logo=mdx)](https://mdxjs.com/)

## 🚀 Live Demo

**Website:** [mohammedd.tech](https://www.mohammedd.tech)

## ✨ Features

### 🎨 **Modern Design**
- Clean, minimal interface with dark/light theme support
- Responsive design optimized for all devices
- Beautiful animations powered by Framer Motion
- Custom UI components with Radix UI primitives

### 📝 **Content Management**
- MDX-powered blog with syntax highlighting
- Dynamic OG image generation for social sharing
- Automatic sitemap and RSS feed generation
- Blog post reading time estimation

### 🔍 **SEO Optimized**
- Comprehensive meta tags and Open Graph data
- JSON-LD structured data for better search visibility
- Optimized robots.txt and sitemap.xml
- Google Analytics and Microsoft Clarity integration

### ⚡ **Performance**
- Next.js 15 with App Router for optimal performance
- Image optimization with WebP/AVIF support
- Code splitting and lazy loading
- Core Web Vitals optimized

## 🛠 **Tech Stack**

### **Frontend**
- **Framework:** Next.js 15.1.1 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 4.0
- **Content:** MDX 3.0 for blog posts
- **Animations:** Framer Motion 11.x
- **Icons:** Lucide React

### **Tools & Analytics**
- **Analytics:** Google Analytics 4, Microsoft Clarity
- **SEO:** Custom meta generation, structured data
- **Images:** Sharp for optimization, Vercel OG for social cards
- **Deployment:** Vercel (recommended)

## 🏗 **Project Structure**

```
mdx-portofolio/
├── app/                      # Next.js App Router
│   ├── blog/                 # Blog posts and layout
│   │   ├── [post]/          # Individual blog posts (MDX)
│   │   └── layout.tsx       # Blog-specific layout
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── robots.ts            # SEO robots configuration
│   └── sitemap.ts           # Dynamic sitemap generation
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components
│   ├── analytics.tsx        # Analytics integration
│   ├── project-card.tsx     # Project showcase component
│   └── structured-data.tsx  # JSON-LD schema component
├── lib/                     # Utility functions
│   ├── blog-metadata.ts     # Blog post utilities
│   ├── constants.ts         # Site constants
│   ├── schema.ts            # Structured data schemas
│   ├── seo.ts               # SEO utilities
│   └── utils.ts             # General utilities
├── public/                  # Static assets
│   ├── og/                  # Open Graph images
│   ├── avatar.jpg           # Profile image
│   └── resume.pdf           # Resume download
└── scripts/                 # Build scripts
    └── generate-og-images.ts # OG image generation
```

## 🚦 **Getting Started**

### **Prerequisites**
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Mo7ammedd/mdx-portofolio.git
cd mdx-portofolio

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### **Environment Setup**

Create a `.env.local` file in the root directory:

```env
# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxx

# SEO Verification (Optional)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_BING_SITE_VERIFICATION=your-verification-code
```

### **Development**

```bash
# Start development server
npm run dev

# Generate OG images
npm run generate-og

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

The development server will start at `http://localhost:3000`.

## 📝 **Content Management**

### **Adding Blog Posts**

1. Create a new folder in `app/blog/your-post-slug/`
2. Add a `page.mdx` file with frontmatter:

```mdx
import { generateBlogPostSEO } from '@/lib/seo'

export const metadata = generateBlogPostSEO({
  title: 'Your Post Title',
  description: 'Compelling description for SEO',
  slug: 'your-post-slug',
  publishedTime: '2024-01-01T10:00:00.000Z',
  tags: ['tag1', 'tag2', 'tag3'],
})

# Your Post Title

Your content here...
```

3. Generate OG image: `npm run generate-og`
4. Update sitemap in `app/sitemap.ts`

### **Updating Projects**

Edit the `PROJECTS` array in `app/data.tsx` to add or modify project information.

## 🎨 **Customization**

### **Styling**
- Modify `app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Edit component styles in individual component files

### **Configuration**
- Site metadata: `components/siteConfig.tsx`
- Constants: `lib/constants.ts`
- Analytics: `components/analytics.tsx`

## 📊 **Analytics & SEO**

### **Built-in Features**
- ✅ Google Analytics 4 integration
- ✅ Microsoft Clarity for user behavior
- ✅ Comprehensive meta tags
- ✅ JSON-LD structured data
- ✅ Dynamic sitemap generation
- ✅ Optimized robots.txt
- ✅ Open Graph social cards

### **Performance Monitoring**
- Core Web Vitals tracking
- Page load performance metrics
- User engagement analytics

## 🚀 **Deployment**

### **Vercel (Recommended)**

```bash
# Deploy to Vercel
npx vercel

# Or connect your GitHub repository to Vercel dashboard
```

### **Other Platforms**
- **Netlify:** Configure build command as `npm run build`
- **Railway/Render:** Use Docker deployment
- **Self-hosted:** Use `npm run build && npm start`

## 📱 **Browser Support**

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 **About the Developer**

**Mohammed Mostafa** - Software Engineer specializing in ASP.NET Core, Node.js, and TypeScript

- 🌐 **Website:** [mohammedd.tech](https://www.mohammedd.tech)
- 💼 **LinkedIn:** [mohammed-mostafa](https://linkedin.com/in/mohammed-mostafa)
- 🐙 **GitHub:** [@Mo7ammedd](https://github.com/Mo7ammedd)
- 🐦 **Twitter:** [@mohameddtv](https://twitter.com/mohameddtv)
- 📧 **Email:** mohammedmostafanazih@gmail.com

---

⭐ **Star this repository if you found it helpful!**
