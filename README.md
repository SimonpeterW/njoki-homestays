# Njoki Homestays - Complete Booking Platform

A modern, full-stack web application for managing property bookings without user authentication. Guests can browse, book units, and submit reviews without creating accounts.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client

### Backend
- **Hono** - Lightweight HTTP framework
- **Bun** - Fast JavaScript runtime
- **TypeScript** - Type-safe backend
- **Drizzle ORM** - Type-safe database access
- **PostgreSQL** - Reliable database
- **SendGrid** - Email service

## Project Structure

```
njoki-homestays/
├── frontend/                 # Next.js application
│   ├── app/                  # Pages and layouts
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── lib/              # API calls, hooks, utilities
│   │   └── types/            # TypeScript types
│   └── public/               # Static assets
│
├── backend/                  # Hono API server
│   ├── src/
│   │   ├── db/               # Database schema and migrations
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # CORS, logging, error handling
│   │   ├── services/         # Business logic (email, etc)
│   │   ├── utils/            # Validators, helpers
│   │   └── types/            # TypeScript types
│   └── tests/                # Unit tests
│
├── database/
│   ├── migrations/           # Database schema changes
│   └── seeds/                # Sample data
│
└── docs/                     # Documentation

```

## Getting Started

### Prerequisites
- Bun 1.0+ or Node.js 18+
- PostgreSQL 14+
- Git

### Installation

```bash
# 1. Run setup (already done)
bash setup.sh

# 2. Install dependencies
cd backend && bun install
cd ../frontend && bun install

# 3. Set up database
cd ../backend
createdb njoki_homestays_dev
psql -d njoki_homestays_dev -f schema.sql
bun run db:push

# 4. Configure environment
# Update backend/.env with database URL
# Update frontend/.env.local with API URL
```

### Running Development Servers

```bash
# Terminal 1: Backend
cd backend
bun run dev
# API running on http://localhost:3001

# Terminal 2: Frontend
cd frontend
bun run dev
# Website running on http://localhost:3000
```

## API Endpoints

### Units
- `GET /api/units` - List all units
- `GET /api/units/:id` - Get unit details

### Bookings
- `POST /api/bookings` - Submit booking inquiry
- `GET /api/bookings/:reference` - Check booking status

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/:unitId` - Get unit reviews

### Health
- `GET /health` - Server health check
- `GET /api/status` - API status

## Development

### Code Style
- Prettier for formatting
- ESLint for linting
- TypeScript strict mode

### Format Code
```bash
npm run format
```

### Run Tests
```bash
bun test
```

## Deployment

### Frontend (Vercel)
```bash
vercel deploy
```

### Backend (Railway/Render)
```bash
# Prepare
bun run build

# Deploy to Railway
railway deploy
```

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m "feat: description"`
3. Push to GitHub: `git push origin feature/name`
4. Create Pull Request

## License

© 2024 Njoki Homestays. All rights reserved.

## Support

- GitHub Issues: Report bugs
- Email: support@njoki-homestays.com
- WhatsApp: +254712345678

---

**Happy Building! 🚀**
