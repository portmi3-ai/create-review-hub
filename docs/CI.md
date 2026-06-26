# InvestorOS CI checks

The GitHub connector blocked creation of a `.github/workflows` file in this session, so this document captures the CI configuration that should be added in GitHub or from a local checkout.

Create `.github/workflows/investor-os-readiness.yml` with the following workflow:

```yaml
name: InvestorOS readiness

on:
  pull_request:
  push:
    branches:
      - main
      - 'codex/**'

jobs:
  readiness:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Run readiness checks
        run: node scripts/readiness-check.mjs
```

The workflow intentionally avoids real Supabase or Gemini secrets. Netlify should run the full production build with actual environment variables configured in the Netlify dashboard.
