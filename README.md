# HackSL Community

**Hack Sri Lanka** – Connecting Sri Lanka's Tech Innovators, one hackathon at a time.

Built with Next.js, Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin

- Go to `/admin` and sign in with username and password.
- Default (dev): `admin` / `hacksl-admin-2025`
- Production: set `HACKSL_ADMIN_USERNAME` and `HACKSL_ADMIN_PASSWORD` in your environment.

## Deploy on Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and **Import Project** → select your repo
3. Add environment variables in Project Settings → Environment Variables:
   - `HACKSL_ADMIN_USERNAME` – admin username
   - `HACKSL_ADMIN_PASSWORD` – admin password
   - `HACKSL_ADMIN_SECRET` – secret for signing sessions
4. Deploy

**Note:** On Vercel, edits via the admin panel may not persist (file system is ephemeral). For lasting changes, update `data/hackathons.json` in Git and redeploy, or connect a database later.

## Links

- [LinkedIn](https://www.linkedin.com/company/hacksl/)
- [Facebook](https://www.facebook.com/hacksl.tech/)
- [Instagram](https://www.instagram.com/hack.sl)
- [WhatsApp Community](https://whatsapp.com/channel/0029VafzTTaLY6d3MqQpTX1d)
