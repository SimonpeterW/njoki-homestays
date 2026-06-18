#!/bin/bash

################################################################################
# Njoki Homestays - Phase 1: Environment Setup
# 
# This script creates the complete project structure with all necessary
# configuration files. It does NOT install dependencies (Phase 2).
#
# Time: ~5 minutes
# Requirements: Git, Bash
#
# Usage: bash setup.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Project name
PROJECT_NAME="njoki-homestays"

################################################################################
# HELPER FUNCTIONS
################################################################################

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

print_step() {
    echo -e "${CYAN}→${NC} $1"
}

create_file() {
    local filepath=$1
    local content=$2
    mkdir -p "$(dirname "$filepath")"
    echo "$content" > "$filepath"
    print_success "Created: $filepath"
}

################################################################################
# PHASE 1: ENVIRONMENT SETUP
################################################################################

phase_1_start() {
    print_header "PHASE 1: ENVIRONMENT SETUP"
    print_info "Creating complete project structure"
    print_info "Time estimate: 5 minutes"
    echo ""
}

################################################################################
# STEP 1: Create Directory Structure
################################################################################

step_1_directories() {
    print_step "Step 1: Creating directory structure..."
    
    # Backend directories
    mkdir -p backend/src/{db,routes,middleware,services,utils,types}
    mkdir -p backend/tests
    
    # Frontend directories
    mkdir -p frontend/app/{units,bookings,api}
    mkdir -p frontend/src/{components/{ui,features},lib/{hooks,api,store,utils},types}
    mkdir -p frontend/public/{images,fonts}
    
    # Database directories
    mkdir -p database/migrations
    mkdir -p database/seeds
    
    # Documentation
    mkdir -p docs
    
    # Scripts
    mkdir -p scripts
    
    # GitHub
    mkdir -p .github/workflows
    
    print_success "Directory structure created"
}

################################################################################
# STEP 2: Create Root Configuration Files
################################################################################

step_2_root_configs() {
    print_step "Step 2: Creating root configuration files..."
    
    # .gitignore
    create_file ".gitignore" '# Dependencies
node_modules/
.pnp
.pnp.js
dist/
build/
out/

# Environment
.env
.env.local
.env.*.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Build
.next/
.turbo/
.nuxt/

# Logs
*.log
npm-debug.log*
yarn-error.log*

# OS
Thumbs.db
.DS_Store

# Testing
coverage/
.nyc_output/

# Temp
*.tmp
temp/

# Database
*.db
*.sqlite

# Package manager
package-lock.json
yarn.lock
bun.lockb
'
    
    print_success "Root configs created"
}

################################################################################
# STEP 3: Create Backend Files
################################################################################

step_3_backend_files() {
    print_step "Step 3: Creating backend configuration files..."
    
    # backend/package.json
    create_file "backend/package.json" '{
  "name": "njoki-homestays-api",
  "version": "1.0.0",
  "description": "Njoki Homestays Booking API",
  "type": "module",
  "scripts": {
    "dev": "hono dev src/index.ts --port 3001",
    "build": "bun build src/index.ts --outdir dist --target bun",
    "start": "bun dist/index.js",
    "db:push": "drizzle-kit push:pg",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "test": "bun test",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "dependencies": {
    "hono": "^4.0.0",
    "drizzle-orm": "^0.29.0",
    "pg": "^8.11.0",
    "zod": "^3.22.0",
    "dotenv": "^16.3.1",
    "@sendgrid/mail": "^8.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/pg": "^8.11.0",
    "typescript": "^5.3.0",
    "drizzle-kit": "^0.20.0",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "prettier": "^3.1.0"
  }
}'
    
    # backend/tsconfig.json
    create_file "backend/tsconfig.json" '{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}'
    
    # backend/.env
    create_file "backend/.env" 'NODE_ENV=development
PORT=3001
HOST=localhost

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/njoki_homestays_dev

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@njoki-homestays.com

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug'
    
    # backend/drizzle.config.ts
    create_file "backend/drizzle.config.ts" 'import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})'
    
    # backend/.eslintrc.json
    create_file "backend/.eslintrc.json" '{
  "env": {
    "node": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
}'
    
    # backend/prettier.config.json
    create_file "backend/prettier.config.json" '{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}'
    
    print_success "Backend configs created"
}

