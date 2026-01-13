# Portfolio Website - Project Documentation

## Base Idea
A unique, visually engaging portfolio website that tells a story through scroll-triggered animations. The centerpiece is a "Growing Boy" animation that evolves as users scroll through the page - starting as a child in the hero section, growing into a teen showing skills, becoming a young adult showcasing projects, and finally a professional in the experience section. This creates an emotional connection and memorable user experience.

## Optimized Tech Stack

### Frontend
- **Next.js 14+** (App Router) - SSR/SSG, SEO optimization, file-based routing
- **TypeScript** - Type safety and better DX
- **Tailwind CSS v4** - Required for HeroUI v3, utility-first CSS
- **HeroUI v3 Beta** - Modern component library with compound components
- **Framer Motion 10+** - Scroll-linked animations, spring physics, gestures

### Backend & Data
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **Cloudinary** - Image/video optimization, transformations, CDN delivery

### Blogging
- **MDX (next-mdx-remote)** - Markdown with React components
- **gray-matter** - Frontmatter parsing for blog metadata

### Performance & SEO
- **next-sitemap** - Automatic sitemap generation
- **@vercel/analytics** - Performance monitoring

## Animation Architecture

### Growing Boy Concept
The character progresses through 4 distinct stages based on scroll position:

| Scroll %  | Stage           | Section    | Character State                    |
|-----------|-----------------|------------|------------------------------------|
| 0-25%     | Child           | Hero       | Small, curious, looking up         |
| 25-50%    | Teen            | Skills     | Growing, holding tools/books       |
| 50-75%    | Young Adult     | Projects   | Working on laptop/building         |
| 75-100%   | Professional    | Experience | Confident, presenting work         |

### Animation Techniques
- **useScroll()** + **useTransform()** - Scroll-linked value interpolation
- **useMotionValueEvent()** - Scroll progress tracking
- **CSS transforms** - GPU-accelerated (translate, scale, rotate)
- **Spring physics** - Natural, organic motion feel
- **will-change: transform** - Performance optimization hint

### Visual Effects
- **Backdrop blur** - 8-16px for glass morphism sections
- **Gradient overlays** - Smooth color transitions between sections
- **Parallax layers** - Multi-depth backgrounds (0.2x to 1.5x speeds)
- **Stagger animations** - Sequential reveal of child elements

## Features Breakdown

### Core Sections
1. **Hero** - Animated intro with child character, name, tagline, CTA buttons
2. **Skills** - Progress bars/charts with teen character, categorized skills
3. **Projects** - Grid layout with hover effects, young adult character
4. **Experience** - Timeline layout, professional character
5. **Certifications** - Card grid with verification links
6. **Blog** - MDX-powered posts with syntax highlighting
7. **Contact** - Form (Supabase function) + social links

### Technical Features
- **Responsive Design** - Mobile-first, breakpoints at 640px, 768px, 1024px, 1280px
- **Dark Mode** - System preference detection + manual toggle
- **SEO** - Meta tags, Open Graph, JSON-LD structured data
- **Accessibility** - ARIA labels, keyboard navigation, focus management
- **Performance** - Image optimization, code splitting, lazy loading

## File Structure

```
meek_portfolio/
├── app/
│   ├── (main)/page.tsx           # Home with all sections
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Blog post
│   ├── projects/[slug]/page.tsx  # Project detail
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── not-found.tsx             # 404 page
│   └── robots.ts                 # Dynamic robots.txt
├── components/
│   ├── animations/               # Animation components
│   │   ├── GrowingBoy.tsx        # Main character
│   │   ├── ScrollProgress.tsx    # Progress indicator
│   │   ├── FadeInSection.tsx     # Reveal on scroll
│   │   └── ParallaxLayer.tsx     # Parallax backgrounds
│   ├── sections/                 # Page sections
│   │   ├── Hero.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Certifications.tsx
│   │   ├── BlogPreview.tsx
│   │   └── Contact.tsx
│   ├── ui/                       # Reusable UI
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── BlogCard.tsx
│   │   ├── SkillBar.tsx
│   │   ├── TimelineItem.tsx
│   │   └── SocialLinks.tsx
│   └── layout/Container.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── types.ts              # Database types
│   ├── cloudinary.ts             # Image helpers
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # Site config
├── hooks/
│   ├── useScrollProgress.ts
│   ├── useInView.ts
│   └── useMediaQuery.ts
├── content/blog/                 # MDX blog posts
├── types/index.ts                # TypeScript interfaces
└── public/
    ├── images/boy-stages/        # Character SVGs
    └── icons/                    # Social icons
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_SITE_NAME=Your Name

# Contact Form (optional)
RESEND_API_KEY=
CONTACT_EMAIL=
```

## Deployment

- **Platform**: Vercel (optimized for Next.js)
- **CI/CD**: GitHub Actions for testing + automatic Vercel deployment
- **Branch Strategy**: main (production), develop (staging)
- **Monitoring**: Vercel Analytics + Speed Insights

## Design System

### Colors (oklch format for HeroUI v3)
- **Primary**: oklch(0.6 0.2 250) - Deep blue
- **Accent**: oklch(0.75 0.15 180) - Teal
- **Success**: oklch(0.7 0.2 145) - Green
- **Warning**: oklch(0.8 0.15 85) - Amber
- **Danger**: oklch(0.65 0.25 25) - Red

### Typography
- **Headings**: Inter (sans-serif)
- **Body**: Inter (sans-serif)
- **Code**: JetBrains Mono (monospace)

### Spacing Scale
- xs: 0.25rem, sm: 0.5rem, md: 1rem, lg: 1.5rem, xl: 2rem, 2xl: 3rem

### Border Radius
- sm: 0.375rem, md: 0.5rem, lg: 0.75rem, xl: 1rem, full: 9999px

## Performance Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse Score**: > 90 (all categories)