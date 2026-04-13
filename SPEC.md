# Portfolio Fullstack - Specification Document

## 1. Project Overview

- **Project Name**: Rick Gonzalez Portfolio
- **Type**: Fullstack Web Application (Portfolio SaaS-ready)
- **Core Functionality**: Professional portfolio demonstrating fullstack capabilities with Supabase backend, authentication, and admin dashboard
- **Target Users**: Recruiters, potential clients, fellow developers

---

## 2. Technology Stack

| Category | Technology |
|----------|------------|
| Framework | SvelteKit |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | TailwindCSS |
| Deploy | Vercel |
| Animations | CSS Transitions + Svelte transitions |

---

## 3. UI/UX Specification

### 3.1 Design System

**Color Palette (Dark Mode)**
- Background Primary: `#0a0a0f` (near black with blue tint)
- Background Secondary: `#12121a` (card backgrounds)
- Background Tertiary: `#1a1a25` (elevated elements)
- Accent Primary: `#8b5cf6` (violet-500)
- Accent Secondary: `#3b82f6` (blue-500)
- Accent Gradient: `linear-gradient(135deg, #8b5cf6, #3b82f6)`
- Text Primary: `#f8fafc` (slate-50)
- Text Secondary: `#94a3b8` (slate-400)
- Text Muted: `#64748b` (slate-500)
- Border: `#27272a` (zinc-800)
- Success: `#22c55e` (green-500)
- Error: `#ef4444` (red-500)

**Typography**
- Font Family: `Inter` (Google Fonts)
- Headings: 
  - H1: 4rem/64px (hero), font-weight: 800
  - H2: 2.5rem/40px, font-weight: 700
  - H3: 1.5rem/24px, font-weight: 600
- Body: 1rem/16px, font-weight: 400
- Small: 0.875rem/14px

**Spacing System**
- Section padding: 6rem (96px) vertical
- Container max-width: 1280px
- Card padding: 1.5rem (24px)
- Gap between elements: 1rem (16px) to 2rem (32px)

**Visual Effects**
- Glassmorphism: `backdrop-blur-lg bg-opacity-80`
- Card shadows: `shadow-xl shadow-black/20`
- Border radius: `rounded-xl` (12px), `rounded-2xl` (16px)
- Hover transitions: `transition-all duration-300 ease-out`

### 3.2 Layout Structure

**Navigation (Fixed)**
- Logo: Left side
- Links: Center (Home, Projetos, Contato, API Docs)
- Auth: Right side (Login/Dashboard)
- Glass effect with blur
- Mobile: Hamburger menu

**Footer**
- Social links (GitHub, LinkedIn, Email)
- Copyright
- Quick links

### 3.3 Animations

**Page Transitions**
- Fade in: `opacity 0 → 1`, duration 300ms
- Slide up: `translateY(20px) → 0`, duration 400ms

**Scroll Reveal**
- Elements fade in when entering viewport
- Staggered delays: 100ms between elements

**Hover Effects**
- Buttons: Scale 1.02, brightness increase
- Cards: Y translate -4px, shadow increase
- Links: Color transition, underline slide

**Tech Stack Icons**
- Float animation (subtle up/down)
- Pulse on hover

---

## 4. Page Specifications

### 4.1 Home (/)

**Hero Section**
- Full viewport height (100vh)
- Large heading: "Fullstack Developer"
- Subheading with typing effect
- Two CTAs: "Ver Projetos" (primary), "Contato" (outline)
- Animated gradient background blob

**Tech Stack**
- Horizontal scroll on mobile
- Grid on desktop (4-5 per row)
- Icons: Svelte, TypeScript, Node.js, PostgreSQL, Supabase, TailwindCSS, Git, Docker
- Tooltip on hover showing tech name

**Featured Projects**
- 3 cards showing latest projects from database
- Skeleton loading state
- "Ver todos os projetos" link

**Services**
- 3 cards: Fullstack Development, API Design, Technical Consulting
- Icon + title + description

**Testimonials**
- Fake data initially (ready for real)
- Avatar, name, company, quote
- Carousel on mobile

**CTA Section**
- "Vamos trabalhar juntos?"
- Contact form link

### 4.2 Projects (/projetos)

**Header**
- Title: "Meus Projetos"
- Filter by technology (multi-select)
- Search input

**Project Grid**
- Responsive: 1 col mobile, 2 col tablet, 3 col desktop
- Cards show: Image, Title, Description (truncated), Tech tags
- Hover: overlay with links

**Loading State**
- Skeleton cards (pulsing)

### 4.3 Project Detail (/projetos/[id])

**Hero**
- Full-width image
- Title overlay
- Links: GitHub, Live Demo

**Content**
- Description (markdown supported)
- Tech stack with icons
- Architecture/explanation section

**Navigation**
- Previous/Next project

### 4.4 Contact (/contato)

**Form**
- Fields: Name, Email, Message
- Validation (required, email format)
- Submit button with loading state

**Success State**
- Toast notification
- Form reset

**Data Flow**
- POST to `/api/contact`
- Save to Supabase `contacts` table

### 4.5 Login (/login)

**Form**
- Email input
- Password input
- "Entrar" button
- Error messages

**Success**
- Redirect to dashboard

### 4.6 Dashboard (/dashboard)

**Protected Route**
- Redirect to login if not authenticated

**Layout**
- Sidebar: Projects, Messages, Settings
- Main content area

**Projects Management**
- Table with all projects
- Actions: Edit, Delete
- "Novo Projeto" button opens modal

**Project Form (Modal)**
- Fields: Title, Description, Tech (tags), Image URL, GitHub URL, Live URL
- Save/Cancel buttons

**Messages**
- Table showing contacts received
- Read/Unread status
- Delete option

### 4.7 API Docs (/api-docs)

**Endpoint Documentation**
- GET /api/projects
- POST /api/projects
- PUT /api/projects
- DELETE /api/projects
- POST /api/contact

**Format**
- Method badge
- URL
- Description
- Request body example
- Response example

---

## 5. Backend API Routes

### 5.1 /api/projects

```
GET /api/projects
- Returns: Array of projects

POST /api/projects
- Body: { title, description, tech[], image_url, github_url, live_url }
- Returns: Created project

PUT /api/projects
- Body: { id, title, description, tech[], image_url, github_url, live_url }
- Returns: Updated project

DELETE /api/projects?id={id}
- Returns: { success: true }
```

### 5.2 /api/contact

```
POST /api/contact
- Body: { name, email, message }
- Returns: { success: true, id }
```

---

## 6. Database Schema (Supabase)

### projects table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech TEXT[],
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### contacts table
```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 7. Authentication

- Supabase Auth with email/password
- Protected routes: /dashboard
- User session stored in cookie
- Server-side auth check in +page.server.js

---

## 8. Acceptance Criteria

- [ ] Dark mode applied throughout
- [ ] All pages render without errors
- [ ] Projects load dynamically from Supabase
- [ ] Contact form saves to database
- [ ] Login authenticates with Supabase
- [ ] Dashboard protected (redirects if not logged in)
- [ ] CRUD operations work in dashboard
- [ ] Animations smooth (60fps)
- [ ] Responsive on mobile/tablet/desktop
- [ ] No console errors
- [ ] API endpoints return correct responses