################################################################################
# STEP 4: Create Frontend Files
################################################################################

step_4_frontend_files() {
    print_step "Step 4: Creating frontend configuration files..."
    
    # frontend/package.json
    create_file "frontend/package.json" '{
  "name": "njoki-homestays-frontend",
  "version": "1.0.0",
  "description": "Njoki Homestays Booking Platform",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx}\" \"app/**/*.{ts,tsx}\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0"
  }
}'
    
    # frontend/tsconfig.json
    create_file "frontend/tsconfig.json" '{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*", "./app/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}'
    
    # frontend/next.config.js
    create_file "frontend/next.config.js" '/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "njoki-homestays.com"],
  },
}

module.exports = nextConfig'
    
    # frontend/.env.local
    create_file "frontend/.env.local" 'NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_GA_ID=your_google_analytics_id_here'
    
    # frontend/tailwind.config.ts
    create_file "frontend/tailwind.config.ts" 'import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D2691E",
        secondary: "#2D5016",
        accent: "#F0A04D",
      },
    },
  },
  plugins: [],
}
export default config'
    
    # frontend/postcss.config.js
    create_file "frontend/postcss.config.js" 'module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}'
    
    # frontend/.eslintrc.json
    create_file "frontend/.eslintrc.json" '{
  "extends": "next/core-web-vitals",
  "rules": {
    "react-hooks/rules-of-hooks": "warn",
    "@next/next/no-img-element": "warn"
  }
}'
    
    # frontend/prettier.config.json
    create_file "frontend/prettier.config.json" '{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}'
    
    print_success "Frontend configs created"
}

################################################################################
# STEP 5: Create Documentation Files
################################################################################

step_5_documentation() {
    print_step "Step 5: Creating documentation files..."
    
    # README.md
    create_file "README.md" '# Njoki Homestays - Booking Platform

A modern, full-stack web application for managing property bookings without user authentication.

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### Backend
- **Hono** - Lightweight HTTP framework
- **Bun** - Fast JavaScript runtime
- **PostgreSQL** - Reliable database
- **Drizzle ORM** - Type-safe database access

## Project Status

**Phase 1: Environment Setup** ✓ COMPLETE
- Directory structure created
- Configuration files ready
- Ready for Phase 2

## Getting Started

### Prerequisites
- Bun 1.0+ or Node.js 18+
- PostgreSQL 14+

### Next Steps (Phase 2)
```bash
cd backend && bun install
cd ../frontend && bun install
```

See PHASED_IMPLEMENTATION_PLAN.md for complete information.

---
**Version:** 1.0 | **Status:** Phase 1 Complete
'
    
    # docs directory files
    create_file "docs/SETUP.md" "# Setup Guide\n\nSee PHASED_IMPLEMENTATION_PLAN.md"
    create_file "docs/API.md" "# API Documentation\n\nWill be completed in Phase 4"
    create_file "docs/DATABASE.md" "# Database Schema\n\nWill be completed in Phase 3"
    create_file "docs/DEPLOYMENT.md" "# Deployment Guide\n\nWill be completed in Phase 8"
    
    print_success "Documentation created"
}

################################################################################
# STEP 6: Initialize Git
################################################################################

step_6_git_init() {
    print_step "Step 6: Initializing Git repository..."
    
    if [ ! -d ".git" ]; then
        git init
        git config user.name "Njoki Homestays Developer"
        git config user.email "dev@njoki-homestays.com"
        print_success "Git repository initialized"
    else
        print_info "Git repository already exists"
    fi
}

################################################################################
# STEP 7: Create Placeholder Source Files
################################################################################

