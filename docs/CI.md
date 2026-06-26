# InvestorOS CI checks

GitHub Actions workflow: `.github/workflows/investor-os-readiness.yml`

The workflow runs on pull requests and pushes to `main` or `codex/**` branches. It uses Node 22 and runs:

- `npm install`
- `npm run lint`
- `npm test`
- `npm run build`

Locally, run the full readiness gate with:

```bash
npm run check
```

The workflow intentionally avoids real Supabase or Gemini secrets. Netlify should run the full production build with actual environment variables configured in the Netlify dashboard.
