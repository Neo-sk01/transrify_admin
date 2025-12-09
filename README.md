# Transrify Admin Dashboard

A Next.js admin dashboard for monitoring Transrify duress PIN authentication system. This dashboard provides real-time monitoring of sessions, incidents, and event logs from the Transrify API.

## Features

- **Real-time Session Monitoring** - View all authentication sessions with results (NORMAL, DURESS, FAIL)
- **Incident Tracking** - Monitor security incidents with GPS coordinates and status
- **Event Log Viewer** - Comprehensive event logging with tenant isolation
- **Auto-refresh Dashboard** - Live updates every 2 seconds
- **Responsive Design** - Works on desktop and mobile devices

## Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the Transrify API configuration in `.env`:

```bash
TRANSRIFY_API_BASE_URL=http://localhost:3001  # Your Transrify API server URL
ADMIN_ACCESS_TOKEN=your_secure_admin_token    # Admin authentication token
S3_BUCKET=transrify2                          # S3 bucket name for evidence
S3_ACCESS_KEY=your_s3_access_key              # AWS S3 access key
S3_SECRET_KEY=your_s3_secret_key              # AWS S3 secret key
S3_REGION=us-east-1                           # AWS S3 region
```

**Note:** The dashboard reads from `.env` file. If you have a `.env.local` file, it will take precedence over `.env`. To use `.env` exclusively, ensure `.env.local` doesn't exist or remove it.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Integration

The admin dashboard integrates with the Transrify API endpoints:

- `GET /v1/admin/state` - Fetches sessions, incidents, and event logs
- `GET /v1/sessions/verify/{sessionId}` - Verifies session status
- `POST /v1/sessions/login` - Authentication endpoint (for testing)
- `POST /v1/evidence/finalize` - Evidence management

## Access

- **Admin Dashboard**: `/admin` - Real-time monitoring interface
- **Demo Page**: `/demo` - Test authentication flows
