# Complete Setup Guide - Njoki Homestays Platform

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Tech Stack Overview](#tech-stack-overview)
3. [Tech Stack Recommendations & Alternatives](#tech-stack-recommendations--alternatives)
4. [Pre-Setup: Account Creation](#pre-setup-account-creation)
5. [Automated Setup](#automated-setup)
6. [Manual Setup (Alternative)](#manual-setup-alternative)
7. [Verification](#verification)
8. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
9. [Development Workflow](#development-workflow)
10. [Next Steps](#next-steps)

---

## System Requirements

### Minimum Requirements
- **OS:** macOS, Linux, or Windows (with WSL2)
- **RAM:** 8GB
- **Disk Space:** 5GB for development tools and project
- **Internet:** Required for package downloads and cloud services

### Required Software

#### Option A: Using Bun (Recommended)
```bash
# Bun - JavaScript runtime (faster than Node.js)
curl -fsSL https://bun.sh/install | bash

# Git
brew install git          # macOS
sudo apt install git      # Ubuntu/Debian
choco install git         # Windows
```

#### Option B: Using Node.js
```bash
# Node.js 18.x or higher
https://nodejs.org/

# Git
brew install git          # macOS
sudo apt install git      # Ubuntu/Debian
choco install git         # Windows
```

### Verify Installation

```bash
# Check versions
node --version        # Should be v18.0.0 or higher (if using Node.js)
bun --version         # Should be 1.0.0 or higher (if using Bun)
npm --version         # Should be 9.0.0 or higher
git --version         # Should be 2.30.0 or higher
```

---

## Tech Stack Overview

### Frontend
```
Next.js 14 (App Router)
├─ TypeScript
├─ TailwindCSS
└─ Optional: ShadCN/UI (Component Library)
```

### Backend
```
Hono (Web Framework)
├─ Bun Runtime
├─ TypeScript
├─ Drizzle ORM
└─ Zod (Validation)
```

### Database
```
Supabase PostgreSQL
├─ Drizzle for schema management
├─ Real-time subscriptions (optional)
└─ Built-in authentication (not used - using Clerk)
```

### DevOps & Tools
```
Development:
├─ Docker (optional)
├─ ESLint & Prettier
└─ TypeScript strict mode

Deployment:
├─ Vercel (Frontend)
├─ Railway or Render (Backend)
└─ Supabase Cloud (Database)
```

---

## Tech Stack Recommendations & Alternatives

### 📊 Our Stack vs. Alternatives

| Layer | Our Choice | Alternatives | Why Our Choice |
|-------|-----------|--------------|-----------------|
| **Frontend Framework** | Next.js 14 | Vite + React, Remix | Best for Kenya: SEO, ISR, quick setup |
| **Runtime** | Bun | Node.js | 5x faster builds, excellent TypeScript support |
| **Backend** | Hono | Express, Fastify | Minimal, fast, perfect for Bun, tiny bundle |
| **ORM** | Drizzle | Prisma, TypeORM | Type-safe, zero-runtime overhead, better DX |
| **Auth** | Clerk | NextAuth.js, Auth0 | Better UX, free tier generous, WhatsApp-ready |
| **Database** | Supabase | AWS RDS, Railway | Generous free tier, great UI, Kenya-friendly |
| **Validation** | Zod | Joi, Yup | Runtime validation, TypeScript inference, small |
| **UI Components** | Tailwind | Bootstrap, MUI | Rapid development, fully customizable, smaller |

---

### 🎯 Recommended Additions to Your Stack

#### 1. **ShadCN/UI** (Highly Recommended)
```bash
# Pre-built component library for Tailwind
cd frontend && npx shadcn-ui@latest init
```

**Why:** Saves 30% development time on UI, professional appearance
```javascript
// Instead of building from scratch:
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
```

#### 2. **TanStack Query** (Server State Management)
```bash
bun add @tanstack/react-query
```

**Why:** Efficient server state management, caching, infinite queries
```javascript
const { data: units } = useQuery({
  queryKey: ['units'],
  queryFn: () => fetch('/api/units').then(r => r.json())
})
```

#### 3. **Zustand** (Client State Management)
```bash
bun add zustand
```

**Why:** 2KB library, perfect for filters, user preferences
```javascript
export const useFilterStore = create((set) => ({
  location: 'Nyahururu',
  setLocation: (loc) => set({ location: loc })
}))
```

#### 4. **Zod** (Backend Validation)
Already included - for request validation
```typescript
const bookingSchema = z.object({
  unitId: z.number(),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1).max(10)
})
```

#### 5. **Drizzle Studio** (Visual Database Editor)
```bash
cd backend && bun run db:studio
```

**Why:** GUI for database management, visualize data, run queries

---

### ⚡ Performance & Quality Tools

#### ESLint & Prettier (Code Quality)
```bash
# Already included in Next.js - just run:
npm run lint          # Find issues
npm run format        # Auto-format code
```

#### Playwright (E2E Testing) - Optional
```bash
bun add -D @playwright/test
```

#### Vitest (Unit Testing) - Optional
```bash
bun add -D vitest
```

---

### 🌍 Kenya-Specific Considerations

#### Why This Stack for Kenya:

1. **Hono + Bun**
   - Minimal CPU usage (runs in free tier)
   - Perfect for Kenyan hosting (Railway, Render)
   - Fast cold starts

2. **Supabase PostgreSQL**
   - $5/month paid plan (vs $100+ for competitors)
   - Data residency options
   - Real-time capabilities for future WhatsApp integration

3. **Clerk Authentication**
   - Supports email + SMS (for Kenyan users)
   - OAuth with Google (very popular in Kenya)
   - Future: WhatsApp login integration
   - GDPR compliant (data privacy)

4. **Vercel Frontend Hosting**
   - Free tier with great features
   - Edge functions near Kenya users
   - Quick deployments

5. **Next.js App Router**
   - Server Components (reduce client-side JS)
   - Ideal for slower networks
   - Built-in image optimization
   - Automatic code splitting

---

## Pre-Setup: Account Creation

### 1. Supabase Account (Database)

```bash
# Step 1: Visit https://app.supabase.com
# Step 2: Click "Sign Up" → Sign in with GitHub
# Step 3: Create Organization → Create Project
#         - Name: njoki-homestays-dev
#         - Password: (strong password)
#         - Region: eu-west-1 (Ireland - closest to Kenya)

# Step 4: Save connection string from:
# Settings → Database → Connection string (URI)
# Should look like:
# postgresql://postgres:xxxxx@db.xxx.supabase.co:5432/postgres
```

### 2. SendGrid Account (Email)

```bash
# Step 1: Visit https://app.sendgrid.com
# Step 2: Sign up with email
# Step 3: Create API Key
# Step 4: Verify sender email (use noreply@njoki-homestays.com)
# Step 5: Copy API key to SENDGRID_API_KEY
```

### 3. GitHub Account (Version Control)

```bash
# Step 1: Visit https://github.com
# Step 2: Sign up or sign in
# Step 3: Create new repository: njoki-homestays-platform
# Step 4: (Don't initialize - we'll do it locally)
```

---

## Automated Setup

### Using setup.sh (Recommended)

```bash
# Step 1: Clone or create project directory
mkdir njoki-homestays-platform
cd njoki-homestays-platform

# Step 2: Copy setup.sh into directory
# (Either clone the repo or copy the file)

# Step 3: Make script executable
chmod +x setup.sh

# Step 4: Run setup
./setup.sh

# Step 5: Follow prompts and update .env files with credentials
```

**What setup.sh does:**
- ✅ Checks prerequisites (Node.js/Bun, Git)
- ✅ Creates project structure
- ✅ Initializes Git repository
- ✅ Creates .gitignore
- ✅ Creates .env files (templates)
- ✅ Sets up Next.js frontend
- ✅ Sets up Hono backend
- ✅ Installs all dependencies
- ✅ Creates helper scripts

**Output after setup.sh:**
```
njoki-homestays-platform/
├── frontend/                  (Next.js app)
├── backend/                   (Hono API)
├── database/                  (Schema & migrations)
├── docs/                      (Documentation)
├── scripts/                   (Helper scripts)
├── .env.example              (Environment template)
└── .gitignore                (Git exclusions)
```

---

## Manual Setup (Alternative)

If setup.sh doesn't work or you prefer manual steps:

### 1. Create Project Structure

```bash
mkdir njoki-homestays-platform
cd njoki-homestays-platform

mkdir -p frontend backend database/migrations database/seeds docs scripts
touch .gitignore .env.example
```

### 2. Initialize Git

```bash
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 3. Create .gitignore

```bash
cat > .gitignore << 'EOF'
node_modules/
.next/
dist/
.env
.env.local
.env.*.local
.DS_Store
*.log
.vscode/
.idea/
.turbo/
coverage/
EOF
```

### 4. Setup Frontend (Next.js)

```bash
# Create Next.js app
cd frontend
if command -v bun &> /dev/null; then
    bunx create-next-app@latest . \
        --typescript \
        --tailwind \
        --app \
        --eslint \
        --no-git \
        --src-dir \
        --import-alias '@/*'
else
    npx create-next-app@latest . \
        --typescript \
        --tailwind \
        --app \
        --eslint \
        --no-git \
        --src-dir \
        --import-alias '@/*'
fi

# Add Clerk
bun add @clerk/nextjs

# Optional: Add ShadCN/UI
bunx shadcn-ui@latest init

# Add recommended packages
bun add @tanstack/react-query zustand axios

cd ..
```

### 5. Setup Backend (Hono)

```bash
cd backend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "njoki-homestays-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "hono dev src/index.ts --port 3001",
    "build": "bun build src/index.ts --outdir dist",
    "db:push": "drizzle-kit push:pg",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "drizzle-orm": "^0.29.0",
    "pg": "^8.11.0",
    "clerk-sdk-node": "^5.0.0",
    "zod": "^3.22.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "drizzle-kit": "^0.20.0"
  }
}
EOF

# Install dependencies
bun install

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"]
}
EOF

# Create drizzle.config.ts
cat > drizzle.config.ts << 'EOF'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
EOF

# Create source directory
mkdir -p src/db

cd ..
```

### 6. Create Environment Files

```bash
# Backend .env
cat > backend/.env << 'EOF'
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/njoki_homestays_dev"
CLERK_SECRET_KEY=your_key_here
CLERK_PUBLISHABLE_KEY=your_key_here
SENDGRID_API_KEY=your_key_here
SENDGRID_FROM_EMAIL=noreply@njoki-homestays.com
JWT_SECRET=change_in_production
CORS_ORIGIN=http://localhost:3000
EOF

# Frontend .env.local
cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_key_here
EOF
```

### 7. Install Dependencies

```bash
# Frontend
cd frontend && bun install && cd ..

# Backend
cd backend && bun install && cd ..
```

---

## Verification

### Check Installation

```bash
# Verify Node.js/Bun
bun --version
node --version
npm --version

# Verify Git
git --version

# Check installed packages
cd frontend && ls node_modules | head -10
cd ../backend && ls node_modules | head -10
```

### Test Development Servers

```bash
# Terminal 1: Start Backend
cd backend
bun run dev
# Should output: Server running on http://localhost:3001

# Terminal 2: Start Frontend (new terminal)
cd frontend
bun run dev
# Should output: ▲ Next.js started...
# Ready in X.XXs (http://localhost:3000)
```

### Verify Services

```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:3001

# Both should return success (200) responses
```

---

## Common Issues & Troubleshooting

### Issue 1: "Bun not found"

**Solution:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

source ~/.bashrc  # or ~/.zshrc
```

### Issue 2: "Port 3000 already in use"

**Solution:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
cd frontend
PORT=3002 bun run dev
```

### Issue 3: "DATABASE_URL is not set"

**Solution:**
```bash
# Update backend/.env with Supabase connection string
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Issue 4: "Clerk keys not found"

**Solution:**
```bash
# Get keys from https://dashboard.clerk.com
# Update frontend/.env.local:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

### Issue 5: "Cannot find module '@/components/ui/button'"

**Solution:**
```bash
# Install ShadCN/UI components
cd frontend
bunx shadcn-ui@latest init
bunx shadcn-ui@latest add button input card
```

### Issue 6: "npm ERR! 404 Not Found"

**Solution:**
```bash
# Clear cache and reinstall
bun pm cache
bun install
```

### Issue 7: "CORS error: Origin not allowed"

**Solution:**
```bash
# Update backend/.env CORS_ORIGIN
CORS_ORIGIN=http://localhost:3000

# If still issues, check Hono CORS middleware in code
```

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Backend (port 3001)
cd backend
bun run dev

# Terminal 2: Frontend (port 3000)
cd frontend
bun run dev

# Open browser to http://localhost:3000
```

### Code Quality

```bash
# Format code
cd frontend && npm run format
cd ../backend && npm run format

# Check for errors
cd frontend && npm run lint
cd ../backend && npm run lint
```

### Database Management

```bash
# Push schema changes to database
cd backend
bun run db:push

# Open Drizzle Studio (visual editor)
bun run db:studio

# Generate migrations
bun run db:migrate
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/unit-listing

# Make changes, test locally
# ... edit files ...

# Stage and commit
git add .
git commit -m "feat: add unit listing page"

# Push to GitHub
git push origin feature/unit-listing

# Create Pull Request on GitHub
# Get review, merge to main
```

---

## Next Steps

### 1. Setup Complete ✅
- Environment configured
- Dependencies installed
- Services running locally

### 2. Create First Feature
```bash
# Backend: Create API endpoint
# frontend/src/api/units.ts
export async function getUnits() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`)
  return res.json()
}

# Frontend: Create page component
# app/units/page.tsx
import { getUnits } from '@/lib/api/units'

export default async function UnitsPage() {
  const units = await getUnits()
  return <div>{/* Render units */}</div>
}
```

### 3. Database Schema
```bash
# Define database schema
# backend/src/db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### 4. API Endpoints
```typescript
// backend/src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(cors())

app.get('/api/units', async (c) => {
  // Fetch units from database
  const units = await db.select().from(unitTable)
  return c.json(units)
})

export default app
```

### 5. Authentication Flow
```typescript
// Add Clerk to frontend layouts
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

---

## Useful Commands Reference

### Frontend (Next.js)

```bash
cd frontend

# Development
bun run dev                 # Start dev server
bun run build              # Production build
bun run start              # Start production server

# Code quality
bun run lint               # ESLint
bun run format             # Prettier

# TypeScript
bunx tsc --noEmit          # Type check
```

### Backend (Hono)

```bash
cd backend

# Development
bun run dev                # Start dev server
bun run build              # Production build
bun run start              # Start production server

# Database
bun run db:push            # Apply schema to DB
bun run db:migrate         # Create migrations
bun run db:studio          # Open Drizzle Studio
```

### Git & Deployment

```bash
# Git
git status                 # Check changes
git add .                  # Stage all changes
git commit -m "message"    # Commit
git push                   # Push to GitHub
git log --oneline          # View history

# Deployment (Later)
# Frontend: vercel deploy
# Backend: railway up (or render deploy)
```

---

## Technology Stack Summary

### ✅ Chosen Stack (Recommended)

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Frontend | Next.js | 14+ | SEO, ISR, speed |
| Backend | Hono | 4.0+ | Lightweight, fast |
| Runtime | Bun | 1.0+ | 5x faster |
| Database | PostgreSQL | 15+ | Reliable |
| ORM | Drizzle | 0.29+ | Type-safe |
| Auth | Clerk | 5.0+ | Great UX |
| UI | Tailwind | 3.3+ | Rapid dev |
| Validation | Zod | 3.22+ | Runtime checks |
| State | TanStack Query + Zustand | Latest | Server + client |

### 📚 Learning Resources

- **Next.js:** https://nextjs.org/learn
- **Hono:** https://hono.dev
- **Drizzle:** https://orm.drizzle.team
- **Clerk:** https://clerk.com/docs
- **Tailwind:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

### 🚀 Deployment Resources

- **Frontend:** https://vercel.com/docs
- **Backend:** https://docs.railway.app or https://render.com/docs
- **Database:** https://supabase.com/docs
- **Custom Domain:** https://docs.namecheap.com

---

## Support & Documentation

For issues or questions:

1. **Check this guide first** - Most common issues covered above
2. **Search online** - Stack Overflow, GitHub issues
3. **Read official docs** - Links provided above
4. **Ask in communities** - Discord servers, Reddit

---

**Setup Guide Version:** 1.0
**Last Updated:** June 2024
**Next Review:** Monthly