step_7_placeholder_files() {
    print_step "Step 7: Creating placeholder source files..."
    
    # Backend placeholders
    create_file "backend/src/index.ts" "// Backend entry point - will be implemented in Phase 4
export default {}"
    
    create_file "backend/src/db/schema.ts" "// Database schema - will be implemented in Phase 3
export {}"
    
    create_file "backend/src/db/index.ts" "// Database connection - will be implemented in Phase 3
export {}"
    
    create_file "backend/src/middleware/index.ts" "// Middleware - will be implemented in Phase 4
export function setupMiddleware() {}"
    
    create_file "backend/src/services/emailService.ts" "// Email service - will be implemented in Phase 4
export {}"
    
    create_file "backend/src/utils/validators.ts" "// Validation schemas - will be implemented in Phase 4
export {}"
    
    create_file "backend/src/types/index.ts" "// TypeScript types - will be implemented in Phase 4
export type Unit = any
export type Booking = any
export type Review = any"
    
    # Frontend placeholders
    create_file "frontend/app/layout.tsx" "export default function RootLayout() {
  return (
    <html>
      <body>Loading...</body>
    </html>
  )
}"
    
    create_file "frontend/app/page.tsx" "export default function Home() {
  return <div>Home Page - will be implemented in Phase 7</div>
}"
    
    create_file "frontend/src/lib/api.ts" "// API client - will be implemented in Phase 6
export {}"
    
    create_file "frontend/src/types/index.ts" "// Frontend types - will be implemented in Phase 6
export type Unit = any
export type Booking = any"
    
    print_success "Placeholder files created"
}

################################################################################
# STEP 8: Create Phase Documentation
################################################################################

step_8_phase_docs() {
    print_step "Step 8: Creating phase documentation..."
    
    create_file "PHASE_1_COMPLETE.md" "# Phase 1: Environment Setup - COMPLETE ✓

**Completed at:** $(date)

## What Was Done

- Directory structure created
- Configuration files generated
- Git initialized
- Placeholder files created

## Project Structure

\`\`\`
njoki-homestays/
├── backend/          (Backend API)
├── frontend/         (Next.js app)
├── database/         (Schemas & migrations)
├── docs/            (Documentation)
├── .gitignore
├── README.md
└── .git/
\`\`\`

## Files Created

**Backend:**
- package.json, tsconfig.json
- .env, drizzle.config.ts
- .eslintrc.json, prettier.config.json

**Frontend:**
- package.json, tsconfig.json
- .env.local, next.config.js
- tailwind.config.ts, postcss.config.js
- .eslintrc.json, prettier.config.json

**Configuration:**
- .gitignore
- Documentation structure

## Next: Phase 2

Ready to proceed to Phase 2: Backend Project Setup

Run these commands:
\`\`\`bash
cd backend && bun install
cd ../frontend && bun install
\`\`\`

See PHASED_IMPLEMENTATION_PLAN.md for details.
"
    
    print_success "Phase documentation created"
}

################################################################################
# FINAL SUMMARY
################################################################################

print_summary() {
    print_header "PHASE 1 COMPLETE ✓"
    
    echo "🎉 Environment setup finished successfully!"
    echo ""
    echo "📁 Project Structure:"
    echo "   njoki-homestays/"
    echo "   ├── backend/          (API server)"
    echo "   ├── frontend/         (Web app)"
    echo "   ├── database/         (Schema)"
    echo "   └── docs/            (Documentation)"
    echo ""
    echo "✓ Created:"
    echo "   • 15+ configuration files"
    echo "   • Directory structure"
    echo "   • Git repository"
    echo "   • Placeholder source files"
    echo "   • Phase documentation"
    echo ""
    echo "⏭️  Next: Phase 2 - Backend Project Setup"
    echo ""
    echo "Run these commands to proceed:"
    echo "   ${CYAN}cd backend && bun install${NC}"
    echo "   ${CYAN}cd ../frontend && bun install${NC}"
    echo ""
    echo "Then see PHASED_IMPLEMENTATION_PLAN.md for Phase 2 instructions"
    echo ""
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    phase_1_start
    
    step_1_directories
    step_2_root_configs
    step_3_backend_files
    step_4_frontend_files
    step_5_documentation
    step_6_git_init
    step_7_placeholder_files
    step_8_phase_docs
    
    print_summary
}

# Run main function
main "$@"