# HackSL Website

**Hack Sri Lanka** – Connecting Sri Lanka's Tech Innovators, one hackathon at a time.

An open-source platform for discovering hackathons and tech events across Sri Lanka. Built with Next.js, Tailwind CSS, and an Airbnb-inspired design with purple branding.

## Features

- **Hackathon directory** – Browse and filter hackathons by location, status, length, and tags
- **Blog** – Community updates and guides
- **Team & partners** – Showcase team members and partner organizations
- **Community links** – WhatsApp, LinkedIn, Facebook, Instagram
- **Admin panel** – Username/password authentication to add and manage hackathons
- **Fellows program** – Apply to be a HackSL University Ambassador

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/hacksl-site.git
cd hacksl-site
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file and adjust as needed:

```bash
cp .env.example .env
```

| Variable | Description | Default (dev) |
|----------|-------------|---------------|
| `HACKSL_ADMIN_USERNAME` | Admin login username | `admin` |
| `HACKSL_ADMIN_PASSWORD` | Admin login password | `hacksl-admin-2025` |
| `HACKSL_ADMIN_SECRET` | Secret for signing session tokens | `hacksl-admin-2025` |
| `NEXT_PUBLIC_PORTAL_API_URL` | Public URL of the .NET portal backend (see `/backend`), used by the browser for signup/login/profile | `http://localhost:5080` |
| `PORTAL_API_URL` | Same backend, used server-side by the admin members proxy | `http://localhost:5080` |

For production, use strong, unique values.

> **Portal backend:** The member portal (signup, login, profile, team matching)
> talks to the separate .NET API in [`/backend`](./backend). It must be deployed
> somewhere reachable (Vercel does not host .NET) and `NEXT_PUBLIC_PORTAL_API_URL`
> set to that public HTTPS URL. If it is not configured in production, the portal
> pages fail gracefully with a "portal is not available" message instead of
> attempting an (unreachable) `localhost` request.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm start
```

## Project Structure

```
hacksl-site/
├── src/
│   ├── app/              # Next.js App Router (pages, layout, API routes)
│   │   ├── api/          # API routes (auth, admin, hackathons)
│   │   └── admin/        # Admin page
│   ├── components/       # React components
│   └── lib/              # Utilities (auth, hackathon types)
├── data/
│   └── hackathons.json   # Hackathon data
├── public/               # Static assets (logo, team photos, partners)
└── .env.example          # Environment variable template
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |

## Contributing

Contributions are welcome! Here’s how:

1. **Fork** the repository
2. **Create a branch** (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m 'Add some feature'`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. **Open a Pull Request**

For bug reports and feature requests, please use [GitHub Issues](https://github.com/your-org/hacksl-site/issues).

## Deployment (Vercel)

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project** → select your repo
3. Add environment variables in **Project Settings** → **Environment Variables**
4. Deploy

**Note:** On Vercel, admin panel edits may not persist (ephemeral file system). For lasting changes, update `data/hackathons.json` in Git and redeploy, or connect a database.

## License

This project is open source and available under the [MIT License](LICENSE).

## Links

- [LinkedIn](https://www.linkedin.com/company/hacksl/)
- [Facebook](https://www.facebook.com/hacksl.tech/)
- [Instagram](https://www.instagram.com/hack.sl)
- [WhatsApp Community](https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d)
